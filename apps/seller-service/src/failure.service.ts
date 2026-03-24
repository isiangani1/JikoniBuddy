import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class FailureHandlingService {
  private readonly logger = new Logger(FailureHandlingService.name);

  // Simulated Dead-Letter Queue (DLQ) for the Message Broker
  private deadLetterQueue: Array<{ event: string; payload: any; errors: string[]; retryCount: number }> = [];

  async queueRetry(event: string, payload: any, error: string) {
    this.logger.warn(`[DLQ] Queuing failed event '${event}' for retry. Reason: ${error}`);
    this.deadLetterQueue.push({ event, payload, errors: [error], retryCount: 0 });
    
    // In production, a CRON job or RabbitMQ delayed exchange would handle the pop.
    this.processDeadLetterQueue();
  }

  private async processDeadLetterQueue() {
    setTimeout(async () => {
      const task = this.deadLetterQueue.shift();
      if (!task) return;

      this.logger.log(`[DLQ] Attempting retry 1 for event '${task.event}'...`);
      // Simulating a failed retry
      task.retryCount++;
      if (task.retryCount > 3) {
        this.logger.error(`[DLQ] Event '${task.event}' permanently failed and dropped.`);
      } else {
        this.deadLetterQueue.push(task);
      }
    }, 5000); // 5s backoff
  }

  async triggerAutoPauseFallback(sellerId: string) {
    this.logger.error(`[FALLBACK] Critical capacity breach without Buddy response. Auto-pausing store ${sellerId}`);
    
    // Safety Fallback: Stop bleeding reputation by disabling incoming buyer orders
    await prisma.sellerProfile.update({
      where: { userId: sellerId },
      data: { isAcceptingOrders: false }
    });

    this.logger.log(`[FALLBACK] Store ${sellerId} is now OFFLINE.`);
  }
}
