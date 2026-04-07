# Jikoni Baddies — Current System Architecture (Dev)

_Last updated: 2026-04-07 (Nairobi)_

## 1) High‑Level Architecture

The system is a microservice-based platform accessed through a single **API Gateway**. Frontend clients (Next.js web) talk to the gateway for all backend APIs. Internal services communicate via HTTP through the gateway and via the event broker (RabbitMQ) for async events and real-time notifications.

**Core layers**
- **Frontend**: Next.js (apps/web)
- **API Gateway**: NestJS service that routes `/api/{service}/...` to downstream services
- **Microservices**: NestJS services for domain logic (orders, payout, chat, etc.)
- **Event Broker**: RabbitMQ (message bus for events)
- **Datastore**: PostgreSQL via Prisma
- **Realtime**: Socket.IO (buddy tracking, notifications)

---

## 2) Gateway Routing & Service Registry

**Gateway**: `apps/api-gateway`
- Pattern: `/api/{service}/...`
- Health: `/health`
- Services registered in `apps/api-gateway/src/config/services.ts`

**Registered services** (default local URLs):
- `auth` → `http://127.0.0.1:4003`
- `user` → `http://127.0.0.1:4002`
- `seller` → `http://127.0.0.1:4007`
- `buyer` → `http://127.0.0.1:4010`
- `order` → `http://127.0.0.1:4004`
- `menu` → `http://127.0.0.1:4006`
- `buddy` → `http://127.0.0.1:4005`
- `payout` → `http://127.0.0.1:4016`
- `payment` → `http://127.0.0.1:4008`
- `notification` → `http://127.0.0.1:4011`
- `chat` → `http://127.0.0.1:4017`
- `refund` → `http://127.0.0.1:4018`
- `review` → `http://127.0.0.1:4013`
- `geolocation` → `http://127.0.0.1:4019`

**Note:** All frontend API calls should go through the gateway.

---

## 3) Frontend (apps/web)

### Major Portals
- **Landing**: `/` (marketing + onboarding)
- **Buyer portal**: `/buyer/*`
- **Seller portal**: `/seller/*`
- **Buddy portal**: `/buddy-portal/*`
- **Auth**: `/login`, `/create-account`

### Frontend-to-Gateway API Proxies (Next API routes)
- `/api/geocode/*` → gateway → geolocation service
- `/api/payout/*` → gateway → payout service
- `/api/seller/financials` → gateway → payout service
- `/api/seller/reviews` → gateway → review service
- `/api/user/[id]` → gateway → user service

### Real-time
- Buyer order tracking uses Socket.IO (via gateway `/ws/buddy`) for live location.
- Buddy portal uses Socket.IO for job updates and notifications.

---

## 4) Microservices & Key Implemented Features

### 4.1 API Gateway (`apps/api-gateway`)
- Service routing: `/api/{service}`
- Health endpoint: `/health`
- Auth endpoints: `/auth/*`
- Metrics endpoint: `/metrics`
- Static assets proxy: `/assets/*`

### 4.2 Buyer Service (`apps/buyer-service`)
- Buyer discovery and search endpoints
- `/health`
- `/buyer/summary`
- `/buyer/curated/home`
- `/buyer/categories/header`
- `/buyer/search`

### 4.3 Seller Service (`apps/seller-service`)
- Seller operational APIs, metrics, dashboard data
- `/health`
- Seller events controller (for realtime/event handling)
- Capacity/availability endpoints

### 4.4 Order Service (`apps/order-service`)
- Core order creation and status updates
- `/health`
- `/orders` POST
- `/orders/:id/status` PATCH

### 4.5 Menu Service (`apps/menu-service`)
- Menu/catalog endpoints
- `/health`
- `/` basic route

### 4.6 Buddy Service (`apps/buddy-service`)
**Buddy Pool / Matching**
- `/buddy/auto-match`
- `/buddy/requests` (GET/POST)
- `/buddy/requests/:id` (GET)
- `/buddy/requests/:id/apply|reject|confirm`
- `/buddy/assignments/:id/complete`

