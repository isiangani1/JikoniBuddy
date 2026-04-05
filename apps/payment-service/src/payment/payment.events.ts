import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { PaymentService } from "./payment.service";

@Controller()
export class PaymentEventsController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern("delivery.confirmed")
  async handleDeliveryConfirmed(
    @Payload() data: { orderId: string }
  ) {
    await this.paymentService.completeCashPayment(data.orderId);
  }
}
