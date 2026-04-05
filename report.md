# Pending Work Checklist (Auto‑Update)

Generated: 2026-04-01

This file lists **only pending items** across plans/todos. As we complete work, we’ll update this checklist.

---

## API Gateway — `plans/API_GATEWAY_TODO.md`
- [ ] Phase 7: Staging + prod deploy pipelines
- [ ] Phase 7: Rollback strategy + blue/green support
- [ ] Phase 8: Validate existing endpoints work via gateway
- [ ] Phase 8: Regression tests for routing
- [ ] Auth orchestration: normalize auth errors
- [ ] Auth orcrg -n "'`" report.mdhestration: cache public keys / JWKS
- [ ] Auth orchestration: emit audit events for login/logout/refresh
- [ ] Auth Service responsibilities (store creds, issue tokens, revocation list, security events)
- [ ] Auth hardening: brute force detection, lockout, password reset, optional 2FA

---

## Payout & Wallet — `plans/payout_wallet_TODO.md`
- [ ] Register Jikoni Buddy as merchant (bank + M‑Pesa paybill/till)
- [ ] Emit `payment.initiated` / `payment.completed` (end‑to‑end event verification)
- [ ] Link payments to orders + wallet settlement pipeline (full reconciliation)
- [ ] Ledger reconciliation report
- [ ] Admin refund tooling

---

## UI Enhancement (3D) — `plans/UI_enhancement_TODO.md`
- [ ] Low‑poly Nairobi 3D city scene
- [ ] Lighting + moving riders + parallax
- [ ] Scroll storytelling sequence + glass overlay
- [ ] Buddy Pool demand sim UI
- [ ] Trust orbit + floating reviews
- [ ] 3D performance/LOD + mobile fallbacks

---

## CSS Migration — `plans/css_migrationTODO.md`
- [ ] Audit global styles and map to Tailwind
- [ ] Define typography + spacing + gradients in Tailwind config
- [ ] Create Tailwind component helpers
- [ ] Migrate buyer portal shell + home
- [ ] Migrate buddy portal shell + dashboard
- [ ] Migrate seller portal shell + dashboard
- [ ] Migrate remaining pages (buyer/seller/buddy/admin)
- [ ] Remove legacy CSS blocks
- [ ] Mobile QA pass (320–480px) + tablet + desktop

---

## Live Tracking — `plans/live_trackingTODO.md`
- [ ] Redis tracking cache + TTL
- [ ] Buddy watchPosition streaming + throttling
- [ ] Replace polling with sockets on buyer/seller
- [ ] Marker interpolation + “offline” states
- [ ] Load testing for concurrent deliveries

---

## Seller Dashboard Plan — `plans/seller_dash_plans_todo.md`
- [ ] Resilience: dead‑letter queues / retry policies
- [ ] Observability: order processing time, capacity utilization, buddy latency
- [ ] Financials & logistics deep workflows

---

## Buyer Dashboard Refinement — `plans/buyer_dash_refine.md`
- [ ] Horizontal category carousels + skeleton loaders
- [ ] Hero promos (daily deals/free delivery)
- [ ] Rich search suggestions w/ thumbnails + ratings
- [ ] Advanced filters (dietary, fee, rating)
- [ ] Order‑it‑again + personalized recommendations
- [ ] Full‑screen map modal for location picker
- [ ] Quick add to cart from home feed

---

## Buddy Dashboard Refinement — `plans/buddy_dash_refine.md`
- [ ] Map‑centric demand heat zones
- [ ] Incoming job modal (payout + distance)
- [ ] Go Online/Offline primary toggle
- [ ] Earnings tracker + payout countdown
- [ ] Acceptance/completion/rating KPI dashboard
- [ ] Onboarding wizard + doc capture
- [ ] Active Job mode (lock UI + swipe complete)

---

## Backend Services — `plans/todos/todo-backend-services.md`
- [ ] Auth Service
- [ ] User Service
- [ ] Admin Service
- [ ] Delivery Service
- [ ] Review Service
- [ ] Messaging Service
- [ ] Service‑to‑service auth strategy
- [ ] DTO + validation standardization
- [ ] Background workers / queues

---

## Frontend Web — `plans/todos/todo-frontend-web.md`
- [ ] Shared UI library + design tokens
- [ ] Admin portal shell + screens
- [ ] Seller onboarding + verification
- [ ] Seller menu management (full)
- [ ] Seller order management (full)
- [ ] Seller Buddy Pool request form
- [ ] Buyer notifications center
- [ ] Shared offline/error states

---

## Payments — `plans/todos/todo-payments.md`
- [ ] Ledger reconciliation report
- [ ] Refund workflow rules + admin tooling
- [ ] Payment failure alerts + retry logic

---

## Realtime & Events — `plans/todos/todo-realtime-events.md`
- [ ] Kafka topics + event contracts
- [ ] Idempotency handling for events
- [ ] Retry + DLQ handling
- [ ] Document sync vs async rules

---

## Delivery — `plans/todos/todo-delivery.md`
- [ ] Delivery zone model + pricing rules
- [ ] Delivery fee quote API
- [ ] Rider assignment workflow
- [ ] Delivery status transitions + tracking
- [ ] ETA exposure to buyer
- [ ] Admin view of delivery issues

---

## Data / Search / Cache — `plans/todos/todo-data-search-cache.md`
- [ ] Service data ownership + schema boundaries
- [ ] Per‑service Prisma schema split
- [ ] Migration + seed strategy
- [ ] Elasticsearch mappings + sync jobs
- [ ] Redis caching keys + TTL strategy
- [ ] Session storage in Redis
- [ ] Rate limiting storage in Redis
- [ ] Data retention + audit logs

---

## Foundation — `plans/todos/todo-foundation.md`
- [ ] Initialize monorepo structure formally
- [ ] Root README + setup prerequisites
- [ ] Env conventions + .env.example per app
- [ ] Shared TS base config + lint rules
- [ ] Workspace package manager config
- [ ] Code owners + branching rules
- [ ] Logging + tracing standards
- [ ] CI pipeline (lint/test/build)
- [ ] Staging deployment workflow draft

---

## Infra / DevOps — `plans/todos/todo-infra-devops.md`
- [ ] AWS baseline (VPC, subnets, security)
- [ ] RDS Postgres + Redis provisioning
- [ ] S3 buckets + CDN
- [ ] Dockerfiles for services
- [ ] Local docker‑compose
- [ ] K8s/ECS config
- [ ] Centralized logging + metrics
- [ ] Monitoring alerts

---

## Testing & Launch — `plans/todos/todo-testing-launch.md`
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Load testing
- [ ] Security testing
- [ ] Bug bash checklist
- [ ] Staging verification checklist
- [ ] Production release checklist + rollback

---

## Mobile — `plans/todos/todo-mobile.md`
- [ ] Initialize React Native apps
- [ ] Shared mobile UI library
- [ ] Buyer flows
- [ ] Seller flows
- [ ] Buddy flows
- [ ] Push notifications
- [ ] Release pipelines
