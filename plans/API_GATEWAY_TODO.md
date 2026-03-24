# API Gateway TODO (Jikoni Buddy)

Goal: Make the API Gateway the **single entry point** for all client traffic (web, mobile, admin), abstracting microservices and centralizing cross‑cutting concerns.

---

## ✅ Principles
- Single public base URL for clients
- Service discovery + routing behind the gateway
- Centralized auth, rate limits, validation, logging
- Zero direct service exposure to clients

---

# Phase 1 — Foundations (Week 1)
- [x] Define gateway base domain + ports (dev, staging, prod)
- [x] Decide routing style: `/api/{service}/...` or `/api/{resource}/...`
- [x] Decide transport between gateway ↔ services (HTTP first, gRPC later)
- [x] Create shared error format + response envelope
- [x] Add global request ID middleware (trace ID)
- [x] Add correlation IDs to logs
- [x] Add health endpoint aggregating downstream services

---

# Phase 2 — Routing & Service Registry (Week 1)
- [x] Maintain routing table (service → host/port)
- [x] Add environment-based service config (DEV/PROD)
- [x] Support versioned routes (`/v1/...`)
- [x] Implement request proxying to:
  - [x] Auth Service
  - [x] User Service
  - [x] Seller Service
  - [x] Buyer Service
  - [x] Order Service
  - [x] Payment Service
  - [x] Buddy Service
  - [x] Notification Service
  - [x] Menu Service
  - [x] Delivery Service
  - [x] Review Service
  - [x] Messaging Service
  - [x] Admin Service

---

# Phase 3 — Security & Auth (Week 2)
- [ ] Central JWT verification middleware
- [ ] Role-based access control (RBAC) at gateway
- [ ] Token refresh flow via Auth Service
- [ ] API key support for internal/admin tools
- [ ] CORS + CSP + security headers
 - [ ] Auth orchestration contract defined (see Auth Orchestration section)

---

# Phase 4 — Traffic Control (Week 2)
- [ ] Global rate limiting (per IP + per user)
- [ ] Burst limits for sensitive endpoints
- [ ] Request body size limits
- [ ] Timeout + retry policies per service
- [ ] Circuit breaker for unstable services

---

# Phase 5 — Observability (Week 3)
- [ ] Request logging with structured logs
- [ ] Metrics: latency, error rate, throughput
- [ ] Trace propagation to downstream services
- [ ] Central error reporting + alerting

---

# Phase 6 — Edge Features (Week 3)
- [ ] Response caching for public endpoints
- [ ] Static asset proxy rules (if needed)
- [ ] WebSocket / Socket.IO proxy support
- [ ] GraphQL federation (optional later)

---

# Phase 7 — Delivery & CI/CD (Week 4)
- [ ] Dockerize gateway
- [ ] CI test pipeline for gateway
- [ ] Staging + prod deploy pipelines
- [ ] Rollback strategy + blue/green support

---

# Phase 8 — Client Migration (Week 4)
- [ ] Update web + mobile clients to call gateway only
- [ ] Remove direct service URLs from clients
- [ ] Validate existing endpoints work via gateway
- [ ] Regression tests for routing

---

# Deliverables
- API Gateway routes map
- Auth + RBAC rules matrix
- Rate limit policy table
- Standardized error format
- Metrics + log dashboard

---

# Notes
- Gateway must be treated as **critical infra**
- Prefer explicit routes; avoid automatic proxy for security
- All service URLs remain private / internal only

---

# Auth Service Orchestration (Required)
Purpose: Centralize auth flow at the API Gateway while delegating identity, credentials, and token issuance to the Auth Service.

## Auth Flow Contracts
- [ ] `POST /auth/register` → Gateway validates payload, forwards to Auth Service, returns normalized response
- [ ] `POST /auth/login` → Gateway forwards credentials, returns access/refresh tokens
- [ ] `POST /auth/refresh` → Gateway forwards refresh token, returns new access token
- [ ] `POST /auth/logout` → Gateway revokes refresh token + clears session cookies
- [ ] `GET /auth/session` → Gateway validates access token, returns session summary

## Gateway Responsibilities
- [ ] Validate payloads before hitting Auth Service (DTO/schema)
- [ ] Normalize auth errors (invalid creds, locked account, suspended)
- [ ] Attach/strip cookies where needed (httpOnly)
- [ ] Cache public keys / JWKS for token validation
- [ ] Enforce role-based routing and deny mismatched roles
- [ ] Emit audit events for login/logout/refresh

## Auth Service Responsibilities
- [ ] Store user credentials + password hashing
- [ ] Issue access + refresh tokens
- [ ] Maintain token revocation list
- [ ] Return role + permissions in token claims
- [ ] Publish security events (lockout, suspicious login)

## Orchestration Checklist
- [ ] Define token claims standard (sub, role, org, scopes, exp)
- [ ] Define session cookie strategy (refresh in httpOnly cookie)
- [ ] Define rate limits specifically for auth routes
- [ ] Add brute-force detection + IP throttling
- [ ] Add account lockout + password reset flow
- [ ] Add 2FA hooks (optional, phase 2)
