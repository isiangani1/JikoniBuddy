import { Module } from "@nestjs/common";
import { BuyerController } from "./buyer.controller";
import { BuyerService } from "./buyer.service";
import { PrismaService } from "../prisma.service";
import { RedisService } from "../cache/redis.service";

@Module({
  controllers: [BuyerController],
  providers: [BuyerService, PrismaService, RedisService]
})
export class BuyerModule {}
