import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller()
export class EventsController {
  
  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: { orderId: string, sellerId: string }) {
    console.log(`[Seller Service] Order ${data.orderId} created. Checking Intelligent Capacity for ${data.sellerId}...`);
    
    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: data.sellerId }
    });

    if (!seller) return;

    const activeOrders = await prisma.order.count({
      where: { sellerId: data.sellerId, status: { in: ['pending', 'accepted', 'preparing'] } }
    });

    if (activeOrders >= seller.maxOrdersPerHour) {
      console.log(`[Seller Service] CAPACITY BREACHED for ${data.sellerId}. Active: ${activeOrders}, Max: ${seller.maxOrdersPerHour}. Triggering Buddy SOS!`);
      // Simulating the trigger to Buddy service
      // this.broker.emit('capacity.exceeded', { sellerId: data.sellerId });
    }
  }

  @EventPattern('buddy.assigned')
  async handleBuddyAssigned(@Payload() data: { requestId: string, helperId: string }) {
    console.log(`[Seller Service] Received confirmation that Help Request ${data.requestId} has been fulfilled by Buddy ${data.helperId}.`);
    // In a prod environment, this would increment the capacity limits slightly to absorb the new order flow.
  }
}
