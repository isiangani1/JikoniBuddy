import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { GatewayController } from "./gateway.controller";
import { HealthController } from "./health.controller";
import { RequestIdMiddleware } from "./request-id.middleware";

@Module({
  controllers: [GatewayController, HealthController]
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("*");
  }
}
