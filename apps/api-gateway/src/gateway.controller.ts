import {
  Controller,
  All,
  Req,
  Res,
  HttpStatus
} from "@nestjs/common";
import type { Request, Response } from "express";
import { services } from "./config/services";
import { getAuthContext, hasValidApiKey, isAuthRequired } from "./auth.utils";
import { publicRoutes, serviceRoleMatrix } from "./config/rbac";
import { getCache, setCache } from "./cache.store";

const jsonMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const defaultTimeoutMs = Number(process.env.GATEWAY_TIMEOUT_MS ?? 8_000);
const defaultRetries = Number(process.env.GATEWAY_RETRIES ?? 1);
const circuitOpenMs = Number(process.env.CIRCUIT_OPEN_MS ?? 30_000);
const circuitFailureThreshold = Number(
  process.env.CIRCUIT_FAILURE_THRESHOLD ?? 5
);
const cacheTtlMs = Number(process.env.CACHE_TTL_MS ?? 15_000);
const cacheableServices = new Set(
  (process.env.CACHE_SERVICES ?? "buyer,menu,public")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
);

type CircuitState = {
  failures: number;
  openedAt?: number;
};

const circuitState = new Map<string, CircuitState>();

function isCircuitOpen(serviceKey: string) {
  const state = circuitState.get(serviceKey);
  if (!state?.openedAt) {
    return false;
  }
  if (Date.now() - state.openedAt > circuitOpenMs) {
    circuitState.set(serviceKey, { failures: 0 });
    return false;
  }
  return true;
}

function recordFailure(serviceKey: string) {
  const state = circuitState.get(serviceKey) ?? { failures: 0 };
  state.failures += 1;
  if (state.failures >= circuitFailureThreshold) {
    state.openedAt = Date.now();
  }
  circuitState.set(serviceKey, state);
}

function recordSuccess(serviceKey: string) {
  circuitState.set(serviceKey, { failures: 0 });
}

function buildTargetUrl(
  serviceKey: string,
  req: Request,
  version?: string
) {
  const service = services[serviceKey];
  if (!service) {
    return null;
  }

  const prefix = version
    ? `/api/v${version}/${serviceKey}`
    : `/api/${serviceKey}`;
  const originalUrl = req.originalUrl ?? req.url;
  const [, query = ""] = originalUrl.split("?");
  const path = originalUrl.replace(prefix, "");
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  const target = new URL(trimmedPath, service.baseUrl);
  if (query) {
    target.search = query;
  }
  return target.toString();
}

function isPublicRoute(req: Request) {
  const path = req.originalUrl?.split("?")[0] ?? req.url;
  return publicRoutes.some((pattern) => pattern.test(path));
}

@Controller("api")
export class GatewayController {
  @All(":service")
  async proxyRoot(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    await this.proxy(req, res);
  }

  @All(":service/*")
  async proxyService(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    await this.proxy(req, res);
  }

  @All("v:version/:service")
  async proxyVersionRoot(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const rawVersion = req.params.version;
    const version = Array.isArray(rawVersion) ? rawVersion[0] : rawVersion;
    await this.proxy(req, res, version);
  }

  @All("v:version/:service/*")
  async proxyVersion(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const rawVersion = req.params.version;
    const version = Array.isArray(rawVersion) ? rawVersion[0] : rawVersion;
    await this.proxy(req, res, version);
  }

