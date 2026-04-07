# Jikoni Baddies — API Documentation (Current)

_Last updated: 2026-04-07 (Nairobi)_

## Base URLs

**Gateway (recommended):**
- `http://127.0.0.1:4000/api/{service}`

**Examples**
- `GET /api/buyer/summary`
- `POST /api/order/orders`
- `GET /api/buddy/requests?status=open`

> All frontend and external clients should use the gateway. Services can be called directly only for local debugging.

---

## Authentication & Access (Gateway)

- Public routes are defined in the gateway RBAC config (`apps/api-gateway/src/config/rbac`).
- Protected routes require `Authorization: Bearer <token>`.
- Some admin routes accept an API key header (see payout admin endpoints).
- Gateway injects:
  - `x-user-id`
  - `x-user-roles`

---

## Gateway Endpoints

### Health & Metrics
- `GET /health` → gateway health
- `GET /metrics` → gateway metrics

### Auth (proxied to auth service)
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/session`

### Proxy
- `ALL /api/:service/*` → forwards to service base URL
- `ALL /api/v:version/:service/*` → versioned proxy

---

## Services (via Gateway)

### 1) Buyer Service
Base: `/api/buyer`

- `GET /buyer/health`
- `GET /buyer/summary`
- `GET /buyer/categories/header`
- `GET /buyer/curated/home`
- `GET /buyer/search?q=`

---

### 2) Seller Service
Base: `/api/seller`

- `GET /seller/availability?sellerId=`
- `PUT /seller/availability?sellerId=`
  - Body: `AvailabilityPayload`

Additional:
- `GET /api/metrics/dashboard?sellerId=` (seller metrics)
- `GET /api/seller` (root test endpoint)

---

### 3) Order Service
Base: `/api/order`

- `POST /order/orders`
  - Body: `{ buyerId, sellerId, items, totalAmount }`
- `PATCH /order/orders/:id/status`
  - Body: `{ status }`

---

### 4) Menu Service
Base: `/api/menu`

- `GET /menu/menu?sellerId=`
- `POST /menu/menu?sellerId=`
  - Body: product payload
- `PUT /menu/menu/bulk?sellerId=`
  - Body: `{ productIds, isActive }`

---

### 5) Buddy Service
Base: `/api/buddy`

**Buddy Auth**
- `POST /buddy/auth/register`
- `POST /buddy/auth/login`

**Buddy Requests / Matching**
- `POST /buddy/auto-match`
- `POST /buddy/requests`
- `GET /buddy/requests?status=`
- `GET /buddy/requests/:id`
- `POST /buddy/requests/:id/apply`
- `POST /buddy/requests/:id/reject`
- `POST /buddy/requests/:id/confirm`

**Jobs**
- `POST /buddy/assignments/:id/complete`
- `POST /buddy/jobs/:id/checkin`
- `POST /buddy/jobs/:id/checkout`
- `POST /buddy/jobs/:id/notes`
- `POST /buddy/jobs/:id/disputes`
- `POST /buddy/jobs/:id/complete`

**Ratings**
- `POST /buddy/ratings`

**User / Helper Dash**
- `GET /buddy/users/:id`
- `PUT /buddy/users/:id/status`
- `GET /buddy/users/:id/earnings`
- `GET /buddy/users/:id/payments`
- `GET /buddy/users/:id/jobs?status=`
- `GET /buddy/users/:id/ratings`
- `GET /buddy/users/:id/notifications`
- `GET /buddy/users/:id/dashboard-metrics`
- `GET /buddy/users/:id/requests`
- `GET /buddy/users/:id/availability`
- `PUT /buddy/users/:id/availability`
- `GET /buddy/users/:id/performance`
- `GET /buddy/users/:id/idle-suggestions`
- `GET /buddy/users/:id/fraud-signals`
- `GET /buddy/users/:id/auto-accept`
- `PUT /buddy/users/:id/auto-accept`
- `POST /buddy/users/:id/payouts`

**Catalog**
- `GET /buddy/catalog/categories?kind=&parentSlug=`
- `GET /buddy/catalog/home-sections`
- `GET /buddy/catalog/categories/:slug/products?limit=`

---

### 6) Payout Service
Base: `/api/payout`

**Wallets / Transactions**
- `GET /payout/wallet?userId=&type=buddy|seller`
- `GET /payout/transactions?userId=&type=buddy|seller`

**Withdrawals**
- `POST /payout/withdraw`
- `POST /payout/withdraw/otp`

**Payout Methods**
- `POST /payout/payout-method`
- `GET /payout/payout-method?userId=`

**Admin (API key required)**
- `GET /payout/admin/wallets?userId=&type=&page=&pageSize=`
- `GET /payout/admin/transactions?userId=&status=&type=&page=&pageSize=`
- `GET /payout/admin/transactions/export?userId=&status=&type=`
- `GET /payout/admin/metrics?days=`
- `GET /payout/admin/metrics/history?days=`

**M-Pesa (B2C)**
- `POST /payout/mpesa/b2c`
- `POST /payout/mpesa/callback/result`
- `POST /payout/mpesa/callback/timeout`

---

### 7) Payment Service
Base: `/api/payment`

- `POST /payment/payments/c2b/stk`
  - Body: `{ userId?, amount, method: "mpesa" | "cash", phone?, orderId? }`
- `POST /payment/payments/c2b/callback`
- `POST /payment/payments/:id/refund`

---

### 8) Notification Service
Base: `/api/notification`

- Realtime notifications via Socket.IO
- Event consumers (no public HTTP routes yet)

---

### 9) Chat Service
Base: `/api/chat`

- `GET /chat/orders/:orderId/messages?limit=&cursor=&userId=`
- `POST /chat/orders/:orderId/messages`
- `POST /chat/orders/:orderId/read`

---

### 10) Refund Service
Base: `/api/refund`

- `GET /refund/refunds?userId=&orderId=&status=&limit=&cursor=`
- `GET /refund/refunds/:id`
- `POST /refund/refunds`
- `POST /refund/refunds/:id/approve`
- `POST /refund/refunds/:id/deny`
- `POST /refund/refunds/:id/paid`

---

### 11) Review Service
Base: `/api/review`

- `GET /review/reviews?sellerId=&orderId=&buyerId=`
- `GET /review/reviews/summary?sellerId=`
- `GET /review/reviews/:id`
- `POST /review/reviews`

---

### 12) User Service
Base: `/api/user`

- `GET /user/users?role=`
- `GET /user/users/:id`
- `PATCH /user/users/:id`

---

### 13) Geolocation Service
Base: `/api/geolocation`

- `GET /geolocation/geocode/search?q=`
- `GET /geolocation/geocode/reverse?lat=&lng=`

---

## Realtime (Socket.IO)

### Buddy Tracking (Gateway → Buddy Service)
Namespace: `/ws/buddy`

- `tracking:join` `{ orderId }`
- `tracking:update` `{ orderId, lat, lng }`
- `tracking:leave` `{ orderId }`

### Buddy Pool / Jobs
- `buddy.job_offered`
- `buddy.job_completed`

### Chat
- `chat:join`
- `chat:leave`
- `chat:message`

---

## Common Response Shapes

Most endpoints respond with JSON objects. Errors typically use:

```json
{ "ok": false, "error": { "code": "...", "message": "..." } }
```

---

## Notes

- All paths shown above are **gateway** paths. Services themselves are mounted at their own base ports for local dev only.
- API security is enforced in the gateway. Some routes may allow API key access (payout admin).
- More endpoints may exist internally (e.g. metrics, dashboard helpers) and can be added here as they are finalized.

