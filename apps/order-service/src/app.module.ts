import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HealthController } from './health.controller';

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
  controllers: [AppController, OrderController, HealthController],
  providers: [AppService, OrderService],
})
export class AppModule {}
