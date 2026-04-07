import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = Number(process.env.REVIEW_SERVICE_PORT ?? 4013);
  await app.listen(port);
  console.log(`[review-service] listening on ${port}`);
}

bootstrap();
