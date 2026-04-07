# Live Tracking Implementation TODO

Real-time location streaming system for helpers (buddies) and dashboards.

## 🏗️ Architecture
- **Helper App**: Continuous GPS streaming via `navigator.geolocation.watchPosition`.
- **Backend (NestJS)**: WebSocket Gateway to receive and broadcast updates.
- **Cache (Redis)**: Ultra-fast storage for the latest known coordinates.
- **Dahsboard (React)**: Live map updates via Socket.IO events.

## 📝 Roadmap

### Phase 1: Infrastructure
- [ ] Install dependencies (`socket.io`, `socket.io-client`, `ioredis`)
- [ ] Configure Redis connection in `buddy-service` or dedicated `location-service`
- [ ] Create `LocationGateway` in the backend to handle `location:update` events

### Phase 2: Backend Logic
- [ ] Implement `handleLocationUpdate` with Redis persistence
- [ ] Add Room-based broadcasting (Join `orderId` room)
- [ ] Implement "Last Seen" logic for connectivity drops

### Phase 3: Helper (Buddy) Integration
- [x] Implement `watchPosition` logic in the Buddy portal
- [x] Add throttling (send every 3-5 seconds or >10m movement)
- [ ] Handle backgrounding and permission errors

### Phase 4: Frontend (Seller/Buyer) Integration
- [x] Replace polling in `Orders` page with Socket.IO listeners
- [x] Smooth marker transitions (interpolation) for the map
- [x] Add "Rider Offline" visual states

### Phase 5: Optimization & Polish
- [x] Implement Redis expiration (30s TTL for active tracking)
- [ ] Persistent route history (optional)
- [ ] Load testing for concurrent deliveries
