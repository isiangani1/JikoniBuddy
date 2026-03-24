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
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
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
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    // Trigger state machine cascades
    this.brokerClient.emit('order.status_updated', {
      orderId: order.id,
      status: order.status
    });

    return order;
  }
}
