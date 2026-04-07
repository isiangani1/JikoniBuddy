import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PrismaService } from "./prisma.service";
import { HealthController } from "./health.controller";
import { RefundController } from "./refund.controller";
import { RefundService } from "./refund.service";
import { RefundPublisher } from "./refund.publisher";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "MESSAGE_BROKER",
        transport: Transport.TCP,
        options: { host: "127.0.0.1", port: Number(process.env.MESSAGE_BROKER_PORT ?? 4012) }
      }
    ])
  ],
  controllers: [HealthController, RefundController],
  providers: [PrismaService, RefundService, RefundPublisher]
})
export class AppModule {}
