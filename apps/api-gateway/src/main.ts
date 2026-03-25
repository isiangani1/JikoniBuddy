import "reflect-metadata";
import path from "node:path";
import dotenv from "dotenv";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import express from "express";
import { attachWsProxy } from "./ws-proxy";

async function bootstrap() {
  const rootEnv = path.resolve(process.cwd(), "..", "..", ".env");
  const localEnv = path.resolve(process.cwd(), ".env");
  dotenv.config({ path: rootEnv });
  dotenv.config({ path: localEnv, override: true });

  const app = await NestFactory.create(AppModule, { cors: true });
  const bodyLimit = process.env.BODY_LIMIT ?? "1mb";
  app.use(express.json({ limit: bodyLimit }));
  app.use(express.urlencoded({ limit: bodyLimit, extended: true }));
  const port = Number(process.env.API_GATEWAY_PORT ?? 4000);
  const server = await app.listen(port);
  attachWsProxy(server);
}

bootstrap();
