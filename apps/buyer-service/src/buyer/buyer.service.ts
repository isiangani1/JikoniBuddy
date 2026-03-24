import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { RedisService } from "../cache/redis.service";

@Injectable()
export class BuyerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  async getHeaderCategories() {
    return this.prisma.category.findMany({
      where: { kind: "header" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });
  }

  async getHomeSections() {
    return this.prisma.category.findMany({
      where: { kind: "home" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 8
        }
      }
    });
  }

  async search(query: string) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    const cacheKey = `buyer:search:${normalized}`;
    const cached = await this.redis.getJson<any[]>(cacheKey);
    if (cached) return cached;

    const results = await this.prisma.product.findMany({
      where: {
        isActive: true,
        name: {
          contains: normalized,
          mode: "insensitive"
        }
      },
      take: 12,
      include: {
        category: true
      }
    });
    await this.redis.setJson(cacheKey, results, 120);
    return results;
  }
}
