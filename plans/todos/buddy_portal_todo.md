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
- [ ] Buddy portal shell (header + sidebar + portal navigation)
- [ ] Header: online/offline toggle + notifications + messages + earnings snapshot + profile dropdown
- [ ] Sidebar: dashboard, requests, active jobs, history, earnings, ratings, messages, settings, support
- [ ] UX state highlights (offline vs online focus)

## Phase 3 – Job Flow & Tracking
- [x] Job status lifecycle (requested → accepted → in_progress → completed → paid)
- [x] Active job view (details, timer, contact seller)
- [x] Mark job completed
- [x] Seller notification on accept/complete

## Phase 4 – Earnings & Payouts
- [x] Earnings summary (today / week / total)
- [x] Job history with payments
- [x] Payout status (manual in MVP)
- [ ] M-Pesa payout integration (later phase)

## Phase 5 – Communication & Notifications
- [x] Job-specific chat (buddy ↔ seller)
- [ ] Push notifications (FCM)
- [ ] SMS fallback (Africa’s Talking)
- [x] Notification settings for buddy
- [ ] Notifications dropdown (header)
- [ ] Messages badge count (header)

## Phase 6 – Ratings & Reputation
- [x] Seller rates buddy after job
- [x] Buddy reputation score
- [x] Visibility impact based on rating

## Phase 7 – Advanced Matching (Later)
- [ ] Matching score (distance + rating + response time)
- [ ] Availability calendar
- [ ] Performance analytics
