import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PrismaService } from "./prisma.service";
import { HealthController } from "./health.controller";
import { NotificationService } from "./notification.service";
import { NotificationEventsController } from "./notification.events";
import { NotificationGateway } from "./notification.gateway";

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
  controllers: [HealthController, NotificationEventsController],
  providers: [PrismaService, NotificationService, NotificationGateway]
})
export class AppModule {}
