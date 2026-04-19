import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

function round(value: number, digits: number) {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
}

@Injectable()
export class BuddyPoolMetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(windowDays: number) {
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

    const requests = await this.prisma.buddyRequest.findMany({
      where: { createdAt: { gte: since } },
      include: { applications: { select: { createdAt: true } }, assignments: true }
    });

    const sellerIds = Array.from(new Set(requests.map((req) => req.sellerId)));
    const sellers = sellerIds.length
      ? await this.prisma.user.findMany({
          where: { id: { in: sellerIds } },
          select: {
            id: true,
            displayName: true,
            name: true,
            email: true,
            sellerProfile: {
              select: {
                businessName: true,
                maxOrdersPerHour: true
              }
            }
          }
        })
      : [];
    const sellersById = new Map(sellers.map((seller) => [seller.id, seller]));

    const totalRequests = requests.length;
    const byStatus: Record<string, number> = {};
    requests.forEach((req) => {
      byStatus[req.status] = (byStatus[req.status] ?? 0) + 1;
    });

    const fulfilled = requests.filter((req) => req.status === "completed").length;

    const matchTimesMinutes: number[] = [];
    requests.forEach((req) => {
      if (!req.assignments.length) return;
      const firstAssignmentAt = req.assignments
        .map((assignment) => assignment.createdAt)
        .sort((a, b) => a.getTime() - b.getTime())[0];
      const minutes = (firstAssignmentAt.getTime() - req.createdAt.getTime()) / 60000;
      if (Number.isFinite(minutes) && minutes >= 0) {
        matchTimesMinutes.push(minutes);
      }
    });

    const avgMatchTimeMinutes = matchTimesMinutes.length
      ? round(matchTimesMinutes.reduce((sum, value) => sum + value, 0) / matchTimesMinutes.length, 1)
      : null;

    const staleOpenThresholdMinutes = 30;
    const staleOpen = requests.filter((req) => {
      if (req.status !== "open") return false;
      const minutes = (Date.now() - req.createdAt.getTime()) / 60000;
      return minutes >= staleOpenThresholdMinutes;
    }).length;

    const failedMatches = requests.filter(
      (req) =>
        req.status === "open" &&
        req.applications.length > 0 &&
        req.assignments.length === 0
    ).length;

    const requestsBySeller = new Map<string, number>();
    requests.forEach((req) => {
      requestsBySeller.set(req.sellerId, (requestsBySeller.get(req.sellerId) ?? 0) + 1);
    });

    const sellerLoad = Array.from(requestsBySeller.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([sellerId, count]) => {
        const seller = sellersById.get(sellerId);
        const capacity = seller?.sellerProfile?.maxOrdersPerHour ?? null;
        const loadRatio = capacity && capacity > 0 ? round(count / capacity, 2) : null;

        return {
          sellerId,
          sellerName:
            seller?.sellerProfile?.businessName ??
            seller?.displayName ??
            seller?.name ??
            seller?.email ??
            sellerId,
          requestCount: count,
          maxOrdersPerHour: capacity,
          loadRatio,
          loadStatus:
            loadRatio === null
              ? "unknown"
              : loadRatio >= 1
                ? "overloaded"
                : loadRatio >= 0.75
                  ? "stressed"
                  : "healthy"
        };
      });

    const byZone = new Map<
      string,
      {
        total: number;
        open: number;
        completed: number;
        matched: number;
        staleOpen: number;
        failed: number;
        matchTimesMinutes: number[];
      }
    >();
    requests.forEach((req) => {
      const key = req.locationLabel;
      const current = byZone.get(key) ?? {
        total: 0,
        open: 0,
        completed: 0,
        matched: 0,
        staleOpen: 0,
        failed: 0,
        matchTimesMinutes: []
      };
      current.total += 1;
      if (req.status === "open") current.open += 1;
      if (req.status === "completed") current.completed += 1;
      if (req.assignments.length > 0) current.matched += 1;
      if (
        req.status === "open" &&
        (Date.now() - req.createdAt.getTime()) / 60000 >= staleOpenThresholdMinutes
      ) {
        current.staleOpen += 1;
      }
      if (
        req.status === "open" &&
        req.applications.length > 0 &&
        req.assignments.length === 0
      ) {
        current.failed += 1;
      }
      if (req.assignments.length > 0) {
        const firstAssignmentAt = req.assignments
          .map((assignment) => assignment.createdAt)
          .sort((a, b) => a.getTime() - b.getTime())[0];
        const minutes = (firstAssignmentAt.getTime() - req.createdAt.getTime()) / 60000;
        if (Number.isFinite(minutes) && minutes >= 0) {
          current.matchTimesMinutes.push(minutes);
        }
      }
      byZone.set(key, current);
    });

    const zoneCounts = Array.from(byZone.entries())
      .map(([zone, data]) => {
        const avgZoneMatchTimeMinutes = data.matchTimesMinutes.length
          ? round(
              data.matchTimesMinutes.reduce((sum, value) => sum + value, 0) /
                data.matchTimesMinutes.length,
              1
            )
          : null;
        const fulfillmentRate = data.total > 0 ? round(data.completed / data.total, 2) : 0;
        const supplyPressure = data.total > 0 ? round(data.open / data.total, 2) : 0;

        return {
          zone,
          total: data.total,
          open: data.open,
          completed: data.completed,
          matched: data.matched,
          staleOpen: data.staleOpen,
          failed: data.failed,
          avgMatchTimeMinutes: avgZoneMatchTimeMinutes,
          fulfillmentRate,
          supplyPressure,
          performanceLabel:
            fulfillmentRate >= 0.75 && supplyPressure < 0.3
              ? "healthy"
              : fulfillmentRate >= 0.5
                ? "stressed"
                : "critical"
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 12);

    const onlineHelpers = await this.prisma.helperProfile.count({
      where: { isOnline: true }
    });

    return {
      windowDays,
      totalRequests,
      fulfilled,
      byStatus,
      avgMatchTimeMinutes,
      staleOpen,
      failedMatches,
      onlineHelpers,
      sellerLoad,
      zoneCounts
    };
  }
}
