import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

type RiskFactorSummary = {
  cancellations: number;
  gpsAnomalies: number;
  paymentAnomalies: number;
  reasons: string[];
};

@Injectable()
export class RiskService {
  constructor(private readonly prisma: PrismaService) {}

  private getSeverity(score: number) {
    if (score >= 70) return "high";
    if (score >= 40) return "medium";
    return "low";
  }

  private async computeRiskFactors(userId: string) {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [cancelledJobs, cancelledBuyerOrders, failedPayments, refundedPayments, points] =
      await Promise.all([
        this.prisma.job.count({
          where: { buddyId: userId, status: "cancelled", createdAt: { gte: cutoff } }
        }),
        this.prisma.order.count({
          where: { buyerId: userId, status: "cancelled", createdAt: { gte: cutoff } }
        }),
        this.prisma.payment.count({
          where: {
            userId,
            status: "failed",
            createdAt: { gte: cutoff }
          }
        }),
        this.prisma.payment.count({
          where: {
            userId,
            status: "refunded",
            createdAt: { gte: cutoff }
          }
        }),
        this.prisma.trackingPoint.findMany({
          where: { buddyId: userId, recordedAt: { gte: cutoff } },
          orderBy: { recordedAt: "asc" },
          take: 300
        })
      ]);

    let gpsAnomalies = 0;
    for (let index = 1; index < points.length; index += 1) {
      const current = points[index];
      const previous = points[index - 1];
      const minutes =
        (current.recordedAt.getTime() - previous.recordedAt.getTime()) / 60000;
      if (minutes <= 0) continue;

      const distanceKm = this.haversineDistance(
        previous.lat,
        previous.lng,
        current.lat,
        current.lng
      );
      const speedKmH = distanceKm / (minutes / 60);

      if (speedKmH > 120 || (current.accuracy ?? 0) > 500) {
        gpsAnomalies += 1;
      }
    }

    const cancellations = cancelledJobs + cancelledBuyerOrders;
    const paymentAnomalies = failedPayments + refundedPayments;
    const reasons: string[] = [];

    if (cancellations >= 3) {
      reasons.push(`High cancellation volume in the last 30 days (${cancellations}).`);
    }
    if (gpsAnomalies > 0) {
      reasons.push(`GPS anomalies detected across route traces (${gpsAnomalies}).`);
    }
    if (paymentAnomalies >= 2) {
      reasons.push(`Payment anomalies detected (${paymentAnomalies}).`);
    }

    return {
      cancellations,
      gpsAnomalies,
      paymentAnomalies,
      reasons
    } satisfies RiskFactorSummary;
  }

  private buildRiskScore(factors: RiskFactorSummary) {
    return Math.min(
      100,
      factors.cancellations * 12 + factors.gpsAnomalies * 18 + factors.paymentAnomalies * 15
    );
  }

  private async persistSnapshot(userId: string, factors: RiskFactorSummary, score: number) {
    const latest = await this.prisma.adminRiskSnapshot.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    const severity = this.getSeverity(score);
    const shouldWrite =
      !latest ||
      latest.score !== score ||
      latest.cancellationCount !== factors.cancellations ||
      latest.gpsAnomalyCount !== factors.gpsAnomalies ||
      latest.paymentAnomalyCount !== factors.paymentAnomalies;

    if (!shouldWrite) {
      return latest;
    }

    return this.prisma.adminRiskSnapshot.create({
      data: {
        userId,
        score,
        severity,
        cancellationCount: factors.cancellations,
        gpsAnomalyCount: factors.gpsAnomalies,
        paymentAnomalyCount: factors.paymentAnomalies,
        reasons: factors.reasons
      }
    });
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const radius = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return radius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  async listUsers(filters: {
    role?: string;
    severity?: string;
    minScore?: number;
    limit?: number;
  }) {
    const take = Math.min(Math.max(filters.limit ?? 25, 1), 100);
    const users = await this.prisma.user.findMany({
      where: {
        ...(filters.role ? { role: filters.role as never } : { role: { not: "admin" } })
      },
      select: {
        id: true,
        role: true,
        name: true,
        displayName: true,
        email: true,
        phone: true
      },
      take
    });

    const assessments = await Promise.all(
      users.map(async (user) => {
        const factors = await this.computeRiskFactors(user.id);
        const score = this.buildRiskScore(factors);
        await this.persistSnapshot(user.id, factors, score);
        return {
          user,
          score,
          severity: this.getSeverity(score),
          factors
        };
      })
    );

    return assessments
      .filter((assessment) =>
        filters.severity ? assessment.severity === filters.severity : true
      )
      .filter((assessment) =>
        filters.minScore !== undefined ? assessment.score >= filters.minScore : true
      )
      .sort((a, b) => b.score - a.score);
  }

  async getUserRisk(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        name: true,
        displayName: true,
        email: true,
        phone: true
      }
    });

    if (!user) {
      return null;
    }

    const factors = await this.computeRiskFactors(user.id);
    const score = this.buildRiskScore(factors);
    await this.persistSnapshot(user.id, factors, score);

    const history = await this.prisma.adminRiskSnapshot.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      take: 20
    });

    return {
      user,
      score,
      severity: this.getSeverity(score),
      factors,
      history
    };
  }
}
