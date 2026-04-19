import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  AssignmentStatus,
  Prisma,
  RefundStatus,
  TransactionStatus,
  TransactionType,
  WalletType
} from "@prisma/client";
import { ClientProxy } from "@nestjs/microservices";
import { PrismaService } from "./prisma.service";
import { AuditService } from "./audit.service";

type ActorContext = {
  actorId: string;
  actorRole?: string;
};

type RefundOrderPayload = ActorContext & {
  orderId: string;
  amount?: number;
  note?: string;
};

type ReassignBuddyPayload = ActorContext & {
  orderId: string;
  newBuddyId: string;
  note?: string;
};

type CreditWalletPayload = ActorContext & {
  userId: string;
  walletType: WalletType;
  amount: number;
  note?: string;
};

type FreezeUserPayload = ActorContext & {
  userId: string;
  note?: string;
};

@Injectable()
export class ActionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    @Inject("MESSAGE_BROKER") private readonly broker: ClientProxy
  ) {}

  async refundOrder(payload: RefundOrderPayload) {
    const order = await this.prisma.order.findUnique({
      where: { id: payload.orderId },
      include: {
        refundRequests: {
          include: { events: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    if (!order) throw new NotFoundException("Order not found.");

    const payment = await this.prisma.payment.findFirst({
      where: { reference: order.id },
      orderBy: { createdAt: "desc" }
    });

    const refundAmount = payload.amount && payload.amount > 0 ? payload.amount : order.totalAmount;
    const note = payload.note?.trim() || "Refund issued by admin tools.";

    const refund = await this.prisma.$transaction(async (tx) => {
      const existing = order.refundRequests[0];

      const refundRecord = existing
        ? await tx.refundRequest.update({
            where: { id: existing.id },
            data: {
              amount: refundAmount,
              status: RefundStatus.paid,
              details: note
            }
          })
        : await tx.refundRequest.create({
            data: {
              orderId: order.id,
              userId: order.buyerId,
              amount: refundAmount,
              currency: order.currency,
              reason: "Admin-issued refund",
              details: note,
              status: RefundStatus.paid
            }
          });

      await tx.refundEvent.createMany({
        data: [
          {
            refundId: refundRecord.id,
            actorId: payload.actorId,
            action: "approved",
            note
          },
          {
            refundId: refundRecord.id,
            actorId: payload.actorId,
            action: "paid",
            note
          }
        ]
      });

      if (payment && payment.status !== "refunded") {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "refunded",
            completedAt: new Date()
          }
        });

        await tx.paymentEvent.create({
          data: {
            paymentId: payment.id,
            orderId: order.id,
            status: "refunded",
            note
          }
        });
      }

      return refundRecord;
    });

    if (payment) {
      this.broker.emit("payment.refunded", {
        paymentId: payment.id,
        orderId: order.id,
        timestamp: new Date().toISOString()
      });
    }

    await this.audit.create({
      actorId: payload.actorId,
      actorRole: payload.actorRole,
      action: "refund_order",
      targetType: "order",
      targetId: order.id,
      severity: "medium",
      meta: {
        refundId: refund.id,
        amount: refundAmount,
        currency: order.currency,
        note
      }
    });

    return {
      ok: true,
      refundId: refund.id,
      orderId: order.id,
      amount: refundAmount,
      currency: order.currency
    };
  }

  async reassignBuddy(payload: ReassignBuddyPayload) {
    const order = await this.prisma.order.findUnique({
      where: { id: payload.orderId }
    });
    if (!order) throw new NotFoundException("Order not found.");

    const buddy = await this.prisma.user.findUnique({
      where: { id: payload.newBuddyId }
    });
    if (!buddy || buddy.role !== "buddy") {
      throw new NotFoundException("Replacement buddy not found.");
    }

    const note = payload.note?.trim() || "Buddy reassigned by admin tools.";
    const previousBuddyId = order.assignedBuddyId;

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          assignedBuddyId: buddy.id
        }
      });

      await tx.buddyActionLog.create({
        data: {
          orderId: order.id,
          buddyId: buddy.id,
          action: "admin.reassigned",
          note,
          metadata: {
            previousBuddyId,
            newBuddyId: buddy.id
          } as Prisma.InputJsonValue
        }
      });

      await tx.orderStatusEvent.create({
        data: {
          orderId: order.id,
          status: order.status,
          actorId: payload.actorId,
          actorRole: payload.actorRole ?? "admin",
          note
        }
      });

      const request = await tx.buddyRequest.findFirst({
        where: {
          sellerId: order.sellerId,
          createdAt: { lte: order.createdAt }
        },
        orderBy: { createdAt: "desc" }
      });

      if (request) {
        await tx.buddyAssignment.create({
          data: {
            requestId: request.id,
            helperId: buddy.id,
            status: AssignmentStatus.confirmed
          }
        });
      }
    });

    await this.audit.create({
      actorId: payload.actorId,
      actorRole: payload.actorRole,
      action: "reassign_buddy",
      targetType: "order",
      targetId: order.id,
      severity: "medium",
      meta: {
        previousBuddyId,
        newBuddyId: buddy.id,
        note
      }
    });

    return {
      ok: true,
      orderId: order.id,
      previousBuddyId,
      newBuddyId: buddy.id
    };
  }

  async creditWallet(payload: CreditWalletPayload) {
    if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
      throw new Error("Amount must be greater than zero.");
    }

    const note = payload.note?.trim() || "Manual wallet credit by admin tools.";

    const wallet = await this.prisma.wallet.upsert({
      where: {
        userId_type: {
          userId: payload.userId,
          type: payload.walletType
        }
      },
      update: {
        balance: { increment: payload.amount }
      },
      create: {
        userId: payload.userId,
        type: payload.walletType,
        balance: payload.amount
      }
    });

    const transaction = await this.prisma.transaction.create({
      data: {
        userId: payload.userId,
        walletId: wallet.id,
        type: TransactionType.adjustment,
        amount: payload.amount,
        currency: wallet.currency,
        status: TransactionStatus.success,
        reference: `admin_credit_${Date.now()}`,
        metadata: {
          source: "admin_tools",
          note,
          actorId: payload.actorId
        } as Prisma.InputJsonValue
      }
    });

    await this.audit.create({
      actorId: payload.actorId,
      actorRole: payload.actorRole,
      action: "credit_wallet",
      targetType: "user",
      targetId: payload.userId,
      severity: "medium",
      meta: {
        walletType: payload.walletType,
        amount: payload.amount,
        currency: wallet.currency,
        transactionId: transaction.id,
        note
      }
    });

    return {
      ok: true,
      walletId: wallet.id,
      transactionId: transaction.id,
      newBalance: wallet.balance
    };
  }

  async freezeUser(payload: FreezeUserPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      include: { helperProfile: true }
    });
    if (!user) throw new NotFoundException("User not found.");

    const note = payload.note?.trim() || "User frozen by admin tools.";

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          status: "suspended",
          isAvailable: false
        }
      });

      if (user.helperProfile) {
        await tx.helperProfile.update({
          where: { userId: user.id },
          data: { isOnline: false }
        });
      }

      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Account restricted",
          message: note,
          type: "system",
          data: {
            source: "admin_tools",
            actorId: payload.actorId
          } as Prisma.InputJsonValue
        }
      });
    });

    await this.audit.create({
      actorId: payload.actorId,
      actorRole: payload.actorRole,
      action: "freeze_user",
      targetType: "user",
      targetId: user.id,
      severity: "critical",
      meta: {
        role: user.role,
        note
      }
    });

    return {
      ok: true,
      userId: user.id,
      status: "suspended"
    };
  }
}
