import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { PrismaService } from "./prisma.service";

@Module({
  controllers: [HealthController, ReviewController],
  providers: [ReviewService, PrismaService]
})
export class AppModule {}
