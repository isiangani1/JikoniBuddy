import { Body, Controller, Post } from "@nestjs/common";
import { MpesaService } from "./mpesa.service";

@Controller("mpesa")
export class MpesaController {
  constructor(private readonly mpesaService: MpesaService) {}

  @Post("b2c")
  async sendB2C(
    @Body()
    body: {
      transactionId: string;
      amount: number;
      phone: string;
    }
  ) {
    return this.mpesaService.sendB2C(body);
  }

  @Post("callback/result")
  async resultCallback(@Body() payload: any) {
    const reference =
      payload?.Result?.ReferenceData?.ReferenceItem?.[0]?.Value ??
      payload?.Result?.OriginatorConversationID ??
      payload?.reference;
    return this.mpesaService.handleCallback(reference ?? "", "success", payload);
  }

  @Post("callback/timeout")
  async timeoutCallback(@Body() payload: any) {
    const reference =
      payload?.Result?.ReferenceData?.ReferenceItem?.[0]?.Value ??
      payload?.Result?.OriginatorConversationID ??
      payload?.reference;
    return this.mpesaService.handleCallback(reference ?? "", "failed", payload);
  }
}
