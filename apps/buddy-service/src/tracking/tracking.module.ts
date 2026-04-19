import { Module } from "@nestjs/common";
import { LocationGateway } from "./location.gateway";
import { LocationStore } from "./location.store";
import { PrismaService } from "../prisma.service";

@Module({
  providers: [LocationGateway, LocationStore, PrismaService]
})
export class TrackingModule {}
