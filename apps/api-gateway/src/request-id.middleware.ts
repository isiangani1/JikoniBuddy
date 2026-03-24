import { Injectable, NestMiddleware } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId =
      (req.headers["x-request-id"] as string | undefined) ?? randomUUID();
    const correlationId =
      (req.headers["x-correlation-id"] as string | undefined) ?? requestId;

    req.headers["x-request-id"] = requestId;
    req.headers["x-correlation-id"] = correlationId;
    res.setHeader("x-request-id", requestId);
    res.setHeader("x-correlation-id", correlationId);

    next();
  }
}
