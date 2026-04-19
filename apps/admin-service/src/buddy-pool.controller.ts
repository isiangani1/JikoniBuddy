import { Controller, Get, Query } from "@nestjs/common";
import { BuddyPoolMetricsService } from "./buddy-pool.service";

@Controller("buddy-pool")
export class BuddyPoolMetricsController {
  constructor(private readonly buddyPool: BuddyPoolMetricsService) {}

  @Get("metrics")
  async getMetrics(@Query("days") days: string = "7") {
    const windowDays = Math.max(1, Math.min(90, Number(days) || 7));
    return this.buddyPool.getMetrics(windowDays);
  }
}
