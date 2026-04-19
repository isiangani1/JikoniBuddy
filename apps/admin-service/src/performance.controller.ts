import { Controller, Get, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { PerformanceService } from "./performance.service";
import { assertInternalApiKey } from "./internal-api-auth";

@Controller("performance")
export class PerformanceController {
  constructor(private readonly performance: PerformanceService) {}

  @Get("overview")
  async getOverview(@Req() req: Request, @Query("days") days?: string) {
    assertInternalApiKey(req);
    const resolvedDays = days ? Number(days) : 30;
    return this.performance.getOverview(resolvedDays);
  }
}
