import { Module } from "@nestjs/common";
import { BuyerModule } from "./buyer/buyer.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [BuyerModule],
  controllers: [HealthController]
})
export class AppModule {}
