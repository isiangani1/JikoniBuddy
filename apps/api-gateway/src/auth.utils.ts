import jwt, { JwtPayload } from "jsonwebtoken";

type AuthContext = {
  userId: string | null;
  roles: string[];
  raw?: JwtPayload | string;
};

const jwtSecret = process.env.JWT_SECRET;
const jwtPublicKey = process.env.JWT_PUBLIC_KEY;
const authRequired = (process.env.AUTH_REQUIRED ?? "true") === "true";
const apiKeyHeader = (process.env.API_KEY_HEADER ?? "x-api-key").toLowerCase();
const apiKeys = (process.env.INTERNAL_API_KEYS ?? "")
  .split(",")
  .map((key) => key.trim())
  .filter(Boolean);

export function getAuthContext(authorization?: string): AuthContext | null {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return authRequired ? null : { userId: null, roles: [] };
  }

  if (!jwtSecret && !jwtPublicKey) {
    return authRequired ? null : { userId: null, roles: [] };
  }

  const token = authorization.replace("Bearer ", "").trim();
  try {
    const payload = jwt.verify(token, jwtPublicKey ?? jwtSecret!, {
      algorithms: ["HS256", "RS256"]
    }) as JwtPayload;
    const roles = Array.isArray(payload.roles)
      ? payload.roles
      : payload.role
        ? [payload.role]
        : [];
    return {
      userId: typeof payload.sub === "string" ? payload.sub : null,
      roles,
      raw: payload
    };
  } catch {
    return authRequired ? null : { userId: null, roles: [] };
  }
}

export function isAuthRequired() {
  return authRequired;
}

export function hasValidApiKey(headers: Record<string, unknown>) {
  if (apiKeys.length === 0) {
    return false;
  }
  const headerValue =
    (headers[apiKeyHeader] as string | undefined) ??
    (headers[apiKeyHeader.toLowerCase()] as string | undefined);
  if (!headerValue) {
    return false;
  }
  return apiKeys.includes(headerValue);
}
