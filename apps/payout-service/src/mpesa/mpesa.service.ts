import { Injectable, Logger } from "@nestjs/common";
import { Prisma, Transaction } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { PayoutPublisher } from "../payout/payout.publisher";

type MpesaToken = { token: string; expiresAt: number };
const asJsonObject = (value: Prisma.JsonValue | null | undefined): Prisma.JsonObject => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Prisma.JsonObject;
  }
  return {};
};

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);
  private cachedToken: MpesaToken | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly publisher: PayoutPublisher
  ) {}

  async getAccessToken() {
    const now = Date.now();
    if (this.cachedToken && this.cachedToken.expiresAt > now) {
      return this.cachedToken.token;
    }

    const baseUrl = process.env.DARAJA_BASE_URL ?? "https://sandbox.safaricom.co.ke";
    const key = process.env.DARAJA_CONSUMER_KEY ?? "";
    const secret = process.env.DARAJA_CONSUMER_SECRET ?? "";
    const auth = Buffer.from(`${key}:${secret}`).toString("base64");

    const res = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    if (!res.ok) {
      throw new Error("Failed to fetch Daraja access token.");
    }
    const data = (await res.json()) as { access_token: string; expires_in: string };
    const expiresIn = Number(data.expires_in ?? 3600);
    const token = data.access_token;
    this.cachedToken = { token, expiresAt: now + (expiresIn - 60) * 1000 };
    return token;
  }

  normalizePhone(value: string) {
    const cleaned = value.replace(/\s+/g, "");
    if (cleaned.startsWith("07")) return `254${cleaned.slice(1)}`;
    if (cleaned.startsWith("+254")) return cleaned.slice(1);
    return cleaned;
  }

  async sendB2C({
    transactionId,
    amount,
    phone
  }: {
    transactionId: string;
    amount: number;
    phone: string;
  }) {
    const existing = await this.prisma.transaction.findUnique({
      where: { id: transactionId }
    });
    if (existing && existing.status === "success") {
      return { status: 200, data: { message: "Already settled" } };
    }

    const token = await this.getAccessToken();
    const baseUrl = process.env.DARAJA_BASE_URL ?? "https://sandbox.safaricom.co.ke";
    const payload = {
      InitiatorName: process.env.DARAJA_INITIATOR_NAME ?? "",
      SecurityCredential: process.env.DARAJA_SECURITY_CREDENTIAL ?? "",
      CommandID: "BusinessPayment",
      Amount: Math.round(amount),
      PartyA: process.env.DARAJA_SHORTCODE ?? "",
      PartyB: this.normalizePhone(phone),
      Remarks: "Jikoni Buddy Payout",
      QueueTimeOutURL: process.env.DARAJA_TIMEOUT_URL ?? "",
      ResultURL: process.env.DARAJA_RESULT_URL ?? "",
      Occassion: "Jikoni Buddy"
    };

    const res = await fetch(`${baseUrl}/mpesa/b2c/v1/paymentrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    this.logger.log(`Daraja B2C request ${transactionId} status ${res.status}`);
    const existingMetadata = asJsonObject(existing?.metadata);
    const responseMetadata = asJsonObject(
      typeof data === "object" && data !== null ? (data as Prisma.JsonValue) : undefined
    );
    const existingRetry =
      typeof existingMetadata.retryCount === "number" ? existingMetadata.retryCount : 0;
    const existingRequestedAt =
      typeof existingMetadata.requestedAt === "string"
        ? existingMetadata.requestedAt
        : new Date().toISOString();

    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: "processing",
        metadata: {
          ...responseMetadata,
          darajaRequest: payload,
          mpesaNumber: phone,
          payoutAmount: amount,
          retryCount: existingRetry,
          requestedAt: existingRequestedAt
        }
      }
    });

    return { status: res.status, data };
  }

  async handleCallback(reference: string, status: "success" | "failed", payload: unknown) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { reference }
    });
    if (!transaction) {
      return { ok: false, message: "Transaction not found" };
    }

    if (transaction.status === "success") {
      return { ok: true, message: "Already settled" };
    }

    if (status === "success") {
      const transactionMetadata = asJsonObject(transaction.metadata);
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "success",
          metadata: {
            ...transactionMetadata,
            darajaResult: payload as Prisma.InputJsonValue,
            processedAt: new Date().toISOString()
          }
        }
      });
      this.publisher.emitCompleted({
        transactionId: transaction.id,
        userId: transaction.userId,
        amount: transaction.amount,
        reference: transaction.reference
      });
      return { ok: true };
    }

    await this.prisma.$transaction([
      this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "failed",
          metadata: {
            ...asJsonObject(transaction.metadata),
            darajaResult: payload as Prisma.InputJsonValue,
            processedAt: new Date().toISOString()
          }
        }
      }),
      this.prisma.wallet.update({
        where: { id: transaction.walletId },
        data: {
          balance: { increment: transaction.amount }
        }
      })
    ]);
    this.publisher.emitFailed({
      transactionId: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount,
      reference: transaction.reference
    });

    await this.scheduleRetry(transaction);
    return { ok: true };
  }

  private async scheduleRetry(transaction: Transaction) {
    const maxRetries = Number(process.env.DARAJA_MAX_RETRIES ?? 3);
    const metadata = asJsonObject(transaction.metadata);
    const retryCount =
      typeof metadata.retryCount === "number" ? metadata.retryCount : 0;
    if (retryCount >= maxRetries) return;

    const backoffMs = Math.pow(2, retryCount) * 1000;
    setTimeout(async () => {
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          metadata: { ...metadata, retryCount: retryCount + 1 }
        }
      });

      const phone = typeof metadata.mpesaNumber === "string" ? metadata.mpesaNumber : null;
      const amount = typeof metadata.payoutAmount === "number" ? metadata.payoutAmount : null;
      if (!phone || !amount) return;
      await this.sendB2C({ transactionId: transaction.id, amount, phone });
    }, backoffMs);
  }
}
