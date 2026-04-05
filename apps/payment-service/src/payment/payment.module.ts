import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { MpesaService } from "./mpesa.service";
import { PrismaService } from "../prisma.service";
import { PaymentEventsController } from "./payment.events";

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
  controllers: [PaymentController, PaymentEventsController],
  providers: [PaymentService, MpesaService, PrismaService],
  exports: [PaymentService]
})
export class PaymentModule {}
