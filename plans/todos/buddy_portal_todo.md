# Buddy Portal – TODO (Phased)

## Phase 1 – Foundation & Onboarding (MVP)
- [x] Single login flow with role-based redirect (buddy/seller/buyer/admin)
- [x] Buddy registration form (name, phone, email, password)
- [x] Skill selection (cooking, packaging, delivery)
- [x] Location setup (area + optional GPS placeholder)
- [x] Verification upload (ID + profile photo)
- [x] Buddy status lifecycle (pending → approved → active → suspended)
- [x] Admin approval screen for buddy verification

## Phase 2 – Buddy Dashboard & Requests
- [x] Buddy dashboard layout (status toggle + summary)
- [x] Go Online / Go Offline toggle
- [x] Available requests feed (skill, time, location, payment)
- [x] Filters: skill, distance, time
- [x] Request details view
- [x] Accept / Decline actions
- [x] Buddy portal shell (header + sidebar + portal navigation)
- [x] Header: online/offline toggle + notifications + messages + earnings snapshot + profile dropdown
- [x] Sidebar: dashboard, requests, active jobs, history, earnings, ratings, messages, settings, support
- [x] UX state highlights (offline vs online focus)
- [x] Persist buddy online status to backend and restore on refresh
- [x] Empty states for requests/history/earnings with CTA
- [x] Loading states (skeletons) for dashboard widgets
- [x] Global error/toast pattern for failed actions
- [x] Route guard to keep buddy pages isolated from other roles

## Phase 3 – Job Flow & Tracking
- [x] Job status lifecycle (requested → accepted → in_progress → completed → paid)
- [x] Active job view (details, timer, contact seller)
- [x] Mark job completed
- [x] Seller notification on accept/complete
- [x] Real-time updates for job status via sockets
- [x] GPS check-in/out on job start/end
- [x] Job notes on completion
- [ ] Evidence upload (photos) on completion
- [x] Dispute flagging on job completion

## Phase 4 – Earnings & Payouts
- [x] Earnings summary (today / week / total)
- [x] Job history with payments
- [x] Payout status (manual in MVP)
- [ ] M-Pesa payout integration (later phase)
- [x] Wallet pending/available balances in buddy earnings
- [x] Payout method selection (M-Pesa / bank)
- [x] Transaction ledger view with filters
- [x] Export earnings history (CSV)

## Phase 5 – Communication & Notifications
- [x] Job-specific chat (buddy ↔ seller)
- [x] Push notifications (FCM) wiring + fallback dispatcher
- [x] SMS fallback (Africa’s Talking) wiring + fallback dispatcher
- [x] Notification settings for buddy
- [x] Notifications dropdown (header)
- [x] Messages badge count (header)
- [x] Notification preferences per channel (push/SMS/email)
- [x] In-app toast notifications for new requests
- [x] Offline notification queue (replay on reconnect)

## Phase 6 – Ratings & Reputation
- [x] Seller rates buddy after job
- [x] Buddy reputation score
- [x] Visibility impact based on rating
- [ ] Rating breakdown (speed, quality, professionalism)
- [ ] Review replies (buddy can respond once)
- [ ] Reputation insights panel (what to improve)

## Phase 7 – Advanced Matching (Later)
- [x] Matching score (distance + rating + response time)
- [x] Availability calendar
- [x] Performance analytics
- [x] Auto-accept rules (if within distance/time)
- [x] Smart idle positioning suggestions
- [x] Fraud signals (GPS spoofing, repeated cancellations)
