
## 1. Vision

Buddy Pool is a **real-time distributed workforce orchestration system** designed to dynamically match supply (helpers) with demand (seller requests) under strict time and reliability constraints.

This system must be:

- Low latency
- Highly available
- Fault tolerant
- Horizontally scalable
- Event-driven

---

## 2. Core Principles

1. Event-Driven Architecture
2. Decoupled Microservices
3. Real-Time Matching
4. Resilient by Design
5. Data-Driven Optimization

---

## 3. High-Level Architecture

Clients (Seller / Helper Apps)
        ↓
API Gateway
        ↓
Buddy Pool Service
        ↓
Event Bus (Kafka)
        ↓
Matching Engine Service
        ↓
Notification Service
        ↓
Helper Apps

---

## 4. Core Services

### Buddy Pool Service
- Create requests
- Store job metadata
- Trigger events

### Matching Engine
- Runs asynchronously
- Computes best helper candidates
- Uses scoring model

### Notification Service
- Push (FCM)
- SMS fallback
- Retry logic

### Assignment Service
- Handles acceptance
- Prevents race conditions
- Confirms final helper

### Rating Service
- Tracks performance
- Feeds matching algorithm

---

## 5. Data Model

helpers
helper_skills
helper_availability

buddy_requests
buddy_candidates
buddy_assignments

ratings

---

## 6. Matching Algorithm

### MVP

Filter:
- Distance
- Availability
- Skill match

### Advanced Scoring

score = 
  w1 * proximity +
  w2 * rating +
  w3 * reliability +
  w4 * response_time +
  w5 * experience

Use ranking + top-K selection

---

## 7. Real-Time Flow

1. Seller creates request
2. Event published to Kafka
3. Matching engine consumes event
4. Candidates ranked
5. Notifications sent
6. Helpers accept
7. Assignment locked

---

## 8. Concurrency Handling

Problem:
Multiple helpers accept simultaneously

Solution:
- Use Redis distributed locks
- First valid acceptance wins
- Others receive rejection

---

## 9. Scalability Strategy

Phase 1:
- Modular monolith (NestJS)

Phase 2:
- Extract matching + notifications

Phase 3:
- Full microservices + Kafka

---

## 10. Fault Tolerance

- Retry queues
- Dead-letter queues
- Idempotent APIs
- Circuit breakers

---

## 11. Observability

Metrics:
- Match success rate
- Time to assignment
- Helper response rate

Tools:
- Prometheus
- Grafana
- Centralized logging

---

## 12. Security

- JWT auth
- Role-based access
- Input validation
- Audit logs

---

## 13. Future Enhancements

- AI-based matching
- Dynamic pricing
- Predictive demand
- Auto-assignment

---

## 14. Execution Plan

### Phase 1 (MVP)
- [x] Basic request creation
- [x] Simple matching
- [x] Notification system (stubbed)
- [x] Manual confirmation

### Phase 2
- [ ] Ratings
- [ ] Smart matching
- [ ] Availability scheduling

### Phase 3
- [ ] Kafka integration
- [ ] Distributed matching
- [ ] Auto-scaling

---

## 15. Final Note

Buddy Pool is not just a feature—it is a real-time distributed system that can evolve into a standalone workforce platform.
