import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { FailureHandlingService } from './failure.service';
import { SellerRealtimeGateway } from './realtime/seller-realtime.gateway';

const prisma = new PrismaClient();

@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @Inject('MESSAGE_BROKER') private readonly broker: ClientProxy,
    private readonly failureHandling: FailureHandlingService,
    private readonly realtime: SellerRealtimeGateway,
  ) {}
  
  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: { orderId: string, sellerId: string }) {
    this.logger.log(`Order ${data.orderId} created. Checking capacity for ${data.sellerId}...`);

    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: { items: true, buyer: true }
    });
    if (order) {
      this.realtime.emitOrderUpdate(order.sellerId, {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        buyerName: order.buyer?.name ?? "Buyer",
        buyerId: order.buyerId,
        items: order.items.map((item) => ({
          name: item.productId ?? "Item",
          quantity: item.quantity
        }))
      });
    }
    
    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: data.sellerId }
    });

    if (!seller) return;

    const activeOrders = await prisma.order.count({
      where: { sellerId: data.sellerId, status: { in: ['pending', 'accepted', 'preparing'] } }
    });

    if (activeOrders >= seller.maxOrdersPerHour) {
      this.logger.warn(
        `CAPACITY BREACHED for ${data.sellerId}. Active: ${activeOrders}, Max: ${seller.maxOrdersPerHour}.`
      );
      this.broker.emit('capacity.exceeded', {
        sellerId: data.sellerId,
        activeOrders,
        maxOrdersPerHour: seller.maxOrdersPerHour,
        timestamp: new Date().toISOString(),
      });

      if (!seller.autoBuddyScaling) {
        await this.failureHandling.triggerAutoPauseFallback(data.sellerId);
      } else {
        // Fire a direct Buddy request as a safety net while broker-based listeners are coming online.
        try {
          const buddyUrl = process.env.BUDDY_SERVICE_URL ?? "http://127.0.0.1:4005";
          await fetch(`${buddyUrl}/buddy/requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sellerId: data.sellerId,
              taskType: "packaging",
              location: { lat: -1.2833, lng: 36.8167, label: "Nairobi" },
              timeWindow: {
                start: new Date().toISOString(),
                end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
              },
              durationHours: 2,
              compensation: 1500
            })
          });
        } catch (error) {
          this.logger.warn(`Failed to auto-request Buddy via HTTP: ${String(error)}`);
        }
        // Give Buddy Pool time to match before auto-pausing
        this.failureHandling.scheduleCapacityFallback(data.sellerId);
      }
    }
  }

  @EventPattern('buddy.assigned')
  async handleBuddyAssigned(
    @Payload() data: { requestId: string; helperId: string; sellerId?: string }
  ) {
    this.logger.log(
      `Buddy assigned for request ${data.requestId}. Helper ${data.helperId}.`
    );
    if (data.sellerId) {
      this.failureHandling.clearCapacityFallback(data.sellerId);
      this.realtime.emitBuddyAssigned(data.sellerId, data);
    }
    // In a prod environment, this would increment the capacity limits slightly to absorb the new order flow.
  }

  @EventPattern('order.status_updated')
  async handleOrderStatusUpdated(
    @Payload() data: { orderId: string; status: string }
  ) {
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: { items: true, buyer: true }
    });
    if (!order) return;
    this.realtime.emitOrderUpdate(order.sellerId, {
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      buyerName: order.buyer?.name ?? "Buyer",
      buyerId: order.buyerId,
      items: order.items.map((item) => ({
        name: item.productId ?? "Item",
        quantity: item.quantity
      }))
    });
  }

  @EventPattern('buddy.completed')
  async handleBuddyCompleted(@Payload() data: { requestId: string; helperId: string }) {
    this.logger.log(
      `Buddy completed for request ${data.requestId}. Helper ${data.helperId}.`
    );
  }

  @EventPattern('payment.completed')
  async handlePaymentCompleted(@Payload() data: { orderId: string; sellerId: string }) {
    this.logger.log(
      `Payment completed for order ${data.orderId} (seller ${data.sellerId}).`
    );
  }
}
