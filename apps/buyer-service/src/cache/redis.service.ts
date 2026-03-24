import { Injectable, Logger } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis | null;

  constructor() {
    const url = process.env.REDIS_URL;
    if (!url) {
      this.client = null;
      return;
    }
    this.client = new Redis(url);
    this.client.on("error", (err) =>
      this.logger.warn(`Redis error: ${err.message}`)
    );
  }

  async getJson<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    const value = await this.client.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async setJson(key: string, value: unknown, ttlSeconds = 60) {
    if (!this.client) return;
    await this.client.setex(key, ttlSeconds, JSON.stringify(value));
  }
}
