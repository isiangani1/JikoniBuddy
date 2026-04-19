import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { HealthController } from "./health.controller";
import { PrismaService } from "./prisma.service";
import { AuditController } from "./audit.controller";
import { AuditService } from "./audit.service";
import { AlertsController } from "./alerts.controller";
import { AlertsService } from "./alerts.service";
import { AutomationController } from "./automation.controller";
import { AutomationService } from "./automation.service";
import { OrderDebugController } from "./order-debug.controller";
import { OrderDebugService } from "./order-debug.service";
import { RiskController } from "./risk.controller";
import { RiskService } from "./risk.service";
import { BuddyPoolMetricsController } from "./buddy-pool.controller";
import { BuddyPoolMetricsService } from "./buddy-pool.service";
import { FinanceController } from "./finance.controller";
import { FinanceService } from "./finance.service";
import { PerformanceController } from "./performance.controller";
import { PerformanceService } from "./performance.service";
import { ActionsController } from "./actions.controller";
import { ActionsService } from "./actions.service";

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
  controllers: [
    HealthController,
    AuditController,
    AlertsController,
    AutomationController,
    OrderDebugController,
    RiskController,
    BuddyPoolMetricsController,
    FinanceController,
    PerformanceController,
    ActionsController
  ],
  providers: [
    PrismaService,
    AuditService,
    AlertsService,
    AutomationService,
    OrderDebugService,
    RiskService,
    BuddyPoolMetricsService,
    FinanceService,
    PerformanceService,
    ActionsService
  ]
})
export class AppModule {}
