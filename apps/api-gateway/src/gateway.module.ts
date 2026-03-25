import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { GatewayController } from "./gateway.controller";
import { HealthController } from "./health.controller";
import { AuthController } from "./auth.controller";
import { MetricsController } from "./metrics.controller";
import { AssetsController } from "./assets.controller";
import { RequestIdMiddleware } from "./request-id.middleware";
import { RateLimitMiddleware } from "./rate-limit.middleware";
import { LoggingMiddleware } from "./logging.middleware";

@Module({
  controllers: [
    GatewayController,
    HealthController,
    AuthController,
    MetricsController,
    AssetsController
  ]
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, RateLimitMiddleware, LoggingMiddleware)
      .forRoutes("*");
  }
}
