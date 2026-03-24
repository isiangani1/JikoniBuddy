import { Module } from "@nestjs/common";
import { BuddyPoolController } from "./buddy-pool.controller";
import { BuddyAuthController } from "./buddy-auth.controller";
import { BuddyPoolService } from "./buddy-pool.service";
import { PrismaService } from "../prisma.service";
import { NotificationService } from "./notification.service";
import { BuddyAuthService } from "./buddy-auth.service";
import { BuddyPoolGateway } from "./buddy-pool.gateway";

import { ClientsModule, Transport } from "@nestjs/microservices";

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
  controllers: [BuddyPoolController, BuddyAuthController],
  providers: [
    BuddyPoolService,
    BuddyAuthService,
    PrismaService,
    NotificationService,
    BuddyPoolGateway
  ]
})
export class BuddyPoolModule {}
