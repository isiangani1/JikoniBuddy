import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  HttpStatus
} from "@nestjs/common";
import type { Request, Response } from "express";
import { services } from "./config/services";

type ValidationResult = { ok: true } | { ok: false; message: string };

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateRegister(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Invalid payload." };
  }
  const payload = body as Record<string, unknown>;
  if (!isNonEmptyString(payload.role)) {
    return { ok: false, message: "Role is required." };
  }
  if (!isNonEmptyString(payload.name)) {
    return { ok: false, message: "Name is required." };
  }
  if (!isNonEmptyString(payload.phone)) {
    return { ok: false, message: "Phone is required." };
  }
  if (!isNonEmptyString(payload.email)) {
    return { ok: false, message: "Email is required." };
  }
  if (!isNonEmptyString(payload.password)) {
    return { ok: false, message: "Password is required." };
  }
  return { ok: true };
}

function validateLogin(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Invalid payload." };
  }
  const payload = body as Record<string, unknown>;
  if (!isNonEmptyString(payload.email)) {
    return { ok: false, message: "Email is required." };
  }
  if (!isNonEmptyString(payload.password)) {
    return { ok: false, message: "Password is required." };
  }
  return { ok: true };
}

function validateRefresh(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Invalid payload." };
  }
  const payload = body as Record<string, unknown>;
  if (!isNonEmptyString(payload.refreshToken)) {
    return { ok: false, message: "Refresh token is required." };
  }
  return { ok: true };
}

async function forwardAuth(req: Request, res: Response, path: string) {
  const authService = services.auth;
  const targetUrl = new URL(path, authService.baseUrl).toString();
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    if (!value || key.toLowerCase() === "host") {
      return;
    }
    headers.set(key, Array.isArray(value) ? value.join(",") : value);
  });

  const method = req.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : req.body && Object.keys(req.body).length > 0
        ? JSON.stringify(req.body)
        : undefined;

  if (body && !headers.get("content-type")) {
    headers.set("content-type", "application/json");
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
      res.json(await upstream.json());
      return;
    }
    res.send(await upstream.text());
  } catch (error) {
    res.status(HttpStatus.BAD_GATEWAY).json({
      ok: false,
      error: {
        code: "AUTH_SERVICE_UNREACHABLE",
        message:
          error instanceof Error ? error.message : "Auth service unreachable"
      }
    });
  }
}

@Controller("auth")
export class AuthController {
  @Post("register")
  async register(@Req() req: Request, @Res() res: Response) {
    const validation = validateRegister(req.body);
    if (!validation.ok) {
      res.status(HttpStatus.BAD_REQUEST).json({
        ok: false,
        error: { code: "BAD_REQUEST", message: validation.message }
      });
      return;
    }
    await forwardAuth(req, res, "/auth/register");
  }

  @Post("login")
  async login(@Req() req: Request, @Res() res: Response) {
    const validation = validateLogin(req.body);
    if (!validation.ok) {
      res.status(HttpStatus.BAD_REQUEST).json({
        ok: false,
        error: { code: "BAD_REQUEST", message: validation.message }
      });
      return;
    }
    await forwardAuth(req, res, "/auth/login");
  }

  @Post("refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    const validation = validateRefresh(req.body);
    if (!validation.ok) {
      res.status(HttpStatus.BAD_REQUEST).json({
        ok: false,
        error: { code: "BAD_REQUEST", message: validation.message }
      });
      return;
    }
    await forwardAuth(req, res, "/auth/refresh");
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    await forwardAuth(req, res, "/auth/logout");
  }

  @Get("session")
  async session(@Req() req: Request, @Res() res: Response) {
    await forwardAuth(req, res, "/auth/session");
  }
}
