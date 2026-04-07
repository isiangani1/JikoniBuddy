import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async listReviews(filters: { sellerId?: string; orderId?: string; buyerId?: string }) {
    return this.prisma.review.findMany({
      where: {
        sellerId: filters.sellerId ?? undefined,
        orderId: filters.orderId ?? undefined,
        buyerId: filters.buyerId ?? undefined
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async getReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException("Review not found.");
    return review;
  }

  async getSummary(sellerId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { sellerId },
      orderBy: { createdAt: "desc" }
    });
    const count = reviews.length;
    const avg =
      count === 0
        ? 0
        : reviews.reduce((sum: number, item) => sum + item.rating, 0) / count;

    return {
      count,
      average: Number(avg.toFixed(1)),
      latest: reviews.slice(0, 5)
    };
  }

  async submitReview(payload: {
    orderId: string;
    sellerId: string;
    buyerId: string;
    rating: number;
    comment?: string;
  }) {
    const rating = Math.max(1, Math.min(5, Math.round(payload.rating)));

    return this.prisma.review.upsert({
      where: { orderId: payload.orderId },
      create: {
        orderId: payload.orderId,
        sellerId: payload.sellerId,
        buyerId: payload.buyerId,
        rating,
        comment: payload.comment ?? ""
      },
      update: {
        rating,
        comment: payload.comment ?? ""
      }
    });
  }
}
