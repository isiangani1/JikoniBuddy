import "reflect-metadata";
import path from "node:path";
import dotenv from "dotenv";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const rootEnv = path.resolve(process.cwd(), "..", "..", ".env");
  const localEnv = path.resolve(process.cwd(), ".env");
  dotenv.config({ path: rootEnv });
  dotenv.config({ path: localEnv, override: true });

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = Number(process.env.CHAT_SERVICE_PORT ?? 4017);
  await app.listen(port);
}

bootstrap();
