# Payout & Wallet Transformation Plan (Uber-Style)

**Goal**: Implement a wallet + ledger system for sellers and buddies with delayed settlement, scheduled payouts, and instant cash‑out options.

---

## Phase 0 — Foundations (Design + Schema)
- [x] Confirm payout policy (fees %, settlement delay T+1h/T+24h)
- [x] Confirm payout methods (M-Pesa default, bank optional)
- [x] Define wallet types (seller wallet, buddy wallet)
- [x] Define transaction ledger types: `earning`, `withdrawal`, `fee`, `adjustment`, `refund`
- [x] Align event names: `order.completed`, `payout.requested`, `payout.completed`, `payout.failed`

---

## Phase 1 — Payout Service (Core Wallet + Ledger)
- [x] Create `payout-service` (NestJS)
- [x] Add Prisma models:
  - [x] `Wallet` (balance, pending_balance, currency, user_id, type)
  - [x] `Transaction` (type, amount, status, reference, metadata)
  - [x] `PayoutMethod` (mpesa, bank, verified)
- [x] Seed test wallets for seller + buddy users
- [x] REST APIs:
  - [x] `GET /wallet`
  - [x] `GET /transactions`
  - [x] `POST /withdraw`
  - [x] `POST /payout-method`

---

## Phase 2 — Earnings Engine (Event‑Driven)
- [x] Listen to `order.completed`
- [x] Calculate seller earnings:
  - [x] Order total – platform fee – delivery fee
- [x] Calculate buddy earnings (if buddy used)
- [x] Create ledger entries for all splits
- [x] Add to **pending balance** (not available)
- [ ] Schedule settlement release (T+24h)

---

## Phase 2.5 — Buyer Payments (C2B) + Pay-on-Delivery
- [ ] Register Jikoni Buddy as merchant (bank + M‑Pesa paybill/till)
- [x] Create **C2B payment records** when buyer checks out
- [x] M‑Pesa STK Push for advance payments (endpoint wiring)
- [x] Pay‑on‑delivery record for cash orders
- [x] Store payment reference + status in DB
- [ ] Emit `payment.initiated` / `payment.completed` events
- [ ] Link payments to orders + wallet settlement pipeline
- [x] Allow guest checkout with pay‑on‑delivery (no login required)
- [x] Require login + 45% advance for scheduled deliveries/services
- [x] Add payment-service (C2B) with STK + callback endpoints

---

## Phase 3 — Settlement + Availability
- [x] Cron/worker: move pending → available after delay
- [x] Handle refunds / cancellations:
  - [x] Reverse pending earnings
  - [x] Write negative ledger

---

## Phase 4 — Withdrawals (Scheduled + Instant)
- [x] Scheduled weekly payout (default)
- [x] Instant cash‑out with fee
- [x] OTP / verification for withdrawals
- [x] Rate limiting / anti‑fraud guards

---

## Phase 5 — M‑Pesa Integration (Daraja B2C) [DETAILED]
### 5.1 Credentials & Setup
- [x] Register app on Safaricom Daraja portal
- [x] Capture credentials:
  - [x] Consumer Key
  - [x] Consumer Secret
  - [x] Shortcode
  - [x] Initiator Name
  - [x] Security Credential

### 5.2 Access Token Service
- [x] Implement OAuth token fetch:
  - [x] `GET /oauth/v1/generate?grant_type=client_credentials`
- [x] Cache token (expires ~1 hour)

### 5.3 Security Credential Generation
- [x] Encrypt initiator password using Safaricom public certificate
- [x] Store securely (env or vault)

### 5.4 B2C Payout API
- [x] Implement payout request:
  - [x] `POST /mpesa/b2c`
- [x] Payload:
  - [x] `InitiatorName`
  - [x] `SecurityCredential`
  - [x] `CommandID` (e.g. `BusinessPayment`)
  - [x] `Amount`
  - [x] `PartyA` (Shortcode)
  - [x] `PartyB` (2547XXXXXXXX)
  - [x] `Remarks` (e.g. Jikoni Buddy Payout)
  - [x] `QueueTimeOutURL`
  - [x] `ResultURL`

### 5.5 Callback Endpoints (CRITICAL)
- [x] Create:
  - [x] `POST /mpesa/callback/result`
  - [x] `POST /mpesa/callback/timeout`
- [x] On Result:
  - [x] Parse response
  - [x] Match transaction via reference
  - [x] Update status:
    - [x] success → mark payout complete
    - [x] failure → revert wallet
- [x] On Timeout:
  - [x] Mark as failed
  - [x] Trigger retry

### 5.6 Transaction State Machine
- [x] `pending → processing → success / failed → reversed (if needed)`

### 5.7 Idempotency Protection
- [x] Use unique reference per payout
- [x] Prevent duplicate processing

### 5.8 Retry Logic
- [x] Retry failed payouts (max 3 attempts)
- [x] Exponential backoff

### 5.9 Phone Normalization Utility
- [x] Convert all numbers:
  - [x] `07XXXXXXXX → 2547XXXXXXXX`
  - [x] `+2547XXXXXXXX → 2547XXXXXXXX`

### 5.10 Logging & Audit
- [x] Store:
  - [x] request payload
  - [x] response
  - [x] timestamps

### Flow Update
- [x] User clicks withdraw → `payout.requested`
- [x] Payout Service:
  - [x] validate balance
  - [x] create transaction (processing)
  - [x] call Daraja B2C
- [x] Daraja → callback (result)
- [x] System:
  - [x] update transaction
  - [x] emit `payout.completed` / `payout.failed`

---

## Phase 6 — Frontend UI (Seller + Buddy)
- [x] Wallet summary cards:
  - [x] Available balance
  - [x] Pending balance
  - [x] Total earned
  - [x] Last payout
- [x] Transactions table (earnings, fees, withdrawals)
- [x] Withdraw CTA (scheduled + instant)
- [x] Update payout method UI (M‑Pesa / Bank)

---

## Phase 7 — Security + Audit
- [x] Role‑based wallet access (seller vs buddy)
- [x] Ledger immutability rules
- [x] Admin audit endpoints
- [x] Exportable payout history

---

## Phase 8 — Observability
- [x] Metrics: payout latency, failure rate
- [x] Alerts on payout failures
- [x] Dashboard widgets for finance team
