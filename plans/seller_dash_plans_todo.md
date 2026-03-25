# Seller Dashboard & Distributed Architecture Plan

## 1. Domain-Driven Microservices Split
To future-proof the platform and eliminate scaling bottlenecks, responsibilities must be strictly isolated:
- [x] **Seller Service**: Tenant configuration, seller profiles, preferences, working hours.
- [x] **Menu Service**: Product catalog, item categories, bulk item availability.
- [x] **Order Service**: Order lifecycle (Pending -> Preparing -> Completed).
- [x] **Metrics Service**: Dashboard aggregations, historical trend data.
- [x] **Buddy Service**: Workforce matchmaking.

## 2. Event System (Message Broker integration)
Moving away from synchronous API polling to a true distributed event system.
- [ ] **Publish Events**:
  - [x] `order.created`
  - [x] `order.status_updated`
  - [x] `capacity.exceeded`
- [ ] **Subscribe to Events**:
  - [x] `buddy.assigned` (to update seller dashboard)
  - [x] `buddy.completed`
  - [x] `payment.completed` (to authorize prep)

## 3. Buddy Pool Integration & Smart Capacity
- [x] **Smart Capacity Engine**: Dynamically calculate capacity based on active orders, aggregate prep time, and available staff.
- [x] **Auto Buddy Trigger**: IF `incoming_orders > capacity` THEN automatically publish `capacity.exceeded` to trigger the Buddy Pool matchmaking.
- [ ] **API & Listeners**:
  - [x] `POST /buddy/requests` (Manual trigger)
  - [x] Listen: `buddy.assigned` to notify kitchen staff.

## 4. Security & Multi-Tenant Isolation
- [x] **Seller Isolation**: All backend queries strictly scoped by `seller_id` (Tenant ID).
- [x] **Guards**: JWT-based authentication implemented at the API Gateway level.
- [x] **RBAC**: Role-based access control (Admin vs Kitchen Staff vs Manager).

## 5. Failure Handling & Observability
- [ ] **Resilience**: Implement dead-letter queues / retry policies for failed events (e.g., payment webhooks).
- [x] **Fallbacks**: Auto-disable incoming orders if capacity is breached and 0 buddies are matched.
- [ ] **Observability**: Track order processing time, capacity utilization, and buddy response latency (Google-level metrics).

---

## 6. Frontend: State Management & UI Architecture
- [x] **Server State**: Implement **React Query** for fetching, caching, and invalidating orders, menus, and metrics.
- [x] **Client State**: Implement **Zustand** for local UI state (modals, active filters, sidebar state).
- [x] **Real-Time Sync**: Use WebSocket connections for strictly real-time UI updates (new orders incoming, buddy matches) without manual polling.

### Dashboard Sections
- [x] **Dashboard Home**: Real-time metrics grid, capacity utilization gauge (`RadialPerformanceChart`), order momentum.
- [x] **Order Management**: Event-driven Kanban or queue system.
- [x] **Menu Management**: Catalog editor with bulk toggle actions.
- [x] **Capacity Control**: UI to configure Smart Capacity parameters.
- [ ] **Financials & Logistics**: M-Pesa tracking, payout logs, reviews.
