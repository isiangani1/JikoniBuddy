import { UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

export function assertInternalApiKey(req: Request) {
  const headerName = (process.env.API_KEY_HEADER ?? "x-api-key").toLowerCase();
  const apiKey =
    req.headers[headerName] ??
    req.headers[headerName.toLowerCase()] ??
    req.headers["x-api-key"];

  const allowed = (process.env.INTERNAL_API_KEYS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!apiKey || Array.isArray(apiKey)) {
    throw new UnauthorizedException("Missing API key.");
  }
  if (!allowed.includes(apiKey)) {
    throw new UnauthorizedException("Invalid API key.");
  }
}
