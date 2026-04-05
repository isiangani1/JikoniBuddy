import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PrismaService } from "./prisma.service";
import { HealthController } from "./health.controller";
import { PayoutController } from "./payout/payout.controller";
import { PayoutEventsController } from "./payout/payout.events";
import { PayoutService } from "./payout/payout.service";
import { MpesaController } from "./mpesa/mpesa.controller";
import { MpesaService } from "./mpesa/mpesa.service";
import { PayoutPublisher } from "./payout/payout.publisher";
import { AdminController } from "./admin/admin.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "MESSAGE_BROKER",
        transport: Transport.TCP,
        options: { host: "127.0.0.1", port: 4001 }
      }
    ])
  ],
  controllers: [
    HealthController,
    PayoutController,
    PayoutEventsController,
    MpesaController,
    AdminController
  ],
  providers: [PrismaService, PayoutService, MpesaService, PayoutPublisher]
})
export class AppModule {}
