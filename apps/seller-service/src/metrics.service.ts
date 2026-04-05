import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

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
    const wallet = await prisma.wallet.findFirst({
      where: { userId: sellerId, type: "seller" }
    });

    const recentCompleted = await prisma.order.findMany({
      where: { sellerId, status: "completed" },
      orderBy: { updatedAt: "desc" },
      take: 30
    });

    const avgOrderCycleMins =
      recentCompleted.length === 0
        ? 0
        : Math.round(
            recentCompleted.reduce((sum, order) => {
              const diff = order.updatedAt.getTime() - order.createdAt.getTime();
              return sum + diff / 60000;
            }, 0) / recentCompleted.length
          );

    const buddyAssignments = await prisma.buddyAssignment.findMany({
      where: { request: { sellerId } },
      include: { request: true },
      orderBy: { createdAt: "desc" },
      take: 30
    });

    const avgBuddyMatchMins =
      buddyAssignments.length === 0
        ? 0
        : Math.round(
            buddyAssignments.reduce((sum, assignment) => {
              const diff =
                assignment.createdAt.getTime() -
                assignment.request.createdAt.getTime();
              return sum + diff / 60000;
            }, 0) / buddyAssignments.length
          );

    const processingHistory = recentCompleted
      .slice(0, 10)
      .map((order) => ({
        orderId: order.id,
        minutes: Math.round(
          (order.updatedAt.getTime() - order.createdAt.getTime()) / 60000
        ),
        completedAt: order.updatedAt
      }));

    const buddyLatencyHistory = buddyAssignments
      .slice(0, 10)
      .map((assignment) => ({
        requestId: assignment.requestId,
        minutes: Math.round(
          (assignment.createdAt.getTime() -
            assignment.request.createdAt.getTime()) /
            60000
        ),
        matchedAt: assignment.createdAt
      }));

    return {
      activeOrders,
      todaysOrders: todaysOrders.length,
      revenue,
      completedOrders,
      walletBalance: wallet?.balance ?? 0,
      walletPending: wallet?.pendingBalance ?? 0,
      capacityUtilization: Math.min(100, (activeOrders / 20) * 100),
      avgOrderCycleMins,
      avgBuddyMatchMins,
      recentCompletedOrders: recentCompleted.length,
      processingHistory,
      buddyLatencyHistory
    };
  }
}
