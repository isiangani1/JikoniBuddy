import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { BuddyPoolService } from "./buddy-pool.service";

@Controller()
export class BuddyEventsController {
  private readonly logger = new Logger(BuddyEventsController.name);

  constructor(private readonly buddyService: BuddyPoolService) {}

  @EventPattern("capacity.exceeded")
  async handleCapacityExceeded(
    @Payload()
    data: { sellerId: string; activeOrders: number; maxOrdersPerHour: number }
  ) {
    this.logger.warn(
      `Capacity exceeded for seller ${data.sellerId}. Auto-creating Buddy request.`
    );

    return this.buddyService.createRequest({
      sellerId: data.sellerId,
      taskType: "packaging",
      location: { lat: -1.2833, lng: 36.8167, label: "Nairobi" },
      timeWindow: {
        start: new Date().toISOString(),
        end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      },
      durationHours: 2,
      compensation: 1500
    });
  }
}
