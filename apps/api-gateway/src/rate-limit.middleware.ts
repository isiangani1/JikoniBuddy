import { Injectable, NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";

type Bucket = {
  count: number;
  resetAt: number;
};

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const maxRequests = Number(process.env.RATE_LIMIT_MAX ?? 200);
const authMaxRequests = Number(process.env.RATE_LIMIT_AUTH_MAX ?? 20);
const burstWindowMs = Number(process.env.RATE_LIMIT_BURST_WINDOW_MS ?? 10_000);
const burstMaxRequests = Number(process.env.RATE_LIMIT_BURST_MAX ?? 30);
const burstSensitiveMaxRequests = Number(
  process.env.RATE_LIMIT_BURST_SENSITIVE_MAX ?? 10
);

const buckets = new Map<string, Bucket>();

function getClientKey(req: Request) {
  const forwarded = (req.headers["x-forwarded-for"] as string | undefined) ?? "";
  const ip = forwarded.split(",")[0]?.trim() || req.ip || req.socket.remoteAddress || "unknown";
  return ip;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const key = getClientKey(req);
    const path = req.originalUrl ?? req.url;
    const isAuthRoute = path.startsWith("/auth") || path.startsWith("/api/auth");
    const limit = isAuthRoute ? authMaxRequests : maxRequests;
    const isSensitive =
      isAuthRoute ||
      path.includes("/payment") ||
      path.includes("/orders") ||
      path.includes("/admin");

    const now = Date.now();
    const bucket = buckets.get(key);
    const burstKey = `${key}:burst`;
    const burstBucket = buckets.get(burstKey);
    const burstLimit = isSensitive ? burstSensitiveMaxRequests : burstMaxRequests;
    if (!burstBucket || burstBucket.resetAt <= now) {
      buckets.set(burstKey, { count: 1, resetAt: now + burstWindowMs });
    } else if (burstBucket.count >= burstLimit) {
      res.setHeader("x-rate-limit-burst-limit", String(burstLimit));
      res.setHeader("x-rate-limit-burst-remaining", "0");
      res.setHeader("x-rate-limit-burst-reset", String(burstBucket.resetAt));
      res.status(429).json({
        ok: false,
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests in a short burst."
        }
      });
      return;
    } else {
      burstBucket.count += 1;
      buckets.set(burstKey, burstBucket);
    }

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader("x-rate-limit-limit", String(limit));
      res.setHeader("x-rate-limit-remaining", String(limit - 1));
      res.setHeader("x-rate-limit-reset", String(now + windowMs));
      next();
      return;
    }

    if (bucket.count >= limit) {
      res.setHeader("x-rate-limit-limit", String(limit));
      res.setHeader("x-rate-limit-remaining", "0");
      res.setHeader("x-rate-limit-reset", String(bucket.resetAt));
      res.status(429).json({
        ok: false,
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Please slow down."
        }
      });
      return;
    }

    bucket.count += 1;
    buckets.set(key, bucket);
    res.setHeader("x-rate-limit-limit", String(limit));
    res.setHeader("x-rate-limit-remaining", String(limit - bucket.count));
    res.setHeader("x-rate-limit-reset", String(bucket.resetAt));
    next();
  }
}
