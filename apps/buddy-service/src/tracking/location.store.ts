import Redis from "ioredis";

type LocationPayload = {
  orderId: string;
  buddyId?: string;
  lat: number;
  lng: number;
  timestamp?: string;
};

export class LocationStore {
  private readonly redis: Redis | null;
  private readonly memory = new Map<string, LocationPayload>();

  constructor() {
    const url = process.env.REDIS_URL;
    this.redis = url ? new Redis(url) : null;
  }

  async setLocation(payload: LocationPayload) {
    const data = {
      ...payload,
      timestamp: payload.timestamp ?? new Date().toISOString()
    };
    if (this.redis) {
      await this.redis.setex(`tracking:${payload.orderId}`, 30, JSON.stringify(data));
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
