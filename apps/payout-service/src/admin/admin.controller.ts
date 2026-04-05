import {
  Controller,
  Get,
  Header,
  Query,
  Req,
  UnauthorizedException
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Transaction, TransactionStatus, TransactionType } from "@prisma/client";
import { Request } from "express";

@Controller("admin")
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  private assertApiKey(req: Request) {
    const headerName = (process.env.API_KEY_HEADER ?? "x-api-key").toLowerCase();
    const apiKey =
      req.headers[headerName] ??
      req.headers[headerName.toLowerCase()] ??
      req.headers["x-api-key"];

    const allowed = (process.env.INTERNAL_API_KEYS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!apiKey || Array.isArray(apiKey)) {
      throw new UnauthorizedException("Missing API key.");
    }
    if (!allowed.includes(apiKey)) {
      throw new UnauthorizedException("Invalid API key.");
    }
  }

  @Get("wallets")
  async listWallets(
    @Req() req: Request,
    @Query("userId") userId?: string,
    @Query("type") type?: string,
    @Query("page") page: string = "1",
    @Query("pageSize") pageSize: string = "50"
  ) {
    this.assertApiKey(req);
    const resolvedPage = Math.max(1, Number(page) || 1);
    const resolvedSize = Math.min(200, Math.max(1, Number(pageSize) || 50));
    const where = {
      ...(userId ? { userId } : {}),
      ...(type ? { type: type as "seller" | "buddy" } : {})
    };
    const [total, items] = await this.prisma.$transaction([
      this.prisma.wallet.count({ where }),
      this.prisma.wallet.findMany({
        where,
        skip: (resolvedPage - 1) * resolvedSize,
        take: resolvedSize,
        include: {
          user: { select: { id: true, name: true, email: true, role: true } }
        }
      })
    ]);
    return { page: resolvedPage, pageSize: resolvedSize, total, items };
  }

  @Get("transactions")
  async listTransactions(
    @Req() req: Request,
    @Query("userId") userId?: string,
    @Query("status") status?: string,
    @Query("type") type?: string,
    @Query("page") page: string = "1",
    @Query("pageSize") pageSize: string = "50"
  ) {
    this.assertApiKey(req);
    const resolvedPage = Math.max(1, Number(page) || 1);
    const resolvedSize = Math.min(200, Math.max(1, Number(pageSize) || 50));
    const resolvedStatus = this.parseTransactionStatus(status);
    const resolvedType = this.parseTransactionType(type);
    const where = {
      ...(userId ? { userId } : {}),
      ...(resolvedStatus ? { status: resolvedStatus } : {}),
      ...(resolvedType ? { type: resolvedType } : {})
    };
    const [total, items] = await this.prisma.$transaction([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (resolvedPage - 1) * resolvedSize,
        take: resolvedSize
      })
    ]);
    return { page: resolvedPage, pageSize: resolvedSize, total, items };
  }

  @Get("transactions/export")
  @Header("Content-Type", "text/csv")
  async exportTransactions(
    @Req() req: Request,
    @Query("userId") userId?: string,
    @Query("status") status?: string,
    @Query("type") type?: string
  ) {
    this.assertApiKey(req);
    const resolvedStatus = this.parseTransactionStatus(status);
    const resolvedType = this.parseTransactionType(type);
    const rows: Transaction[] = await this.prisma.transaction.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(resolvedStatus ? { status: resolvedStatus } : {}),
        ...(resolvedType ? { type: resolvedType } : {})
      },
      orderBy: { createdAt: "desc" },
      take: 500
    });

    const header = [
      "id",
      "userId",
      "walletId",
      "type",
      "amount",
      "currency",
      "status",
      "reference",
      "createdAt"
    ];
    const body = rows.map((row: Transaction) =>
      [
        row.id,
        row.userId,
        row.walletId,
        row.type,
        row.amount,
        row.currency,
        row.status,
        row.reference ?? "",
        row.createdAt.toISOString()
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    );
    return [header.join(","), ...body].join("\n");
  }

  @Get("metrics")
  async getMetrics(
    @Req() req: Request,
    @Query("days") days: string = "30"
  ) {
    this.assertApiKey(req);
    const windowDays = Math.max(1, Number(days) || 30);
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

    const withdrawals: Transaction[] = await this.prisma.transaction.findMany({
      where: {
        type: TransactionType.withdrawal,
        createdAt: { gte: since }
      },
      orderBy: { createdAt: "desc" }
    });

    const total = withdrawals.length;
    const failed = withdrawals.filter((txn) => txn.status === "failed").length;
    const success = withdrawals.filter((txn) => txn.status === "success").length;
    const processing = withdrawals.filter((txn) => txn.status === "processing").length;
    const failureRate = total === 0 ? 0 : failed / total;

    const latencies = withdrawals
      .map((txn: Transaction) => {
        const metadata = (txn.metadata ?? {}) as Record<string, unknown>;
        const requestedAt = metadata.requestedAt;
        const processedAt = metadata.processedAt;
        if (typeof requestedAt !== "string" || typeof processedAt !== "string") {
          return null;
        }
        const start = new Date(requestedAt).getTime();
        const end = new Date(processedAt).getTime();
        if (Number.isNaN(start) || Number.isNaN(end)) return null;
        return Math.max(0, end - start);
      })
      .filter((value): value is number => value !== null);

    const avgLatencyMs =
      latencies.length === 0
        ? null
        : Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length);

    return {
      windowDays,
      totalWithdrawals: total,
      success,
      failed,
      processing,
      failureRate,
      avgLatencyMs
    };
  }

  @Get("metrics/history")
  async getMetricsHistory(
    @Req() req: Request,
    @Query("days") days: string = "14"
  ) {
    this.assertApiKey(req);
    const windowDays = Math.max(1, Number(days) || 14);
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
    const withdrawals: Transaction[] = await this.prisma.transaction.findMany({
      where: {
        type: TransactionType.withdrawal,
        createdAt: { gte: since }
      },
      orderBy: { createdAt: "asc" }
    });

    const buckets = new Map<string, { date: string; total: number; failed: number; success: number }>();
    withdrawals.forEach((txn: Transaction) => {
      const key = txn.createdAt.toISOString().slice(0, 10);
      if (!buckets.has(key)) {
        buckets.set(key, { date: key, total: 0, failed: 0, success: 0 });
      }
      const bucket = buckets.get(key)!;
      bucket.total += 1;
      if (txn.status === "failed") bucket.failed += 1;
      if (txn.status === "success") bucket.success += 1;
    });

    return Array.from(buckets.values());
  }

  private parseTransactionStatus(value?: string): TransactionStatus | undefined {
    if (!value) return undefined;
    return Object.values(TransactionStatus).includes(value as TransactionStatus)
      ? (value as TransactionStatus)
      : undefined;
  }

  private parseTransactionType(value?: string): TransactionType | undefined {
    if (!value) return undefined;
    return Object.values(TransactionType).includes(value as TransactionType)
      ? (value as TransactionType)
      : undefined;
  }
}