**Buddy Dash / Operations**
- `/buddy/users/:id/dashboard-metrics`
- `/buddy/users/:id/earnings`
- `/buddy/users/:id/ratings`
- `/buddy/users/:id/notifications`
- `/buddy/users/:id/requests`
- `/buddy/users/:id/payments`
- `/buddy/users/:id/jobs`
- `/buddy/users/:id/status`

**Tracking / Realtime**
- Socket.IO namespaces + events for tracking: `tracking:join`, `tracking:update`, `tracking:leave`

**Advanced Matching (Implemented)**
- Matching score (distance + rating + response time)
- Availability calendar
- Performance analytics
- Auto-accept rules
- Smart idle positioning suggestions
- Fraud signals (GPS spoofing / repeated cancellations)

### 4.7 Payout Service (`apps/payout-service`)
- Wallet model, transaction ledger
- `/wallet`, `/transactions`, `/payout-method`
- Emits `payout.completed`, `payout.failed`
- Admin endpoints with pagination
- (Daraja integration staged; service has mpesa logic stubbed for now)

### 4.8 Payment Service (`apps/payment-service`)
- Handles C2B payment initiation
- Emits `payment.initiated`, `payment.completed`, `payment.failed` events
- Intended to own STK push and Pay-on-Delivery

### 4.9 Notification Service (`apps/notification-service`)
- Stores notifications
- Socket.IO push delivery
- Consumes events (e.g. payouts, orders)

### 4.10 Chat Service (`apps/chat-service`)
- Chat persistence and real-time gateway
- `/orders/:orderId/messages`
- Socket.IO events for chat: `chat:join`, `chat:leave`, `chat:message`

### 4.11 Refund Service (`apps/refund-service`)
- Refund request lifecycle
- `/refunds` list + CRUD
- `/refunds/:id/approve|deny|paid`

### 4.12 Review Service (`apps/review-service`)
- Reviews model stored in Prisma
- `/reviews` (list + create)
- `/reviews/:id` (get)
- `/reviews/summary` (average + count + latest)

### 4.13 User Service (`apps/user-service`)
- `/users` list
- `/users/:id` get
- `/users/:id` patch

### 4.14 Geolocation Service (`apps/geolocation-service`)
- `/geocode/search?q=`
- `/geocode/reverse?lat=&lng=`
- Uses Nominatim / OpenStreetMap

---

## 5) Database & Prisma

**Prisma schema** in `prisma/schema.prisma`
- User, Order, Payment, Wallet, Transaction, Notification, Review, etc.
- Prisma client generated at repository root.

**Important**
- If schema changes, run:
  - `npx prisma generate`
  - `npx prisma migrate dev -n <name>`

---

## 6) Real‑Time & Events

### Socket.IO
- Buddy tracking: live updates to buyer & seller
- Notifications: real-time alerts pushed to UI
- Chat service: realtime order chat

### Event Broker (RabbitMQ)
- `order.created`
- `payment.initiated`
- `payment.completed`
- `payout.completed`
- `payout.failed`
- More events added as needed

---

## 7) Health Checks

`npm run health:all` uses `scripts/healthcheck.mjs` to verify each service.

---

## 8) Summary of Implemented Features

✅ Multi‑portal UI (Buyer / Seller / Buddy)
✅ Gateway routing for all backend calls
✅ Wallet + payout system (payout-service)
✅ Payment service w/ event hooks
✅ Buddy pool with advanced matching & realtime
✅ Live tracking via Socket.IO
✅ Review service + buyer review flow via gateway
✅ Geolocation service + map search/reverse
✅ Notifications service with sockets
✅ Chat + refund microservices

---

## 9) Notes / Next Steps

- Ensure all new services are registered in gateway and health check list.
- Wire missing UI features to services (where still using localStorage stubs).
- Finalize Daraja (M‑Pesa) integration in payment + payout flows.
- Add auth middleware enforcement for protected endpoints.

