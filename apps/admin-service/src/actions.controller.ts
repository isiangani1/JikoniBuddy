import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { assertInternalApiKey } from "./internal-api-auth";
import { ActionsService } from "./actions.service";

@Controller("actions")
export class ActionsController {
  constructor(private readonly actions: ActionsService) {}

  @Post("refund-order")
  async refundOrder(
    @Req() req: Request,
    @Body()
    body: {
      actorId: string;
      actorRole?: string;
      orderId: string;
      amount?: number;
      note?: string;
    }
  ) {
    assertInternalApiKey(req);
    return this.actions.refundOrder(body);
  }

  @Post("reassign-buddy")
  async reassignBuddy(
    @Req() req: Request,
    @Body()
    body: {
      actorId: string;
      actorRole?: string;
      orderId: string;
      newBuddyId: string;
      note?: string;
    }
  ) {
    assertInternalApiKey(req);
    return this.actions.reassignBuddy(body);
  }

  @Post("credit-wallet")
  async creditWallet(
    @Req() req: Request,
    @Body()
    body: {
      actorId: string;
      actorRole?: string;
      userId: string;
      walletType: "seller" | "buddy";
      amount: number;
      note?: string;
    }
  ) {
    assertInternalApiKey(req);
    return this.actions.creditWallet(body);
  }

  @Post("freeze-user")
  async freezeUser(
    @Req() req: Request,
    @Body()
    body: {
      actorId: string;
      actorRole?: string;
      userId: string;
      note?: string;
    }
  ) {
    assertInternalApiKey(req);
    return this.actions.freezeUser(body);
  }
}
