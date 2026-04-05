import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { PayoutService } from "./payout.service";

@Controller()
export class PayoutEventsController {
  constructor(private readonly payoutService: PayoutService) {}

  @EventPattern("payment.completed")
  async handlePaymentCompleted(
    @Payload()
    data: {
      orderId: string;
      sellerId?: string;
      totalAmount?: number;
      timestamp?: string;
    }
  ) {
    await this.payoutService.applyOrderCompleted(data.orderId);
  }

  @EventPattern("order.status_updated")
  async handleOrderStatusUpdated(
    @Payload() data: { orderId: string; status: string }
  ) {
    if (data.status === "cancelled") {
      await this.payoutService.handleOrderCancelled(data.orderId);
    }
  }
}
