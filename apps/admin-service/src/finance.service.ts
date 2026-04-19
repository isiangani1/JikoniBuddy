import { Injectable } from "@nestjs/common";
import { Prisma, Transaction, TransactionStatus, TransactionType, Wallet } from "@prisma/client";
import { PrismaService } from "./prisma.service";

type JsonRecord = Record<string, Prisma.JsonValue>;

type FinanceTransaction = Transaction & {
  wallet: Wallet;
};

function asJsonRecord(value: Prisma.JsonValue | null | undefined): JsonRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as JsonRecord;
}

function asNumber(value: Prisma.JsonValue | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asString(value: Prisma.JsonValue | undefined): string | null {
  return typeof value === "string" ? value : null;
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(days: number) {
    const windowDays = Math.min(120, Math.max(7, Number.isFinite(days) ? days : 30));
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

    const [transactions, wallets] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { createdAt: { gte: since } },
        include: { wallet: true },
        orderBy: { createdAt: "desc" }
      }),
      this.prisma.wallet.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      })
    ]);

    const withdrawals = transactions.filter((txn) => txn.type === TransactionType.withdrawal);
    const sellerEarnings = transactions.filter(
      (txn) => txn.type === TransactionType.earning && txn.wallet.type === "seller"
    );
    const buddyEarnings = transactions.filter(
      (txn) => txn.type === TransactionType.earning && txn.wallet.type === "buddy"
    );
    const failedWithdrawals = withdrawals.filter(
      (txn) => txn.status === TransactionStatus.failed || txn.status === TransactionStatus.reversed
    );

    const breakdown = this.buildRevenueBreakdown(sellerEarnings, buddyEarnings);
    const settlementPipeline = {
      total: withdrawals.length,
      pending: withdrawals.filter((txn) => txn.status === TransactionStatus.pending).length,
      processing: withdrawals.filter((txn) => txn.status === TransactionStatus.processing).length,
      paid: withdrawals.filter((txn) => txn.status === TransactionStatus.success).length,
      failed: failedWithdrawals.length,
      reversed: withdrawals.filter((txn) => txn.status === TransactionStatus.reversed).length
    };

    const successRate =
      settlementPipeline.total === 0 ? 1 : settlementPipeline.paid / settlementPipeline.total;
    const failureRate =
      settlementPipeline.total === 0 ? 0 : settlementPipeline.failed / settlementPipeline.total;

    const latencySamples = withdrawals
      .map((txn) => {
        const metadata = asJsonRecord(txn.metadata);
        const requestedAt = asString(metadata.requestedAt);
        const processedAt = asString(metadata.processedAt);
        if (!requestedAt || !processedAt) return null;
        const start = new Date(requestedAt).getTime();
        const end = new Date(processedAt).getTime();
        if (Number.isNaN(start) || Number.isNaN(end)) return null;
        return Math.max(0, end - start);
      })
      .filter((value): value is number => value !== null);

    const avgLatencyMs =
      latencySamples.length === 0
        ? null
        : Math.round(sum(latencySamples) / latencySamples.length);

    const maxTrendVolume = Math.max(
      ...sellerEarnings.map((txn) => {
        const metadata = asJsonRecord(txn.metadata);
        return asNumber(metadata.totalAmount) ?? 0;
      }),
      1
    );

    const settlementTrendMap = new Map<
      string,
      {
        date: string;
        grossVolume: number;
        platformFees: number;
        deliveryFees: number;
        sellerNet: number;
        withdrawalCount: number;
      }
    >();

    sellerEarnings.forEach((txn) => {
      const metadata = asJsonRecord(txn.metadata);
      const key = txn.createdAt.toISOString().slice(0, 10);
      const bucket =
        settlementTrendMap.get(key) ??
        {
          date: key,
          grossVolume: 0,
          platformFees: 0,
          deliveryFees: 0,
          sellerNet: 0,
          withdrawalCount: 0
        };

      bucket.grossVolume += asNumber(metadata.totalAmount) ?? 0;
      bucket.platformFees += asNumber(metadata.platformFee) ?? 0;
      bucket.deliveryFees += asNumber(metadata.deliveryFee) ?? 0;
      bucket.sellerNet += txn.amount;
      settlementTrendMap.set(key, bucket);
    });

    withdrawals.forEach((txn) => {
      const key = txn.createdAt.toISOString().slice(0, 10);
      const bucket =
        settlementTrendMap.get(key) ??
        {
          date: key,
          grossVolume: 0,
          platformFees: 0,
          deliveryFees: 0,
          sellerNet: 0,
          withdrawalCount: 0
        };
      bucket.withdrawalCount += 1;
      settlementTrendMap.set(key, bucket);
    });

    const walletActivity = new Map<
      string,
      {
        averageWithdrawal: number;
        maxWithdrawal: number;
      }
    >();

    wallets.forEach((wallet) => {
      const walletWithdrawals = withdrawals
        .filter((txn) => txn.walletId === wallet.id)
        .map((txn) => txn.amount);
      walletActivity.set(wallet.id, {
        averageWithdrawal:
          walletWithdrawals.length === 0 ? 0 : sum(walletWithdrawals) / walletWithdrawals.length,
        maxWithdrawal: walletWithdrawals.length === 0 ? 0 : Math.max(...walletWithdrawals)
      });
    });

    const walletAnomalies = wallets
      .map((wallet) => {
        const activity = walletActivity.get(wallet.id);
        const reasons: string[] = [];
        let severity: "low" | "medium" | "critical" = "low";

        if (wallet.pendingBalance > wallet.balance * 1.5 && wallet.pendingBalance > 5000) {
          reasons.push("Pending balance is materially higher than available balance.");
          severity = "medium";
        }

        if (wallet.balance > 150000) {
          reasons.push("Available balance is unusually high for a single wallet.");
          severity = "medium";
        }

        if (
          activity &&
          activity.averageWithdrawal > 0 &&
          activity.maxWithdrawal > activity.averageWithdrawal * 2.5 &&
          activity.maxWithdrawal > 10000
        ) {
          reasons.push("Large withdrawal spike compared with recent payout behavior.");
          severity = "critical";
        }

        if (reasons.length === 0) return null;

        return {
          walletId: wallet.id,
          userId: wallet.userId,
          userName: wallet.user.name ?? wallet.user.email,
          role: wallet.user.role,
          type: wallet.type,
          balance: wallet.balance,
          pendingBalance: wallet.pendingBalance,
          currency: wallet.currency,
          severity,
          reasons
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => {
        const rank = { critical: 3, medium: 2, low: 1 };
        return rank[b.severity] - rank[a.severity] || b.pendingBalance - a.pendingBalance;
      })
      .slice(0, 8);

    const recentFailures = failedWithdrawals.slice(0, 8).map((txn) => {
      const metadata = asJsonRecord(txn.metadata);
      return {
        id: txn.id,
        reference: txn.reference ?? txn.id,
        amount: txn.amount,
        currency: txn.currency,
        createdAt: txn.createdAt,
        status: txn.status,
        reason:
          asString(metadata.failureReason) ??
          asString(metadata.reason) ??
          asString(metadata.note) ??
          "No reason captured"
      };
    });

    const topPendingWallets = wallets
      .filter((wallet) => wallet.pendingBalance > 0)
      .sort((a, b) => b.pendingBalance - a.pendingBalance)
      .slice(0, 10)
      .map((wallet) => ({
        walletId: wallet.id,
        userId: wallet.userId,
        userName: wallet.user.name ?? wallet.user.email,
        role: wallet.user.role,
        walletType: wallet.type,
        currency: wallet.currency,
        balance: wallet.balance,
        pendingBalance: wallet.pendingBalance
      }));

    return {
      windowDays,
      summary: {
        totalWithdrawals: settlementPipeline.total,
        pendingSettlements: settlementPipeline.pending,
        processingSettlements: settlementPipeline.processing,
        paidSettlements: settlementPipeline.paid,
        failedSettlements: settlementPipeline.failed,
        payoutSuccessRate: successRate,
        payoutFailureRate: failureRate,
        avgLatencyMs
      },
      revenueBreakdown: breakdown,
      settlementPipeline,
      settlementTrend: Array.from(settlementTrendMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date)
      ),
      walletAnomalies,
      recentFailures,
      topPendingWallets,
      reference: {
        maxTrendVolume
      }
    };
  }

  private buildRevenueBreakdown(sellerEarnings: FinanceTransaction[], buddyEarnings: FinanceTransaction[]) {
    const grossVolume = sum(
      sellerEarnings.map((txn) => {
        const metadata = asJsonRecord(txn.metadata);
        return asNumber(metadata.totalAmount) ?? 0;
      })
    );
    const platformFees = sum(
      sellerEarnings.map((txn) => {
        const metadata = asJsonRecord(txn.metadata);
        return asNumber(metadata.platformFee) ?? 0;
      })
    );
    const deliveryFees = sum(
      sellerEarnings.map((txn) => {
        const metadata = asJsonRecord(txn.metadata);
        return asNumber(metadata.deliveryFee) ?? 0;
      })
    );
    const sellerNet = sum(sellerEarnings.map((txn) => txn.amount));
    const buddyPayouts = sum(buddyEarnings.map((txn) => txn.amount));
    const commissions = platformFees + deliveryFees;

    return {
      grossVolume,
      platformFees,
      deliveryFees,
      commissions,
      sellerNet,
      buddyPayouts
    };
  }
}
