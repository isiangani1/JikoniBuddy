import { Injectable } from "@nestjs/common";
import { BuddyRequestStatus, OrderStatus, RefundStatus } from "@prisma/client";
import { PrismaService } from "./prisma.service";

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

@Injectable()
export class PerformanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(days: number) {
    const windowDays = Math.min(120, Math.max(7, Number.isFinite(days) ? days : 30));
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

    const [orders, refundRequests, buddyRequests] = await Promise.all([
      this.prisma.order.findMany({
        where: { createdAt: { gte: since } },
        include: {
          statusEvents: {
            orderBy: { createdAt: "asc" }
          }
        },
        orderBy: { createdAt: "asc" }
      }),
      this.prisma.refundRequest.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "asc" }
      }),
      this.prisma.buddyRequest.findMany({
        where: { createdAt: { gte: since } },
        include: {
          assignments: {
            orderBy: { createdAt: "asc" }
          }
        },
        orderBy: { createdAt: "asc" }
      })
    ]);

    const deliveryTargetMinutes = 45;
    const matchTargetMinutes = 2;

    const deliverySamples = orders
      .map((order) => {
        const completedEvent = order.statusEvents.find((event) => event.status === OrderStatus.completed);
        if (!completedEvent) return null;
        const minutes = Math.max(
          0,
          Math.round((completedEvent.createdAt.getTime() - order.createdAt.getTime()) / 60000)
        );
        return {
          orderId: order.id,
          date: order.createdAt.toISOString().slice(0, 10),
          minutes,
          metSla: minutes <= deliveryTargetMinutes
        };
      })
      .filter((sample): sample is NonNullable<typeof sample> => sample !== null);

    const matchSamples = buddyRequests
      .map((request) => {
        const firstAssignment = request.assignments[0];
        if (!firstAssignment) return null;
        const minutes = Math.max(
          0,
          Math.round((firstAssignment.createdAt.getTime() - request.createdAt.getTime()) / 60000)
        );
        return {
          requestId: request.id,
          date: request.createdAt.toISOString().slice(0, 10),
          minutes,
          metSla: minutes <= matchTargetMinutes
        };
      })
      .filter((sample): sample is NonNullable<typeof sample> => sample !== null);

    const completedOrders = orders.filter((order) => order.status === OrderStatus.completed).length;
    const cancelledOrders = orders.filter((order) => order.status === OrderStatus.cancelled).length;
    const orderSuccessRate = orders.length === 0 ? 1 : completedOrders / orders.length;
    const refundRate = orders.length === 0 ? 0 : refundRequests.length / orders.length;
    const avgDeliveryMinutes =
      deliverySamples.length === 0
        ? null
        : Math.round(sum(deliverySamples.map((sample) => sample.minutes)) / deliverySamples.length);
    const avgMatchMinutes =
      matchSamples.length === 0
        ? null
        : Math.round(sum(matchSamples.map((sample) => sample.minutes)) / matchSamples.length);

    const deliverySlaRate =
      deliverySamples.length === 0
        ? 1
        : deliverySamples.filter((sample) => sample.metSla).length / deliverySamples.length;
    const matchSlaRate =
      matchSamples.length === 0
        ? 1
        : matchSamples.filter((sample) => sample.metSla).length / matchSamples.length;

    const orderTrendMap = new Map<
      string,
      {
        date: string;
        totalOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        refunds: number;
        deliverySlaMet: number;
        deliverySamples: number;
      }
    >();

    orders.forEach((order) => {
      const key = order.createdAt.toISOString().slice(0, 10);
      const bucket =
        orderTrendMap.get(key) ??
        {
          date: key,
          totalOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
          refunds: 0,
          deliverySlaMet: 0,
          deliverySamples: 0
        };
      bucket.totalOrders += 1;
      if (order.status === OrderStatus.completed) bucket.completedOrders += 1;
      if (order.status === OrderStatus.cancelled) bucket.cancelledOrders += 1;
      const deliverySample = deliverySamples.find((sample) => sample.orderId === order.id);
      if (deliverySample) {
        bucket.deliverySamples += 1;
        if (deliverySample.metSla) bucket.deliverySlaMet += 1;
      }
      orderTrendMap.set(key, bucket);
    });

    refundRequests.forEach((refund) => {
      const key = refund.createdAt.toISOString().slice(0, 10);
      const bucket =
        orderTrendMap.get(key) ??
        {
          date: key,
          totalOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
          refunds: 0,
          deliverySlaMet: 0,
          deliverySamples: 0
        };
      bucket.refunds += 1;
      orderTrendMap.set(key, bucket);
    });

    const delayedOrders = deliverySamples
      .filter((sample) => !sample.metSla)
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 8)
      .map((sample) => ({
        orderId: sample.orderId,
        deliveryMinutes: sample.minutes,
        overByMinutes: sample.minutes - deliveryTargetMinutes
      }));

    const refundMix = [
      {
        label: "Requested",
        count: refundRequests.filter((refund) => refund.status === RefundStatus.requested).length
      },
      {
        label: "In review",
        count: refundRequests.filter((refund) => refund.status === RefundStatus.in_review).length
      },
      {
        label: "Approved",
        count: refundRequests.filter((refund) => refund.status === RefundStatus.approved).length
      },
      {
        label: "Paid",
        count: refundRequests.filter((refund) => refund.status === RefundStatus.paid).length
      }
    ];

    const buddyPoolSla = {
      totalRequests: buddyRequests.length,
      matchedRequests: matchSamples.length,
      openRequests: buddyRequests.filter((request) => request.status === BuddyRequestStatus.open).length,
      avgMatchMinutes,
      targetMinutes: matchTargetMinutes,
      metRate: matchSlaRate
    };

    return {
      windowDays,
      summary: {
        totalOrders: orders.length,
        completedOrders,
        cancelledOrders,
        orderSuccessRate,
        avgDeliveryMinutes,
        refundRate
      },
      sla: {
        deliveryTargetMinutes,
        matchTargetMinutes,
        deliveryMetRate: deliverySlaRate,
        deliveryEligibleCount: deliverySamples.length,
        deliveryMetCount: deliverySamples.filter((sample) => sample.metSla).length,
        avgDeliveryMinutes,
        matchMetRate: matchSlaRate,
        matchEligibleCount: matchSamples.length,
        matchMetCount: matchSamples.filter((sample) => sample.metSla).length,
        avgMatchMinutes
      },
      orderTrend: Array.from(orderTrendMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
      delayedOrders,
      refundMix,
      buddyPoolSla
    };
  }
}
