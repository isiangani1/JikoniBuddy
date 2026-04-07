import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AvailabilityService } from './availability.service';
import type { AvailabilityPayload } from './availability.service';

@Controller('seller')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    @Inject('MESSAGE_BROKER') private readonly broker: ClientProxy
  ) {}

  @Get('availability')
  async getAvailability(@Query('sellerId') sellerId?: string) {
    if (!sellerId) return { error: 'Missing sellerId' };
    return this.availabilityService.getAvailability(sellerId);
  }

  @Put('availability')
  async updateAvailability(
    @Query('sellerId') sellerId: string,
    @Body() payload: AvailabilityPayload
  ) {
    const result = await this.availabilityService.updateAvailability(sellerId, payload);
    this.broker.emit('seller.availability_updated', {
      sellerId,
      isAcceptingOrders: result.profile?.isAcceptingOrders,
      operatingHoursOpen: result.profile?.operatingHoursOpen,
      operatingHoursClose: result.profile?.operatingHoursClose,
      timestamp: new Date().toISOString()
    });
    return result;
  }
}
