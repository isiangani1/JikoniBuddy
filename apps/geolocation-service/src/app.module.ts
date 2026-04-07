import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { GeolocationController } from "./geolocation.controller";

@Module({
  controllers: [HealthController, GeolocationController]
})
export class AppModule {}
