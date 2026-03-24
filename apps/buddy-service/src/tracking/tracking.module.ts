import { Module } from "@nestjs/common";
import { LocationGateway } from "./location.gateway";
import { LocationStore } from "./location.store";

@Module({
  providers: [LocationGateway, LocationStore]
})
export class TrackingModule {}
