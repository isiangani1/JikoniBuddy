# Postman Request Guide (API Gateway)

Use this file to configure requests in Postman (not terminal). For each request, set **Method**, **URL**, optional **Headers**, and **Body** (JSON).

Base URL:
- `http://127.0.0.1:4000`

---

**Gateway Health**
- Method: `GET`
- URL: `http://127.0.0.1:4000/health`

**Gateway Metrics**
- Method: `GET`
- URL: `http://127.0.0.1:4000/metrics`

---

**Auth: Register**
- Method: `POST`
- URL: `http://127.0.0.1:4000/auth/register`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "role": "buyer",
  "name": "Amina Otieno",
  "email": "amina@example.com",
  "phone": "+254700111222",
  "password": "Pass123!"
}
```

**Auth: Login**
- Method: `POST`
- URL: `http://127.0.0.1:4000/auth/login`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "amina@example.com",
  "password": "Pass123!"
}
```

**Auth: Refresh**
- Method: `POST`
- URL: `http://127.0.0.1:4000/auth/refresh`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "refreshToken": "<REFRESH_TOKEN>"
}
```

**Auth: Logout**
- Method: `POST`
- URL: `http://127.0.0.1:4000/auth/logout`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "refreshToken": "<REFRESH_TOKEN>"
}
```

**Auth: Session**
- Method: `GET`
- URL: `http://127.0.0.1:4000/auth/session`
- Headers:
  - `Authorization: Bearer <ACCESS_TOKEN>`

---

**Buyer: Health**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buyer/health`

**Buyer: Summary**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buyer/summary`

**Buyer: Header Categories**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buyer/categories/header`

**Buyer: Curated Home**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buyer/curated/home`

**Buyer: Search**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buyer/search?q=chicken`

---

**Buddy: Register**
- Method: `POST`
- URL: `http://127.0.0.1:4000/api/buddy/auth/register`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "role": "buddy",
  "name": "Ian Siangani",
  "email": "ian@example.com",
  "phone": "+254700333444",
  "password": "Pass123!",
  "skills": ["cooking"],
  "location": {"lat": -1.2833, "lng": 36.8167, "label": "Nairobi"}
}
```

**Buddy: Login**
- Method: `POST`
- URL: `http://127.0.0.1:4000/api/buddy/auth/login`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "ian@example.com",
  "password": "Pass123!"
}
```

**Buddy: Open Requests**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buddy/requests?status=open`

**Buddy: Create Request**
- Method: `POST`
- URL: `http://127.0.0.1:4000/api/buddy/requests`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "sellerId": "seller-1",
  "taskType": "cooking",
  "location": {"lat": -1.2833, "lng": 36.8167, "label": "Nairobi"},
  "timeWindow": {
    "start": "2026-03-25T09:00:00.000Z",
    "end": "2026-03-25T11:00:00.000Z"
  },
  "durationHours": 2,
  "compensation": 1500
}
```

**Buddy: Request Details**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buddy/requests/<REQUEST_ID>`

**Buddy: Apply to Request**
- Method: `POST`
- URL: `http://127.0.0.1:4000/api/buddy/requests/<REQUEST_ID>/apply`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "helperId": "<BUDDY_ID>",
  "note": "Available now"
}
```

**Buddy: Reject Request**
- Method: `POST`
- URL: `http://127.0.0.1:4000/api/buddy/requests/<REQUEST_ID>/reject`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "helperId": "<BUDDY_ID>"
}
```

**Buddy: Confirm Assignment**
- Method: `POST`
- URL: `http://127.0.0.1:4000/api/buddy/requests/<REQUEST_ID>/confirm`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "helperId": "<BUDDY_ID>"
}
```

**Buddy: Profile**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buddy/users/<BUDDY_ID>`

**Buddy: Earnings**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buddy/users/<BUDDY_ID>/earnings`

**Buddy: Payments**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buddy/users/<BUDDY_ID>/payments`

**Buddy: Jobs**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buddy/users/<BUDDY_ID>/jobs?status=scheduled,in_progress`

**Buddy: Ratings**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buddy/users/<BUDDY_ID>/ratings`

**Buddy: Notifications**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buddy/users/<BUDDY_ID>/notifications`

**Buddy: Dashboard Metrics**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/buddy/users/<BUDDY_ID>/dashboard-metrics`

---

**Seller: Dashboard Metrics**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/seller/metrics/dashboard?sellerId=seller-1`

**Seller: Menu**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/seller/menu`

---

**Orders: Create**
- Method: `POST`
- URL: `http://127.0.0.1:4000/api/order/orders`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "buyerId": "buyer-1",
  "sellerId": "seller-1",
  "items": [{"name": "Nyama Choma", "quantity": 2}]
}
```

**Orders: Update Status**
- Method: `PATCH`
- URL: `http://127.0.0.1:4000/api/order/orders/<ORDER_ID>/status`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "status": "accepted"
}
```

---

**Menu Service**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/menu/`

---

**Admin (API Key)**
- Method: `GET`
- URL: `http://127.0.0.1:4000/api/admin/health`
- Headers:
  - `x-api-key: dev-admin-key`

---

**WebSocket (Buddy Tracking)**
Use a WS-capable client in Postman:
- URL: `ws://127.0.0.1:4000/ws/buddy`
- Events: `tracking:join`, `tracking:update`, `tracking:leave`
