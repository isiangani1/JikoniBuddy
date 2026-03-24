# TODO – Messaging, Real-Time, and Events

- [ ] Implement Pusher publishing for order status updates
- [ ] Implement Pusher chat for order-linked messaging (private channels)
- [ ] Implement Pusher auth endpoint for private channels
- [ ] Define Kafka topics and event contracts
- [ ] Emit core events: order.created, order.accepted, payment.completed, order.delivered
- [ ] Add consumer handlers for notifications and analytics
- [ ] Implement idempotency handling for events
- [ ] Add event retry and dead-letter handling
- [ ] Document sync vs async communication rules
