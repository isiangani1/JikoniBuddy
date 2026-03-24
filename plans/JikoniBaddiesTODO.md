
# Jikoni Buddy – System Architecture & Execution Plan
Author: Solution Architecture Draft
Architecture Style: Modular Monolith → Microservices (NestJS)
Frontend: Next.js + React + React Native
Backend: NestJS (TypeScript)
Database: PostgreSQL
Infrastructure: AWS
Repo Strategy: Monorepo (apps + libs + infrastructure)

---

# 1. System Architecture Overview

The platform follows a **three‑portal marketplace architecture**:

- Buyer Portal
- Seller Portal
- Admin Portal

All clients communicate with a central **API Gateway**, which routes traffic to modular backend services built using **NestJS**.

Initial deployment is a **modular monolith**, but every module is designed so it can later become a **microservice** without rewriting the system.

MVP requirements are aligned to the Quotation Brief (v0.4, 12 Mar 2026), including:
Scheduled orders from day 1, seller availability and lead time rules, order status workflow,
M-Pesa STK Push + pay on delivery, and weekly demo + weekly code push.

---

# 2. High Level Architecture Layers

CLIENT LAYER
-------------
Next.js Web App
React Native Mobile App (Android + iOS)

API LAYER
---------
API Gateway
Authentication Layer
Rate Limiting
JWT Security

APPLICATION LAYER
-----------------
Auth Service
User Service
Seller Service
Menu Service
Order Service
Payment Service
Messaging Service
Delivery Service
Buddy Pool Service
Review & Rating Service
Notification Service
Admin Service

DATA LAYER
----------
PostgreSQL
Redis Cache
Search Engine (Elasticsearch)

INFRASTRUCTURE LAYER
--------------------
AWS Cloud
S3 Storage
CDN
Queue & Event System
Monitoring

---

# 3. Frontend Architecture

Framework: Next.js

Structure

/app
    /buyer
    /seller
    /admin

/components
/services
/hooks
/lib

Shared UI library used across portals.

Features:

Buyer Portal
- Account management
- Browse sellers
- Order placement
- Order tracking
- Messaging
- Reviews

Seller Portal
- Seller onboarding
- Menu management
- Order management
- Availability settings
- Buddy Pool requests

Admin Portal
- Seller verification
- Order monitoring
- Disputes
- Metrics dashboard
- Platform moderation

Mobile apps replicate buyer + seller features.

---

# 4. Backend Architecture (NestJS)

The backend is structured as **domain modules**.

Modules:

Auth Module
User Module
Seller Module
Menu Module
Order Module
Payment Module
Delivery Module
Messaging Module
Notification Module
Review Module
Buddy Pool Module
Admin Module

Each module contains:

controllers
services
entities
DTOs
repositories

Later these modules can be extracted into microservices.

Monorepo layout (scalable to microservices):

apps/
  api-gateway/
  auth-service/
  user-service/
  seller-service/
  menu-service/
  order-service/
  payment-service/
  messaging-service/
  delivery-service/
  buddy-service/
  review-service/
  notification-service/
  admin-service/

libs/
  common/ (dto, constants, enums, utils)
  database/ (prisma, migrations)
  auth/ (guards, strategies, decorators)
  messaging/ (events, kafka helpers)
  config/ (env, validation)

infrastructure/
  docker/
  kubernetes/
  nginx/
  terraform/

---

# 5. Core Backend Services

Auth Service
Handles:
- login
- registration
- JWT tokens
- role based permissions

User Service
Handles:
- user profiles
- addresses
- preferences

Seller Service
Handles:
- seller onboarding
- service areas
- availability
- lead times

Menu Service
Handles:
- menu items
- photos
- pricing
- availability

Order Service
Handles:
- scheduled orders
- order lifecycle
- order history

Order statuses:

placed
accepted
preparing
out_for_delivery
delivered
completed

Payment Service
Handles:
- M‑Pesa STK push
- payment confirmation
- pay on delivery records

Messaging Service
Handles:
- buyer ↔ seller chat
- order chat history

Delivery Service
Handles:
- delivery zones
- rider assignment
- tracking

Buddy Pool Service
Handles:
- helper request
- helper matching
- helper acceptance

Review Service
Handles:
- ratings
- reviews
- seller reputation

Notification Service
Handles:
- push notifications
- SMS alerts
- order updates

Admin Service
Handles:
- seller approval
- disputes
- refunds
- platform metrics

---

# 6. Database Architecture

Primary Database: PostgreSQL

Key Tables

users
roles
buyers
sellers
menus
menu_items
orders
order_items
payments
messages
reviews
delivery_zones
buddy_requests
buddy_assignments
notifications

ORM: Prisma

Benefits

typed queries
migration support
schema safety

