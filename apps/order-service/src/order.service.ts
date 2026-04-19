import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class OrderService {
  constructor(
    @Inject('MESSAGE_BROKER') private readonly brokerClient: ClientProxy,
  ) {}

  async createOrder(buyerId: string, sellerId: string, items: any[], totalAmount: number) {
    const order = await prisma.order.create({
      data: {
        buyerId,
        sellerId,
        totalAmount,
        status: 'pending',
        statusEvents: {
          create: {
            status: 'pending',
            actorId: buyerId,
            actorRole: 'buyer',
            note: 'Order placed'
          }
        },
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true, statusEvents: true }
    });

    // Publish strict Domain Event for Distributed Architecture
    this.brokerClient.emit('order.created', {
      orderId: order.id,
      sellerId: order.sellerId,
      totalAmount: order.totalAmount,
      timestamp: order.createdAt
    });

    return order;
  }

  async updateOrderStatus(orderId: string, status: any) {
    const order = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status }
      });

      await tx.orderStatusEvent.create({
        data: {
          orderId: updated.id,
          status,
          actorRole: 'system',
          note: `Order moved to ${status}`
        }
      });

      return updated;
    });

    // Trigger state machine cascades
    this.brokerClient.emit('order.status_updated', {
      orderId: order.id,
      status: order.status,
      buyerId: order.buyerId,
      sellerId: order.sellerId
    });

    if (order.status === 'completed') {
      this.brokerClient.emit('delivery.confirmed', {
        orderId: order.id,
        timestamp: new Date().toISOString()
      });
    }

    return order;
  }
}
