import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = Number(process.env.USER_SERVICE_PORT ?? 4002);
  await app.listen(port);
  console.log(`[user-service] listening on ${port}`);
}

bootstrap();
