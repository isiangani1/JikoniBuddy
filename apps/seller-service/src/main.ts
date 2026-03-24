import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Connect TCP microservice for event-driven flows
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 4001,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 4007);
}
bootstrap();
