import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { RefundService } from "./refund.service";
import { RefundPublisher } from "./refund.publisher";
import { CreateRefundDto } from "./dto";

@Controller("refunds")
export class RefundController {
  constructor(
    private readonly refundService: RefundService,
    private readonly publisher: RefundPublisher
  ) {}

  @Get()
  async list(
    @Query("userId") userId?: string,
    @Query("orderId") orderId?: string,
    @Query("status") status?: string,
    @Query("limit") limit?: string,
    @Query("cursor") cursor?: string
  ) {
    return this.refundService.listRefunds({
      userId,
      orderId,
      status,
      limit: limit ? Number(limit) : undefined,
      cursor
    });
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return this.refundService.getRefund(id);
  }

  @Post()
  async create(@Body() body: CreateRefundDto) {
    const refund = await this.refundService.createRefund(body);
    this.publisher.emit("refund.requested", {
      refundId: refund.id,
      orderId: refund.orderId,
      userId: refund.userId,
      status: refund.status,
      amount: refund.amount,
      currency: refund.currency,
      reason: refund.reason
    });
    return refund;
  }

  @Post(":id/approve")
  async approve(
    @Param("id") id: string,
    @Body() body: { actorId?: string; note?: string }
  ) {
    const refund = await this.refundService.updateStatus(id, "approved", body.actorId, body.note);
    const payment = await this.refundService.refundPaymentForOrder(refund.orderId);
    this.publisher.emit("refund.approved", {
      refundId: refund.id,
      orderId: refund.orderId,
      userId: refund.userId,
      status: refund.status
    });
    if (payment) {
      this.publisher.emit("payment.refunded", {
        paymentId: payment.id,
        orderId: payment.reference,
        timestamp: new Date().toISOString()
      });
    }
    return refund;
  }

  @Post(":id/deny")
  async deny(
    @Param("id") id: string,
    @Body() body: { actorId?: string; note?: string }
  ) {
    const refund = await this.refundService.updateStatus(id, "denied", body.actorId, body.note);
    this.publisher.emit("refund.denied", {
      refundId: refund.id,
      orderId: refund.orderId,
      userId: refund.userId,
      status: refund.status
    });
    return refund;
  }

  @Post(":id/paid")
  async paid(
    @Param("id") id: string,
    @Body() body: { actorId?: string; note?: string }
  ) {
    const refund = await this.refundService.updateStatus(id, "paid", body.actorId, body.note);
    const payment = await this.refundService.refundPaymentForOrder(refund.orderId);
    this.publisher.emit("refund.paid", {
      refundId: refund.id,
      orderId: refund.orderId,
      userId: refund.userId,
      status: refund.status
    });
    if (payment) {
      this.publisher.emit("payment.refunded", {
        paymentId: payment.id,
        orderId: payment.reference,
        timestamp: new Date().toISOString()
      });
    }
    return refund;
  }
}
