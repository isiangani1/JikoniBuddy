# Stub Fix Roadmap (Option B)

Goal: remove all functional stubs and placeholders by implementing full services and wiring across backend + web.

---

## Phase 0 — Inventory & Alignment
- [x] Audit all “stub/placeholder” references in codebase
- [x] Categorize by domain: chat, refunds, maps, availability
- [x] Define MVP scope for each service (must-have vs later)
- [x] Confirm data model changes needed in Prisma schema

---

## Phase 1 — Chat Service + Persistence
- [x] Create `chat-service` (NestJS)
- [x] Prisma models: Message + read receipts (order acts as conversation)
- [x] REST endpoints: list messages, send message, mark read
- [x] WebSocket gateway for real-time chat updates
- [x] Broker events: `chat.message_sent`, `chat.message_read`
- [x] API gateway routing for chat service
- [x] Web: replace buyer chat stub with live chat
- [x] Add chat history + unread counts
- [ ] Add moderation/audit log hooks

---

## Phase 2 — Refund Workflow Service
- [x] Create `refund-service` (NestJS)
- [x] Prisma models: RefundRequest, RefundStatus, RefundEvent
- [x] REST endpoints: submit refund, list refunds, admin approve/deny
- [x] Broker events: `refund.requested`, `refund.approved`, `refund.denied`, `refund.paid`
- [x] API gateway routing for refund service
- [x] Web: replace refund stub UI with real workflow
- [x] Link to payment/payout service for actual reversals
- [x] Add buyer notifications on status changes

---

## Phase 3 — Maps + Geocoding Integration
- [x] Select provider (OpenStreet / Nominatim)
- [x] Add server-side geocoding proxy to avoid exposing keys
- [x] Implement address autocomplete + reverse geocode
- [x] Store normalized coordinates in buyer checkout state
- [x] Replace placeholder map views with live maps
- [x] Use real delivery destination in tracking
- [x] Add permission-handling UX for geolocation

---

## Phase 4 — Seller Availability Pipeline
- [x] Define seller availability model (schedule + overrides + status)
- [x] Add availability endpoints to seller-service
- [x] Emit `seller.availability_updated` events
- [x] Update buyer discovery to filter by availability
- [x] Replace seller availability “stub” text
- [x] Add admin tooling for availability overrides

---

## Phase 5 — Cleanup & QA
- [x] Remove all stub text in UI
- [x] Remove unused placeholder components
- [ ] End-to-end test flows:
- [ ] Chat from buyer → seller
- [ ] Refund submission → approval → payout reversal
- [ ] Map search → checkout delivery → tracking
- [ ] Availability toggles → buyer filtering
- [ ] Mobile QA pass for new flows
- [ ] Script: `scripts/e2e_chat_refund.mjs` (requires DB + services running)

---

## Phase 6 — Observability & Reliability
- [ ] Add logging + tracing for chat/refund/map calls
- [ ] Rate limits for chat/refund endpoints
- [ ] Error retries + dead-letter queues for failed events
- [ ] Alerts on service failures
