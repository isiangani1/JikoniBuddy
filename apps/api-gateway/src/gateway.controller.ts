import {
  Controller,
  All,
  Req,
  Res,
  HttpStatus
} from "@nestjs/common";
import type { Request, Response } from "express";
import { services } from "./config/services";

const jsonMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

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
    await this.proxy(req, res, req.params.version);
  }

  @All("v:version/:service/*")
  async proxyVersion(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    await this.proxy(req, res, req.params.version);
  }

  private async proxy(
    req: Request,
    res: Response,
    version?: string
  ): Promise<void> {
    const serviceKey = req.params.service;
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
      const upstream = await fetch(targetUrl, {
        method,
        headers,
        body
      });

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
        res.json(data);
        return;
      }

      const text = await upstream.text();
      res.send(text);
    } catch (error) {
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
