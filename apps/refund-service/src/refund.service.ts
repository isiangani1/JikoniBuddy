import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { CreateRefundDto, ListRefundsDto } from "./dto";

@Injectable()
export class RefundService {
  constructor(private readonly prisma: PrismaService) {}

  async createRefund(dto: CreateRefundDto) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException("Order not found");
    if (order.buyerId !== dto.userId) {
      throw new BadRequestException("Only the buyer can request a refund");
    }

    const refund = await this.prisma.refundRequest.create({
      data: {
        orderId: dto.orderId,
        userId: dto.userId,
        reason: dto.reason,
        details: dto.details,
        amount: dto.amount
      }
    });

    await this.prisma.refundEvent.create({
      data: {
        refundId: refund.id,
        actorId: dto.userId,
        action: "requested",
        note: dto.details
      }
    });

    return refund;
  }

  async listRefunds(query: ListRefundsDto) {
    const take = Math.min(Math.max(query.limit ?? 20, 1), 100);
    const where = {
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.orderId ? { orderId: query.orderId } : {}),
      ...(query.status ? { status: query.status as any } : {})
    };

    const refunds = await this.prisma.refundRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      ...(query.cursor
        ? {
            cursor: { id: query.cursor },
            skip: 1
          }
        : {}),
      include: { events: { orderBy: { createdAt: "asc" } } }
    });

    const nextCursor = refunds.length === take ? refunds[refunds.length - 1]?.id : null;

    return { refunds, nextCursor };
  }

  async getRefund(refundId: string) {
    return this.prisma.refundRequest.findUnique({
      where: { id: refundId },
      include: { events: { orderBy: { createdAt: "asc" } } }
    });
  }

  async updateStatus(refundId: string, status: string, actorId?: string, note?: string) {
    const refund = await this.prisma.refundRequest.findUnique({ where: { id: refundId } });
    if (!refund) throw new NotFoundException("Refund not found");

    const updated = await this.prisma.refundRequest.update({
      where: { id: refundId },
      data: { status: status as any }
    });

    await this.prisma.refundEvent.create({
      data: {
        refundId: refundId,
        actorId,
        action: status,
        note
      }
    });

    return updated;
  }

  async refundPaymentForOrder(orderId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { reference: orderId }
    });
    if (!payment) {
      return null;
    }
    if (payment.status === "refunded") return payment;

    return this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: "refunded", completedAt: new Date() }
    });
  }
}
