import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventsController } from './events.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FailureHandlingService } from './failure.service';
import { SellerRealtimeGateway } from './realtime/seller-realtime.gateway';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGE_BROKER',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 4001 },
      },
    ]),
  ],
  controllers: [AppController, EventsController, HealthController],
  providers: [AppService, FailureHandlingService, SellerRealtimeGateway],
})
export class AppModule {}
