import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PrismaService } from "./prisma.service";
import { HealthController } from "./health.controller";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";

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
  controllers: [HealthController, ChatController],
  providers: [PrismaService, ChatService, ChatGateway]
})
export class AppModule {}
