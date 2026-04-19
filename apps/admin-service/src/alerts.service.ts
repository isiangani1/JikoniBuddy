import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

const defaultRules = [
  {
    name: "Delivery delay threshold",
    description: "Alert when delivery delay exceeds threshold.",
    metric: "delivery_delay_minutes",
    comparison: ">",
    threshold: 10,
    severity: "critical"
  },
  {
    name: "Seller cancellation spike",
    description: "Alert when seller cancellation rate spikes.",
    metric: "seller_cancel_rate",
    comparison: ">",
    threshold: 0.12,
    severity: "medium"
  },
  {
    name: "Buddy not moving",
    description: "Alert when buddy idle time exceeds threshold.",
    metric: "buddy_idle_minutes",
    comparison: ">",
    threshold: 5,
    severity: "medium"
  }
];

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureDefaults() {
    const count = await this.prisma.adminAlertRule.count();
    if (count > 0) return;
    await this.prisma.adminAlertRule.createMany({
      data: defaultRules.map((rule) => ({
        ...rule,
        enabled: true
      }))
    });
  }

  async listRules() {
    await this.ensureDefaults();
    return this.prisma.adminAlertRule.findMany({ orderBy: { createdAt: "asc" } });
  }

  async updateRule(id: string, payload: Partial<{ threshold: number; enabled: boolean; severity: string }>) {
    return this.prisma.adminAlertRule.update({
      where: { id },
      data: {
        threshold: payload.threshold ?? undefined,
        enabled: payload.enabled ?? undefined,
        severity: payload.severity ?? undefined
      }
    });
  }

  async listEvents(filters: { status?: string; severity?: string[] }) {
    return this.prisma.adminAlertEvent.findMany({
      where: {
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.severity ? { severity: { in: filters.severity } } : {})
      },
      orderBy: { createdAt: "desc" },
      take: 200
    });
  }

  async createEvent(payload: {
    ruleId?: string;
    title: string;
    message: string;
    severity?: string;
    source?: string;
  }) {
    return this.prisma.adminAlertEvent.create({
      data: {
        ruleId: payload.ruleId ?? null,
        title: payload.title,
        message: payload.message,
        severity: payload.severity ?? "medium",
        source: payload.source ?? null,
        status: "open"
      }
    });
  }

  async acknowledge(id: string) {
    return this.prisma.adminAlertEvent.update({
      where: { id },
      data: { status: "acknowledged" }
    });
  }
}
