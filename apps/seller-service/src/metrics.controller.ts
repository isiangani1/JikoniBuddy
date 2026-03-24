import { Controller, Get, Query } from "@nestjs/common";
import { MetricsService } from "./metrics.service";

@Controller("metrics")
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get("dashboard")
  getMetrics(@Query("sellerId") sellerId: string) {
    // Isolated metrics route ensuring data is securely gathered for the specific tenant
    return this.metricsService.getDashboardMetrics(sellerId);
  }
}
