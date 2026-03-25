# Payout & Wallet Transformation Plan (Uber-Style)

**Goal**: Implement a wallet + ledger system for sellers and buddies with delayed settlement, scheduled payouts, and instant cash‑out options.

---

## Phase 0 — Foundations (Design + Schema)
- [ ] Confirm payout policy (fees %, settlement delay T+1h/T+24h)
- [ ] Confirm payout methods (M-Pesa default, bank optional)
- [ ] Define wallet types (seller wallet, buddy wallet)
- [ ] Define transaction ledger types: `earning`, `withdrawal`, `fee`, `adjustment`, `refund`
- [ ] Align event names: `order.completed`, `payout.requested`, `payout.completed`, `payout.failed`

---

## Phase 1 — Payout Service (Core Wallet + Ledger)
- [ ] Create `payout-service` (NestJS)
- [ ] Add Prisma models:
  - [ ] `Wallet` (balance, pending_balance, currency, user_id, type)
  - [ ] `Transaction` (type, amount, status, reference, metadata)
  - [ ] `PayoutMethod` (mpesa, bank, verified)
- [ ] Seed test wallets for seller + buddy users
- [ ] REST APIs:
  - [ ] `GET /wallet`
  - [ ] `GET /transactions`
  - [ ] `POST /withdraw`
  - [ ] `POST /payout-method`

---

## Phase 2 — Earnings Engine (Event‑Driven)
- [ ] Listen to `order.completed`
- [ ] Calculate seller earnings:
  - [ ] Order total – platform fee – delivery fee
- [ ] Calculate buddy earnings (if buddy used)
- [ ] Create ledger entries for all splits
- [ ] Add to **pending balance** (not available)
- [ ] Schedule settlement release (T+24h)

---

## Phase 3 — Settlement + Availability
- [ ] Cron/worker: move pending → available after delay
- [ ] Handle refunds / cancellations:
  - [ ] Reverse pending earnings
  - [ ] Write negative ledger

---

## Phase 4 — Withdrawals (Scheduled + Instant)
- [ ] Scheduled weekly payout (default)
- [ ] Instant cash‑out with fee
- [ ] OTP / verification for withdrawals
- [ ] Rate limiting / anti‑fraud guards

---

## Phase 5 — M‑Pesa Integration (Daraja B2C) [DETAILED]
### 5.1 Credentials & Setup
- [ ] Register app on Safaricom Daraja portal
- [ ] Capture credentials:
  - [ ] Consumer Key
  - [ ] Consumer Secret
  - [ ] Shortcode
  - [ ] Initiator Name
  - [ ] Security Credential

### 5.2 Access Token Service
- [ ] Implement OAuth token fetch:
  - [ ] `GET /oauth/v1/generate?grant_type=client_credentials`
- [ ] Cache token (expires ~1 hour)

### 5.3 Security Credential Generation
- [ ] Encrypt initiator password using Safaricom public certificate
- [ ] Store securely (env or vault)

### 5.4 B2C Payout API
- [ ] Implement payout request:
  - [ ] `POST /mpesa/b2c`
- [ ] Payload:
  - [ ] `InitiatorName`
  - [ ] `SecurityCredential`
  - [ ] `CommandID` (e.g. `BusinessPayment`)
  - [ ] `Amount`
  - [ ] `PartyA` (Shortcode)
  - [ ] `PartyB` (2547XXXXXXXX)
  - [ ] `Remarks` (e.g. Jikoni Buddy Payout)
  - [ ] `QueueTimeOutURL`
  - [ ] `ResultURL`

### 5.5 Callback Endpoints (CRITICAL)
- [ ] Create:
  - [ ] `POST /mpesa/callback/result`
  - [ ] `POST /mpesa/callback/timeout`
- [ ] On Result:
  - [ ] Parse response
  - [ ] Match transaction via reference
  - [ ] Update status:
    - [ ] success → mark payout complete
    - [ ] failure → revert wallet
- [ ] On Timeout:
  - [ ] Mark as failed
  - [ ] Trigger retry

### 5.6 Transaction State Machine
- [ ] `pending → processing → success / failed → reversed (if needed)`

### 5.7 Idempotency Protection
- [ ] Use unique reference per payout
- [ ] Prevent duplicate processing

### 5.8 Retry Logic
- [ ] Retry failed payouts (max 3 attempts)
- [ ] Exponential backoff

### 5.9 Phone Normalization Utility
- [ ] Convert all numbers:
  - [ ] `07XXXXXXXX → 2547XXXXXXXX`
  - [ ] `+2547XXXXXXXX → 2547XXXXXXXX`

### 5.10 Logging & Audit
- [ ] Store:
  - [ ] request payload
  - [ ] response
  - [ ] timestamps

### Flow Update
- [ ] User clicks withdraw → `payout.requested`
- [ ] Payout Service:
  - [ ] validate balance
  - [ ] create transaction (processing)
  - [ ] call Daraja B2C
- [ ] Daraja → callback (result)
- [ ] System:
  - [ ] update transaction
  - [ ] emit `payout.completed` / `payout.failed`

---

## Phase 6 — Frontend UI (Seller + Buddy)
- [ ] Wallet summary cards:
  - [ ] Available balance
  - [ ] Pending balance
  - [ ] Total earned
  - [ ] Last payout
- [ ] Transactions table (earnings, fees, withdrawals)
- [ ] Withdraw CTA (scheduled + instant)
- [ ] Update payout method UI (M‑Pesa / Bank)

---

## Phase 7 — Security + Audit
- [ ] Role‑based wallet access (seller vs buddy)
- [ ] Ledger immutability rules
- [ ] Admin audit endpoints
- [ ] Exportable payout history

---

## Phase 8 — Observability
- [ ] Metrics: payout latency, failure rate
- [ ] Alerts on payout failures
- [ ] Dashboard widgets for finance team
