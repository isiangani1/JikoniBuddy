import { Injectable } from "@nestjs/common";
import { PrismaClient } from "../../../prisma/generated/client";

const prisma = new PrismaClient();

@Injectable()
export class MetricsService {
  async getDashboardMetrics(sellerId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeOrders = await prisma.order.count({
      where: {
        sellerId,
        status: { in: ["pending", "accepted", "preparing"] }
      }
    });

    const todaysOrders = await prisma.order.findMany({
      where: {
        sellerId,
        createdAt: { gte: today }
      }
    });

    const revenue = todaysOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const completedOrders = todaysOrders.filter(o => o.status === "completed").length;

    return {
      activeOrders,
      todaysOrders: todaysOrders.length,
      revenue,
      completedOrders,
      capacityUtilization: Math.min(100, (activeOrders / 20) * 100) // Mock logic: assume max 20 capacity
    };
  }
}
