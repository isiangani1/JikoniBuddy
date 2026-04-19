import Redis from "ioredis";
import { PrismaService } from "../prisma.service";

type LocationPayload = {
  orderId: string;
  buddyId?: string;
  lat: number;
  lng: number;
  timestamp?: string;
  accuracy?: number;
};

export class LocationStore {
  private readonly redis: Redis | null;
  private readonly memory = new Map<string, LocationPayload>();

  constructor(private readonly prisma: PrismaService) {
    const url = process.env.REDIS_URL;
    this.redis = url ? new Redis(url) : null;
  }

  async setLocation(payload: LocationPayload) {
    const data = {
      ...payload,
      timestamp: payload.timestamp ?? new Date().toISOString()
    };
    await this.prisma.trackingPoint.create({
      data: {
        orderId: data.orderId,
        buddyId: data.buddyId ?? null,
        lat: data.lat,
        lng: data.lng,
        accuracy: data.accuracy ?? null,
        source: "socket",
        recordedAt: new Date(data.timestamp)
      }
    });
    if (this.redis) {
      const ttl = Number(process.env.TRACKING_TTL_SECONDS ?? 30);
      await this.redis.setex(`tracking:${payload.orderId}`, ttl, JSON.stringify(data));
      return;
    }
    this.memory.set(payload.orderId, data);
  }

  async getLocation(orderId: string): Promise<LocationPayload | null> {
    if (this.redis) {
      const raw = await this.redis.get(`tracking:${orderId}`);
      return raw ? (JSON.parse(raw) as LocationPayload) : null;
    }
    return this.memory.get(orderId) ?? null;
  }
}
