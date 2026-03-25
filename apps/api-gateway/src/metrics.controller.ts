import { Controller, Get } from "@nestjs/common";
import { getMetricsSnapshot } from "./metrics.store";

@Controller()
export class MetricsController {
  @Get("metrics")
  getMetrics() {
    return getMetricsSnapshot();
  }
}
