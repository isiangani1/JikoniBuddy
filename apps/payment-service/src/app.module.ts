import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { PaymentModule } from "./payment/payment.module";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [PaymentModule],
  controllers: [HealthController],
  providers: [PrismaService]
})
export class AppModule {}
