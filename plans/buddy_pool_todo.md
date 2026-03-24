# Buddy Pool Service Architecture

## 1. Overview

The Buddy Pool service is a core differentiator of the Jikoni Buddy platform, enabling food sellers to request temporary help during peak demand. It functions as a real-time workforce sharing system, similar to Uber for kitchen staff.

## 2. Service Architecture

The Buddy Pool service is implemented as a NestJS module within the monorepo, designed to be extracted as a microservice in the future.

### Modules and Components

- **BuddyPoolController**: Handles HTTP requests for buddy pool operations.
- **BuddyPoolService**: Contains business logic for request handling, matching, and assignments.
- **NotificationService**: Sends alerts to helpers and sellers (currently a stub for FCM/SMS integration).
- **PrismaService**: Provides database access via Prisma ORM.
- **DTOs**: Data Transfer Objects for validating incoming requests.
- **Entities**: Prisma models defining the data structure.

### File Structure

```
apps/buddy-service/
├── src/
│   ├── buddy-pool/
│   │   ├── buddy-pool.controller.ts
│   │   ├── buddy-pool.service.ts
│   │   ├── notification.service.ts
│   │   ├── dto.ts
│   │   ├── buddy-pool.types.ts
│   │   └── buddy-pool.module.ts
│   ├── prisma.service.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma
└── scripts/
    └── run-prisma.js
```

## 3. Data Models (Entities)

The Buddy Pool service uses the following Prisma models:

- **Helper**: Represents a buddy (helper) with fields for identification, contact, status, rating, availability, skills, and relationships.
- **User**: Represents a platform user (buyer, seller, buddy, admin) with role-based access.
- **HelperSkill**: Links a helper to specific task types (cooking, packaging, delivery).
- **HelperAvailability**: Defines a helper's weekly availability schedule.
- **BuddyRequest**: Represents a request for help from a seller, including task type, location, time window, and compensation.
- **BuddyApplication**: Represents a helper's application to a buddy request.
- **BuddyAssignment**: Represents a confirmed assignment of a helper to a request.
- **Rating**: Represents a seller's rating of a helper after task completion.

Key enums include `TaskType`, `UserRole`, `BuddyRequestStatus`, `ApplicationStatus`, `AssignmentStatus`, and `BuddyStatus`.

## 4. APIs (Controllers)

The BuddyPoolController exposes the following REST endpoints:

- `POST /buddy/requests`: Create a new buddy request (seller).
- `GET /buddy/requests`: List buddy requests (optional filtering by status).
- `GET /buddy/requests/:id`: Get a specific buddy request with applications and assignments.
- `POST /buddy/requests/:id/apply`: Apply to a buddy request (helper).
- `POST /buddy/requests/:id/confirm`: Confirm a helper for a request (seller).
- `POST /buddy/assignments/:id/complete`: Mark an assignment as completed.
- `POST /buddy/ratings`: Submit a rating for a completed assignment.

## 5. Matching Algorithm and Services

The matching logic resides in the `BuddyPoolService` and operates as follows:

1. When a request is created, the service finds available helpers matching the task type.
2. Filters helpers by availability (`isAvailable: true`) and status (`active`).
3. Further filters by skills matching the request's task type.
4. Filters by geographic proximity (within a default 5km radius using the Haversine formula).
5. Sorts helpers by rating (descending) to prioritize higher-rated helpers.
6. Notifies the top 5 matches via the notification service.

The matching algorithm is designed to be extended with weighted scoring (distance, rating, availability, experience) in future phases.

## 6. Notification Integration

The `NotificationService` is currently a stub that logs notifications. It is designed to integrate with:
- Firebase Cloud Messaging (FCM) for push notifications.
- Africa's Talking for SMS alerts (fallback).

Notifications are sent to:
- Helpers when a new request matches their skills and location.
- Sellers when a helper applies to their request.
- Helpers when they are confirmed for an assignment.

## 7. Real-time Communication (Socket.IO)

While the current implementation uses REST and polling for updates, the system architecture plan specifies Socket.IO for real-time communication. Planned real-time features include:
- Live updates of buddy request status.
- Instant notifications for new requests and applications.
- Real-time chat between sellers and assigned helpers.
- Live tracking of helper arrival and task progress.

Integration with Socket.IO will be implemented in a later phase to enhance user experience.

## 8. Implementation Phases

### Phase 1 (MVP)
- Manual helper pool (initial set of verified helpers).
- Basic matching based on task type, availability, and location.
- No payments (offline agreement between seller and helper).
- Simple accept/reject flow for helpers.
- Stub notification service (logging only).
- Basic REST APIs for request lifecycle.

### Phase 2
- Implement ratings and reputation system for helpers.
- Enhance matching algorithm with weighted scoring.
- Implement helper availability calendar (weekly schedule).
- Integrate real notifications (FCM and SMS).
- Add basic real-time updates via Socket.IO for request status.

### Phase 3
- Implement payment handling for helper compensation (platform-managed payouts).
- Advanced real-time features: live location tracking, in-app chat.
- Admin moderation tools for helper verification and dispute resolution.
- Mobile app integration for helpers (React Native).

## 9. Conclusion

The Buddy Pool service is designed to be scalable, maintainable, and aligned with the platform's microservices vision. The current implementation provides a solid foundation for MVP, with clear pathways for enhancement in subsequent phases.
