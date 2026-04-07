import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, UserAvailability } from '@prisma/client';

const prisma = new PrismaClient();

export type AvailabilityPayload = {
  isAcceptingOrders?: boolean;
  operatingHoursOpen?: string | null;
  operatingHoursClose?: string | null;
  schedule?: Array<{ dayOfWeek: number; startTime: string; endTime: string }>;
};

@Injectable()
export class AvailabilityService {
  async getAvailability(sellerId: string) {
    const profile = await prisma.sellerProfile.findUnique({
      where: { userId: sellerId }
    });

    const schedule = await prisma.userAvailability.findMany({
      where: { userId: sellerId },
      orderBy: { dayOfWeek: 'asc' }
    });

    return {
      sellerId,
      profile: profile ?? null,
      schedule
    };
  }

  async updateAvailability(sellerId: string, payload: AvailabilityPayload) {
    const profile = await prisma.sellerProfile.upsert({
      where: { userId: sellerId },
      update: {
        ...(payload.isAcceptingOrders !== undefined
          ? { isAcceptingOrders: payload.isAcceptingOrders }
          : {}),
        ...(payload.operatingHoursOpen !== undefined
          ? { operatingHoursOpen: payload.operatingHoursOpen }
          : {}),
        ...(payload.operatingHoursClose !== undefined
          ? { operatingHoursClose: payload.operatingHoursClose }
          : {})
      },
      create: {
        userId: sellerId,
        isAcceptingOrders: payload.isAcceptingOrders ?? true,
        operatingHoursOpen: payload.operatingHoursOpen ?? '08:00',
        operatingHoursClose: payload.operatingHoursClose ?? '22:00'
      }
    });

    let schedule: UserAvailability[] = [];
    if (payload.schedule) {
      await prisma.userAvailability.deleteMany({ where: { userId: sellerId } });
      schedule = await prisma.userAvailability.createMany({
        data: payload.schedule.map((item) => ({
          userId: sellerId,
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime,
          endTime: item.endTime
        }))
      }).then(async () => prisma.userAvailability.findMany({ where: { userId: sellerId }, orderBy: { dayOfWeek: 'asc' } }));
    } else {
      schedule = await prisma.userAvailability.findMany({
        where: { userId: sellerId },
        orderBy: { dayOfWeek: 'asc' }
      });
    }

    if (!profile) throw new NotFoundException('Seller profile not found');

    return { sellerId, profile, schedule };
  }
}
