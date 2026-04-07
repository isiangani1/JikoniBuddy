# CSS → Tailwind Migration Plan (Mobile‑First)

**Goal**: Replace legacy custom CSS with Tailwind utility classes while preserving design intent and improving mobile responsiveness.

---

## Phase 0 — Audit & Guardrails
- [x] Inventory global styles (`apps/web/app/globals.css`) and map to Tailwind equivalents
- [ ] Identify reusable patterns (cards, buttons, tables, badges, navs, modals)
- [ ] Create a do‑not‑break list (critical pages: landing, buyer portal, buddy portal, seller dashboard)
- [ ] Define responsive breakpoints and mobile‑first layout rules

---

## Phase 1 — Tailwind Setup & Tokens
- [x] Install Tailwind + PostCSS config for Next app
- [x] Add Tailwind base/styles to `globals.css`
- [x] Define initial design tokens in `tailwind.config.mjs`:
  - [x] Colors (brand, background, accents)
  - [x] Typography scale
  - [x] Spacing scale
  - [x] Shadows, radii
  - [x] Gradients
- [x] Create Tailwind component helpers (component wrappers)

---

## Phase 2 — Core UI Primitives (Mobile‑First)
- [ ] Buttons (primary/ghost/base)
- [ ] Cards, tiles, tables
- [ ] Inputs / forms / dropdowns
- [ ] Badges / pills / status
- [x] Layout shells (header, footer)
- [x] Replace inline styles in buyer/seller/buddy shells with Tailwind classes
- [x] Remove legacy class dependencies in portal shells/dashboards

---

## Phase 3 — Migrate High‑Traffic Screens
- [x] Landing page
- [x] Login / Register
- [ ] Buyer portal shell + home
- [ ] Buddy portal shell + dashboard
- [ ] Seller portal shell + dashboard

---

## Phase 4 — Migrate Remaining Pages
- [ ] Buddy portal pages (requests, earnings, ratings, settings)
- [ ] Seller portal pages (orders, menu, financials, reviews)
- [ ] Buyer portal pages (orders, sellers, checkout)
- [ ] Admin pages

---

## Phase 5 — Cleanup & Remove Legacy CSS
- [ ] Remove unused CSS blocks from `globals.css`
- [ ] Ensure no broken selectors remain
- [ ] Remove custom CSS files no longer used

---

## Phase 6 — QA & Responsive Review
- [ ] Mobile layout pass (320px → 480px)
- [ ] Tablet layout pass (768px)
- [ ] Desktop layout pass (1024px+)
- [ ] Accessibility checks (focus states, contrast)
- [ ] (In progress) Mobile QA sweep: seller analytics/support/profile/capacity, buyer checkout, buddy active-jobs

---

## Phase 7 — Performance & Consistency
- [ ] Purge unused Tailwind classes
- [ ] Ensure bundle size is stable
- [ ] Verify visual parity vs original UI
