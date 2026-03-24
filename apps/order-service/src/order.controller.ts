import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() payload: { buyerId: string; sellerId: string; items: any[]; totalAmount: number }) {
    return this.orderService.createOrder(payload.buyerId, payload.sellerId, payload.items, payload.totalAmount);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') orderId: string, @Body() payload: { status: string }) {
    return this.orderService.updateOrderStatus(orderId, payload.status);
  }
}
