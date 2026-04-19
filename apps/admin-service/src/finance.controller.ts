import { Controller, Get, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { FinanceService } from "./finance.service";
import { assertInternalApiKey } from "./internal-api-auth";

@Controller("finance")
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  @Get("overview")
  async getOverview(@Req() req: Request, @Query("days") days?: string) {
    assertInternalApiKey(req);
    const resolvedDays = days ? Number(days) : 30;
    return this.finance.getOverview(resolvedDays);
  }
}