  private async proxy(
    req: Request,
    res: Response,
    version?: string
  ): Promise<void> {
    const rawService = req.params.service;
    const serviceKey = Array.isArray(rawService) ? rawService[0] : rawService;
    if (!serviceKey) {
      res.status(HttpStatus.BAD_REQUEST).json({
        ok: false,
        error: {
          code: "MISSING_SERVICE",
          message: "Service key is required."
        }
      });
      return;
    }
    const path = req.originalUrl?.split("?")[0] ?? req.url;
    const isPayoutAdminPath =
      serviceKey === "payout" && path.includes("/admin");
    const allowsApiKey = serviceKey === "admin" || isPayoutAdminPath;
    const apiKeyValid =
      allowsApiKey && hasValidApiKey(req.headers as Record<string, unknown>);
    if (apiKeyValid) {
      req.headers["x-api-key-auth"] = "true";
    } else if (!isPublicRoute(req)) {
      const authContext = getAuthContext(req.headers.authorization);
      if (!authContext) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          ok: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Missing or invalid authentication token."
          }
        });
        return;
      }
      const allowedRoles = serviceRoleMatrix[serviceKey] ?? [];
      if (allowedRoles.length > 0) {
        const hasRole = authContext.roles.some((role) =>
          allowedRoles.includes(role as typeof allowedRoles[number])
        );
        if (!hasRole && isAuthRequired()) {
          res.status(HttpStatus.FORBIDDEN).json({
            ok: false,
            error: {
              code: "FORBIDDEN",
              message: "You do not have access to this service."
            }
          });
          return;
        }
      }
      if (authContext.userId) {
        req.headers["x-user-id"] = authContext.userId;
      }
      if (authContext.roles.length > 0) {
        req.headers["x-user-roles"] = authContext.roles.join(",");
      }
    }

      const targetUrl = buildTargetUrl(serviceKey, req, version);
    if (!targetUrl) {
      res.status(HttpStatus.NOT_FOUND).json({
        ok: false,
        error: {
          code: "SERVICE_NOT_FOUND",
          message: `Unknown service: ${serviceKey}`
        },
        requestId: req.headers["x-request-id"] ?? null
      });
      return;
    }

    if (isCircuitOpen(serviceKey)) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        ok: false,
        error: {
          code: "CIRCUIT_OPEN",
          message: "Service temporarily unavailable. Please retry later."
        }
      });
      return;
    }

    const cacheKey = `${req.method}:${req.originalUrl ?? req.url}`;
    const isCacheable =
      req.method.toUpperCase() === "GET" &&
      cacheTtlMs > 0 &&
      (isPublicRoute(req) || cacheableServices.has(serviceKey));
    if (isCacheable) {
      const cached = getCache(cacheKey);
      if (cached) {
        Object.entries(cached.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        res.setHeader("x-cache", "HIT");
        res.status(cached.status).send(cached.payload);
        return;
      }
    }

    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (!value || key.toLowerCase() === "host") {
        return;
      }
      headers.set(key, Array.isArray(value) ? value.join(",") : value);
    });
    headers.set("x-forwarded-host", req.headers.host ?? "");
    headers.set("x-forwarded-proto", req.protocol);

    const method = req.method.toUpperCase();
    let body: string | undefined;
    if (jsonMethods.has(method)) {
      if (req.body && Object.keys(req.body).length > 0) {
        body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        if (!headers.get("content-type")) {
          headers.set("content-type", "application/json");
        }
      }
    }

    try {
      const upstream = await fetchWithRetry(
        targetUrl,
        { method, headers, body },
        defaultRetries,
        serviceKey
      );

      res.status(upstream.status);
      upstream.headers.forEach((value, key) => {
        if (key.toLowerCase() === "transfer-encoding") {
          return;
        }
        res.setHeader(key, value);
      });

      const contentType = upstream.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const data = await upstream.json();
        if (isCacheable) {
          setCache(cacheKey, {
            expiresAt: Date.now() + cacheTtlMs,
            payload: data,
            status: upstream.status,
            headers: {
              "content-type": contentType
            }
          });
          res.setHeader("x-cache", "MISS");
        }
        res.json(data);
        return;
      }

      const text = await upstream.text();
      if (isCacheable) {
        setCache(cacheKey, {
          expiresAt: Date.now() + cacheTtlMs,
          payload: text,
          status: upstream.status,
          headers: {
            "content-type": contentType
          }
        });
        res.setHeader("x-cache", "MISS");
      }
      res.send(text);
      recordSuccess(serviceKey);
    } catch (error) {
      recordFailure(serviceKey);
      res.status(HttpStatus.BAD_GATEWAY).json({
        ok: false,
        error: {
          code: "UPSTREAM_UNREACHABLE",
          message:
            error instanceof Error ? error.message : "Upstream unreachable"
        },
        requestId: req.headers["x-request-id"] ?? null
      });
    }
  }
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries: number,
  serviceKey: string
) {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      defaultTimeoutMs
    );
    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!response.ok && response.status >= 500 && attempt < retries) {
        recordFailure(serviceKey);
        continue;
      }
      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt >= retries) {
        break;
      }
    }
  }
  throw lastError;
}
