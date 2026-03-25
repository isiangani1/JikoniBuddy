import { Module } from "@nestjs/common";
import { BuddyPoolModule } from "./buddy-pool/buddy-pool.module";
import { CatalogModule } from "./catalog/catalog.module";
import { TrackingModule } from "./tracking/tracking.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [BuddyPoolModule, CatalogModule, TrackingModule],
  controllers: [HealthController]
})
export class AppModule {}
