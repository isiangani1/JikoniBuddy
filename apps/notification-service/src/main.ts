import "reflect-metadata";
import path from "node:path";
import dotenv from "dotenv";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const rootEnv = path.resolve(process.cwd(), "..", "..", ".env");
  const localEnv = path.resolve(process.cwd(), ".env");
  dotenv.config({ path: rootEnv });
  dotenv.config({ path: localEnv, override: true });

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: "127.0.0.1", port: 4001 }
  });
  app.enableCors();
  await app.startAllMicroservices();
  const port = Number(process.env.NOTIFICATION_SERVICE_PORT ?? 4011);
  await app.listen(port);
}

bootstrap();
