import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  controllers: [AppController, OrderController],
  providers: [AppService, OrderService],
})
export class AppModule {}
