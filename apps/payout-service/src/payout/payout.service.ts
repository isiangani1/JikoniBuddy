import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Prisma, Transaction, Wallet } from "@prisma/client";
import { MpesaService } from "../mpesa/mpesa.service";
import { PayoutMethodDto, WalletType, WithdrawRequestDto } from "./dto";

@Injectable()
export class PayoutService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mpesaService: MpesaService
  ) {}
  private settlementTimer?: NodeJS.Timeout;
  private weeklyTimer?: NodeJS.Timeout;
  private otpStore = new Map<string, { code: string; expiresAt: number }>();
  private lastWeeklyRunKey: string | null = null;

  onModuleInit() {
    const intervalMs = Number(process.env.SETTLEMENT_CHECK_INTERVAL_MS ?? 60000);
    this.settlementTimer = setInterval(() => {
      this.settlePendingBalances().catch(() => undefined);
    }, intervalMs);

    const weeklyIntervalMs = Number(process.env.WEEKLY_PAYOUT_CHECK_INTERVAL_MS ?? 60 * 60 * 1000);
    this.weeklyTimer = setInterval(() => {
      this.runWeeklyPayouts().catch(() => undefined);
    }, weeklyIntervalMs);
  }

  onModuleDestroy() {
    if (this.settlementTimer) {
      clearInterval(this.settlementTimer);
    }
    if (this.weeklyTimer) {
      clearInterval(this.weeklyTimer);
    }
  }

  async getWallet(userId: string, walletType: WalletType) {
    await this.validateRoleAccess(userId, walletType);
    return this.ensureWallet(userId, walletType);
  }

  async getTransactions(userId: string, walletType?: WalletType) {
    const wallet = walletType
      ? await this.ensureWalletWithRoleCheck(userId, walletType)
      : null;
    return this.prisma.transaction.findMany({
      where: {
        userId,
        ...(wallet ? { walletId: wallet.id } : {})
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });
  }

  async requestWithdraw(dto: WithdrawRequestDto) {
    const wallet = await this.ensureWalletWithRoleCheck(dto.userId, dto.walletType);
    if (dto.amount <= 0) {
      throw new BadRequestException("Amount must be greater than 0.");
    }
    if (wallet.balance < dto.amount) {
      throw new BadRequestException("Insufficient balance.");
    }

    await this.enforceWithdrawLimits(wallet.userId);
    this.verifyOtpIfRequired(wallet.userId, dto.otp);

    const reference = `payout_${wallet.userId}_${Date.now()}`;
    const instantFeePercent = Number(process.env.INSTANT_PAYOUT_FEE_PERCENT ?? 1.0);
    const instantFee = dto.instant ? Math.max(0, (dto.amount * instantFeePercent) / 100) : 0;
    const payoutAmount = Math.max(0, dto.amount - instantFee);

    let payoutMethodId = dto.payoutMethodId ?? null;
    if (!payoutMethodId && dto.mpesaNumber) {
      const method = await this.prisma.payoutMethod.create({
        data: {
          userId: wallet.userId,
          type: "mpesa",
          label: "M-Pesa",
          details: { phone: dto.mpesaNumber },
          verified: false,
          isDefault: true
        }
      });
      payoutMethodId = method.id;
    }

    const [updatedWallet, transaction] = await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: dto.amount } }
      }),
      this.prisma.transaction.create({
        data: {
          userId: wallet.userId,
          walletId: wallet.id,
          amount: dto.amount,
          currency: wallet.currency,
          type: "withdrawal",
          status: dto.instant ? "processing" : "pending",
          reference,
          payoutMethodId,
          metadata: {
            instant: dto.instant ?? false,
            payoutAmount,
            instantFee,
            mpesaNumber: dto.mpesaNumber ?? null
          }
        }
      })
    ]);

    if (instantFee > 0) {
      await this.prisma.transaction.create({
        data: {
          userId: wallet.userId,
          walletId: wallet.id,
          amount: instantFee,
          currency: wallet.currency,
          type: "fee",
          status: "success",
          reference: `fee_${reference}`,
          metadata: { reason: "instant_payout" }
        }
      });
    }

    if (payoutMethodId && dto.mpesaNumber) {
      await this.mpesaService.sendB2C({
        transactionId: transaction.id,
        amount: payoutAmount,
        phone: dto.mpesaNumber
      });
    }

    return { wallet: updatedWallet, transaction };
  }

  async applyOrderCompleted(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { assignedBuddy: true }
    });
    if (!order) {
      throw new NotFoundException("Order not found.");
    }

    const existing = await this.prisma.transaction.findFirst({
      where: { reference: `order_${order.id}` }
    });
    if (existing) {
      return { status: "already_settled" };
    }

    const platformFeePercent = Number(process.env.PLATFORM_FEE_PERCENT ?? 15);
    const deliveryFee = Number(process.env.DELIVERY_FEE_FLAT ?? 0);
    const buddyPercent = Number(process.env.BUDDY_PAYOUT_PERCENT ?? 0.2);

    const platformFee = (order.totalAmount * platformFeePercent) / 100;
    const buddyPay = order.assignedBuddyId
      ? Math.max(0, order.totalAmount * buddyPercent)
      : 0;
    const sellerNet = Math.max(
      0,
      order.totalAmount - platformFee - deliveryFee - buddyPay
    );

    const sellerWallet = await this.ensureWallet(order.sellerId, WalletType.seller);
    const buddyWallet = order.assignedBuddyId
      ? await this.ensureWallet(order.assignedBuddyId, WalletType.buddy)
      : null;

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: sellerWallet.id },
        data: { pendingBalance: { increment: sellerNet } }
      }),
      this.prisma.transaction.create({
        data: {
          userId: sellerWallet.userId,
          walletId: sellerWallet.id,
          type: "earning",
          amount: sellerNet,
          currency: sellerWallet.currency,
          status: "pending",
          reference: `order_${order.id}`,
          metadata: {
            orderId: order.id,
            totalAmount: order.totalAmount,
            platformFee,
            deliveryFee,
            buddyPay
          }
        }
      }),
      ...(buddyWallet
        ? [
            this.prisma.wallet.update({
              where: { id: buddyWallet.id },
              data: { pendingBalance: { increment: buddyPay } }
            }),
            this.prisma.transaction.create({
              data: {
                userId: buddyWallet.userId,
                walletId: buddyWallet.id,
                type: "earning",
                amount: buddyPay,
                currency: buddyWallet.currency,
                status: "pending",
                reference: `order_${order.id}_buddy`,
                metadata: {
                  orderId: order.id,
                  totalAmount: order.totalAmount,
                  platformFee,
                  deliveryFee,
                  buddyPay
                }
              }
            })
          ]
        : [])
    ]);

    return { sellerNet, buddyPay, platformFee, deliveryFee };
  }

  async handleOrderCancelled(orderId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        type: "earning",
        status: "pending",
        reference: { startsWith: `order_${orderId}` }
      },
      include: { wallet: true }
    });

    if (!transactions.length) return { reversed: 0 };

    await this.prisma.$transaction(
      transactions.flatMap((txn: Transaction) => [
        this.prisma.wallet.update({
          where: { id: txn.walletId },
          data: { pendingBalance: { decrement: txn.amount } }
        }),
        this.prisma.transaction.update({
          where: { id: txn.id },
          data: { status: "reversed" }
        }),
        this.prisma.transaction.create({
          data: {
            userId: txn.userId,
            walletId: txn.walletId,
            type: "refund",
            amount: -Math.abs(txn.amount),
            currency: txn.currency,
            status: "success",
            reference: `refund_${orderId}`,
            metadata: { orderId }
          }
        })
      ])
    );

    return { reversed: transactions.length };
  }

  async handleOrderRefunded(orderId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        type: "earning",
        reference: { startsWith: `order_${orderId}` },
        status: { in: ["pending", "success"] }
      },
      include: { wallet: true }
    });

    if (!transactions.length) return { reversed: 0 };

    await this.prisma.$transaction(
      transactions.flatMap((txn: Transaction) => [
        this.prisma.wallet.update({
          where: { id: txn.walletId },
          data:
            txn.status === "pending"
              ? { pendingBalance: { decrement: txn.amount } }
              : { balance: { decrement: txn.amount } }
        }),
        this.prisma.transaction.update({
          where: { id: txn.id },
          data: { status: "reversed" }
        }),
        this.prisma.transaction.create({
          data: {
            userId: txn.userId,
            walletId: txn.walletId,
            type: "refund",
            amount: -Math.abs(txn.amount),
            currency: txn.currency,
            status: "success",
            reference: `refund_${orderId}`,
            metadata: { orderId, source: "payment.refunded" }
          }
        })
      ])
    );

    return { reversed: transactions.length };
  }

  async settlePendingBalances() {
    const delayHours = Number(process.env.SETTLEMENT_DELAY_HOURS ?? 24);
    const cutoff = new Date(Date.now() - delayHours * 60 * 60 * 1000);

    const pending = await this.prisma.transaction.findMany({
      where: {
        type: "earning",
        status: "pending",
        createdAt: { lte: cutoff }
      }
    });

    if (!pending.length) return { settled: 0 };

    const byWallet = new Map<string, number>();
    pending.forEach((txn: Transaction) => {
      byWallet.set(txn.walletId, (byWallet.get(txn.walletId) ?? 0) + txn.amount);
    });

    await this.prisma.$transaction([
      ...Array.from(byWallet.entries()).map(([walletId, amount]) =>
        this.prisma.wallet.update({
          where: { id: walletId },
          data: {
            pendingBalance: { decrement: amount },
            balance: { increment: amount }
          }
        })
      ),
      ...pending.map((txn: Transaction) =>
        this.prisma.transaction.update({
          where: { id: txn.id },
          data: { status: "success" }
        })
      )
    ]);

    return { settled: pending.length };
  }

  async generateOtp(userId: string) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const ttlMs = Number(process.env.PAYOUT_OTP_TTL_MS ?? 5 * 60 * 1000);
    this.otpStore.set(userId, { code, expiresAt: Date.now() + ttlMs });
    return { code, expiresInMs: ttlMs };
  }

  private verifyOtpIfRequired(userId: string, otp?: string) {
    const required = process.env.PAYOUT_OTP_REQUIRED === "true";
    if (!required) return;

    const record = this.otpStore.get(userId);
    if (!record || record.expiresAt < Date.now()) {
      throw new BadRequestException("OTP expired. Request a new code.");
    }
    if (!otp || otp !== record.code) {
      throw new BadRequestException("Invalid OTP code.");
    }
    this.otpStore.delete(userId);
  }

  private async enforceWithdrawLimits(userId: string) {
    const maxPerDay = Number(process.env.PAYOUT_WITHDRAW_MAX_PER_DAY ?? 5);
    const windowHours = Number(process.env.PAYOUT_WITHDRAW_WINDOW_HOURS ?? 24);
    const cutoff = new Date(Date.now() - windowHours * 60 * 60 * 1000);
    const recent = await this.prisma.transaction.count({
      where: {
        userId,
        type: "withdrawal",
        createdAt: { gte: cutoff }
      }
    });
    if (recent >= maxPerDay) {
      throw new BadRequestException("Withdrawal limit reached. Try again later.");
    }
  }

  private async runWeeklyPayouts() {
    const day = Number(process.env.WEEKLY_PAYOUT_DAY ?? 5); // 0=Sun, 5=Fri
    const hour = Number(process.env.WEEKLY_PAYOUT_HOUR ?? 9); // 9 AM
    const now = new Date();
    if (now.getDay() !== day || now.getHours() !== hour) return;

    const key = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    if (this.lastWeeklyRunKey === key) return;
    this.lastWeeklyRunKey = key;

    const wallets: (Wallet & { user: { payoutMethods: any[] } })[] =
      await this.prisma.wallet.findMany({
      where: { balance: { gt: 0 } },
      include: {
        user: {
          include: { payoutMethods: true }
        }
      }
    });

    for (const wallet of wallets) {
      const defaultMethod = wallet.user.payoutMethods.find((m) => m.isDefault);
      if (!defaultMethod) continue;

      const amount = wallet.balance;
      await this.prisma.$transaction([
        this.prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { decrement: amount } }
        }),
        this.prisma.transaction.create({
          data: {
            userId: wallet.userId,
            walletId: wallet.id,
            amount,
            currency: wallet.currency,
            type: "withdrawal",
            status: "processing",
            payoutMethodId: defaultMethod.id,
            reference: `weekly_${key}_${wallet.id}`,
            metadata: { scheduled: true }
          }
        })
      ]);
    }
  }

  async savePayoutMethod(dto: PayoutMethodDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException("User not found.");
    }
    this.assertUserRole(user.role);

    if (dto.isDefault) {
      await this.prisma.payoutMethod.updateMany({
        where: { userId: dto.userId },
        data: { isDefault: false }
      });
    }

    return this.prisma.payoutMethod.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        label: dto.label ?? "",
        details: (dto.details ?? {}) as Prisma.InputJsonValue,
        isDefault: dto.isDefault ?? false,
        verified: false
      }
    });
  }

  private async ensureWallet(userId: string, walletType: WalletType) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const existing = await this.prisma.wallet.findFirst({
      where: { userId, type: walletType }
    });
    if (existing) return existing;

    return this.prisma.wallet.create({
      data: {
        userId,
        type: walletType,
        balance: 0,
        pendingBalance: 0,
        currency: "KES"
      }
    });
  }

  private async ensureWalletWithRoleCheck(userId: string, walletType: WalletType) {
    await this.validateRoleAccess(userId, walletType);
    return this.ensureWallet(userId, walletType);
  }

  async validateRoleAccess(userId: string, walletType: WalletType) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found.");
    }
    if (user.role === "admin") return;
    if (walletType === WalletType.seller && user.role !== "seller") {
      throw new ForbiddenException("Seller wallet access denied.");
    }
    if (walletType === WalletType.buddy && user.role !== "buddy") {
      throw new ForbiddenException("Buddy wallet access denied.");
    }
  }

  async validatePayoutUserRole(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found.");
    }
    this.assertUserRole(user.role);
  }

  private assertUserRole(role: string) {
    if (role === "admin" || role === "buddy" || role === "seller") return;
    throw new ForbiddenException("User role not eligible for payouts.");
  }
}
