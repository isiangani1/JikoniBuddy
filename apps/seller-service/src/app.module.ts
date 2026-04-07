import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventsController } from './events.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FailureHandlingService } from './failure.service';
import { SellerRealtimeGateway } from './realtime/seller-realtime.gateway';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGE_BROKER',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: Number(process.env.MESSAGE_BROKER_PORT ?? 4012) },
      },
    ]),
  ],
  controllers: [AppController, EventsController, HealthController, MetricsController, AvailabilityController],
  providers: [AppService, FailureHandlingService, SellerRealtimeGateway, MetricsService, AvailabilityService],
})
export class AppModule {}
