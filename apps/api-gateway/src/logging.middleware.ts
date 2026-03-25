import { Injectable, NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import { recordRequest } from "./metrics.store";

function extractService(path: string) {
  const parts = path.split("?")[0]?.split("/") ?? [];
  const apiIndex = parts.findIndex((segment) => segment === "api");
  if (apiIndex >= 0 && parts[apiIndex + 1]) {
    if (parts[apiIndex + 1].startsWith("v")) {
      return parts[apiIndex + 2] ?? "unknown";
    }
    return parts[apiIndex + 1];
  }
  return "gateway";
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const requestId = req.headers["x-request-id"] ?? "unknown";
    const service = extractService(req.originalUrl ?? req.url);

    res.on("finish", () => {
      const latencyMs = Date.now() - start;
      const status = res.statusCode;
      recordRequest(service, status, latencyMs);
      const logPayload = {
        level: status >= 500 ? "error" : "info",
        requestId,
        method: req.method,
        path: req.originalUrl ?? req.url,
        status,
        latencyMs,
        service,
        userId: req.headers["x-user-id"] ?? null
      };
      const output = JSON.stringify(logPayload);
      if (status >= 500) {
        console.error(output);
      } else {
        console.log(output);
      }
    });

    next();
  }
}
