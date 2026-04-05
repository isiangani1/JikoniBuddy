import { Body, Controller, Param, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";

type PaymentRequest = {
  userId?: string;
  amount: number;
  method: "mpesa" | "cash";
  phone?: string;
  orderId?: string;
};

@Controller("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("c2b/stk")
  async createStkPush(@Body() payload: PaymentRequest) {
    return this.paymentService.initiateStkPush(payload);
  }

  @Post("c2b/callback")
  async handleCallback(@Body() payload: Record<string, unknown>) {
    return this.paymentService.handleCallback(payload);
  }

  @Post(":id/refund")
  async refundPayment(@Param("id") paymentId: string) {
    return this.paymentService.refundPayment(paymentId);
  }
}
