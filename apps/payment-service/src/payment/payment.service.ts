import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PrismaService } from "../prisma.service";
import { MpesaService } from "./mpesa.service";

type PaymentRequest = {
  userId?: string;
  amount: number;
  method: "mpesa" | "cash";
  phone?: string;
  orderId?: string;
};

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mpesa: MpesaService,
    @Inject("MESSAGE_BROKER") private readonly broker: ClientProxy
  ) {}

  async initiateStkPush(payload: PaymentRequest) {
    const userId = payload.userId?.trim() || "guest-buyer";
    const reference = payload.orderId ?? `pay_${Date.now()}`;

    await this.prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@jikoni.local`,
        phone: `${userId}-phone`,
        passwordHash: "guest",
        name: userId === "guest-buyer" ? "Guest Buyer" : "Buyer",
        role: "buyer"
      }
    });

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        amount: payload.amount,
        currency: "KES",
        method: payload.method === "cash" ? "Pay on delivery" : "M-Pesa",
        reference,
        status: "pending"
      }
    });

    this.broker.emit("payment.initiated", {
      paymentId: payment.id,
      orderId: reference,
      amount: payment.amount,
      method: payment.method,
      timestamp: new Date().toISOString()
    });

    if (payload.method === "cash") {
      return {
        paymentId: payment.id,
        reference: payment.reference,
        status: payment.status,
        method: payment.method
      };
    }

    if (!payload.phone) {
      throw new Error("Missing M-Pesa phone number.");
    }

    const stk = await this.mpesa.requestStkPush({
      amount: payload.amount,
      phone: payload.phone,
      reference
    });

    if (!stk.ok) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: "failed" }
      });
      this.broker.emit("payment.failed", {
        paymentId: payment.id,
        orderId: reference,
        timestamp: new Date().toISOString()
      });
      throw new Error("Failed to initiate STK Push.");
    }

    return {
      paymentId: payment.id,
      reference: payment.reference,
      status: payment.status,
      method: payment.method,
      stk: stk.data
    };
  }

  async handleCallback(payload: Record<string, unknown>) {
    const body = payload as any;
    const checkoutId =
      body?.CheckoutRequestID ??
      body?.Body?.stkCallback?.CheckoutRequestID ??
      null;
    const accountReference =
      body?.AccountReference ??
      body?.Body?.stkCallback?.CallbackMetadata?.Item?.find?.(
        (item: any) => item?.Name === "AccountReference"
      )?.Value ??
      null;

    if (!checkoutId && !accountReference) {
      return { ok: false, message: "Missing CheckoutRequestID" };
    }

    const resultCode =
      body?.ResultCode ??
      body?.Body?.stkCallback?.ResultCode ??
      null;

    const status = resultCode === 0 ? "completed" : "failed";

    await this.prisma.payment.updateMany({
      where: accountReference ? { reference: accountReference } : { reference: checkoutId },
      data: { status }
    });

    if (status === "completed") {
      this.broker.emit("payment.completed", {
        orderId: accountReference ?? checkoutId,
        timestamp: new Date().toISOString()
      });
    } else {
      this.broker.emit("payment.failed", {
        orderId: accountReference ?? checkoutId,
        timestamp: new Date().toISOString()
      });
    }

    return { ok: true, reference: accountReference ?? checkoutId, status };
  }

  async completeCashPayment(orderId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { reference: orderId, method: "Pay on delivery" }
    });
    if (!payment || payment.status === "completed") return;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: "completed", completedAt: new Date() }
    });

    this.broker.emit("payment.completed", {
      orderId,
      timestamp: new Date().toISOString()
    });
  }

  async refundPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId }
    });
    if (!payment) {
      return { ok: false, message: "Payment not found." };
    }
    if (payment.status === "refunded") {
      return { ok: true, status: payment.status };
    }

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: "refunded", completedAt: new Date() }
    });

    this.broker.emit("payment.refunded", {
      paymentId: updated.id,
      orderId: updated.reference,
      timestamp: new Date().toISOString()
    });

    return { ok: true, status: updated.status };
  }

}
