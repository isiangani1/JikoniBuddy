import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = Number(process.env.GEOLOCATION_SERVICE_PORT ?? 4019);
  await app.listen(port);
  console.log(`[geolocation-service] listening on ${port}`);
}

bootstrap();
