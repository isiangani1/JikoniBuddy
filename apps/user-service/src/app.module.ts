import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaService } from "./prisma.service";

@Module({
  controllers: [HealthController, UserController],
  providers: [UserService, PrismaService]
})
export class AppModule {}