Service data ownership:
Each service owns its data (separate schemas in phase 1, separate DBs later).
Examples:
Order Service → orders schema
Payment Service → payments schema
User Service → users schema

---

# 7. Real Time Communication

Technology:

Socket.IO

Used for:

order status updates
chat messaging
buddy pool alerts
admin monitoring

Service communication patterns:
Sync: HTTP/REST via API Gateway
Async: Kafka events (order.created, payment.completed, order.delivered, review.created, buddy.requested)
Real-time: Socket.IO for order status and messaging

---

# 8. Payment Architecture

Primary Payment:

M‑Pesa STK Push

Flow

User places order
Backend triggers STK push
User confirms payment
Safaricom callback
Payment verified
Order marked paid

Alternative:

Pay on Delivery

---

# 9. Search & Discovery

Search Engine:

Elasticsearch

Used for

seller discovery
category search
location filtering
top rated sellers

---

# 10. Infrastructure

Cloud Provider: AWS

Components

EC2 – backend services
RDS – PostgreSQL
S3 – media storage
CloudFront – CDN
Elasticache – Redis

Background workers:
- payment-processor
- notification-worker
- analytics-worker

---

# 11. Security Architecture

JWT authentication
Role Based Access Control
Rate limiting
Input validation
Encrypted secrets
Audit logs

API Gateway responsibilities:
- Authentication + JWT validation
- Routing + aggregation
- Rate limiting + abuse prevention

---

# 12. Observability

Monitoring stack

Prometheus
Grafana
Central logging

Metrics tracked

order volume
payment failures
API latency
seller performance

---

# 13. CI/CD Pipeline

Repository: Client GitHub

Pipeline

code push
build
unit tests
docker build
deploy staging
deploy production

Tools

GitHub Actions
Docker

---

# 14. Scalability Strategy

Phase 1

Monolithic NestJS app

Phase 2

Split services

Auth Service
Order Service
Payment Service
Messaging Service

Phase 3

Event driven architecture

Kafka event bus

Caching strategy:
Redis used for seller listings, popular menus, session storage, and rate limiting.

---

# 15. Development Execution Plan

## Phase 1 – Foundation

- [ ] Project repositories created
- [ ] Monorepo folder structure scaffolded (apps, libs, infrastructure)
- [ ] CI/CD pipelines setup
- [ ] Infrastructure provisioning
- [ ] PostgreSQL database setup
- [ ] NestJS backend scaffold
- [ ] Next.js frontend scaffold
- [ ] React Native app scaffold (Android + iOS)
- [ ] Authentication system
- [ ] Role based access
- [ ] API Gateway skeleton with routing + auth

Duration: 2–3 weeks

---

## Phase 2 – Marketplace Core

- [ ] Seller onboarding
- [ ] Buyer registration
- [ ] Seller profiles
- [ ] Menu management
- [ ] Category browsing
- [ ] Search functionality

Duration: 3 weeks

---

## Phase 3 – Ordering System

- [ ] Scheduled order logic
- [ ] Cart system
- [ ] Order creation
- [ ] Order status workflow
- [ ] Order history

Duration: 3 weeks

---

## Phase 4 – Payments

- [ ] M‑Pesa STK push integration
- [ ] Payment confirmation callback
- [ ] Pay on delivery workflow
- [ ] Payment ledger

Duration: 2 weeks

---

## Phase 5 – Messaging & Notifications

- [ ] Buyer seller messaging
- [ ] Real time sockets
- [ ] Push notifications
- [ ] SMS alerts

Duration: 2 weeks

---

## Phase 6 – Delivery & Logistics

- [ ] Delivery zone pricing
- [ ] Rider assignment
- [ ] Delivery tracking

Duration: 2 weeks

---

## Phase 7 – Buddy Pool Feature

- [ ] Helper request creation
- [ ] Helper matching logic
- [ ] Helper acceptance flow
- [ ] Notifications

Duration: 2 weeks

---

## Phase 8 – Trust & Quality

- [ ] Reviews
- [ ] Ratings
- [ ] Seller performance scoring
- [ ] Admin verification tools

Duration: 2 weeks

---

## Phase 9 – Admin Dashboard

- [ ] Platform metrics
- [ ] Order monitoring
- [ ] Dispute handling
- [ ] Refund workflows

Duration: 2 weeks

---

## Phase 10 – QA & Launch

- [ ] Full system testing
- [ ] Load testing
- [ ] Security testing
- [ ] Deployment
- [ ] App store preparation

Duration: 2–3 weeks

---

# Estimated Total Timeline

16 – 18 weeks

---

# Future Enhancements

AI demand forecasting
Smart kitchen scheduling
Rider fleet optimization
Dynamic pricing
Multi city scaling
