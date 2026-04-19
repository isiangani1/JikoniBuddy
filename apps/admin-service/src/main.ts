import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = Number(process.env.ADMIN_SERVICE_PORT ?? 4020);
  await app.listen(port);
  console.log(`[admin-service] listening on ${port}`);
}

bootstrap();
