import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./prisma.service";

const defaultAutomationRules = [
  {
    name: "Reassign stalled order",
    description: "Reassign buddy when an order is stalled beyond the threshold.",
    triggerType: "order_stalled",
    actionType: "reassign_buddy",
    enabled: true,
    approvalRequired: false,
    threshold: 8
  },
  {
    name: "Trigger Buddy Pool for overloaded seller",
    description: "Open a Buddy Pool assist request when seller load spikes.",
    triggerType: "seller_overloaded",
    actionType: "trigger_buddy_pool",
    enabled: true,
    approvalRequired: false,
    threshold: 0.85
  },
  {
    name: "Freeze account on fraud signal",
    description: "Hold account access when fraud risk is critical.",
    triggerType: "fraud_detected",
    actionType: "freeze_account",
    enabled: true,
    approvalRequired: true,
    threshold: 80
  }
] as const;

type SimulatePayload = {
  triggerType: string;
  referenceId?: string;
  severity?: string;
  reason?: string;
  payload?: Record<string, unknown>;
};

@Injectable()
export class AutomationService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureDefaults() {
    const count = await this.prisma.adminAutomationRule.count();
    if (count > 0) return;

    await this.prisma.adminAutomationRule.createMany({
      data: defaultAutomationRules.map((rule) => ({ ...rule }))
    });
  }

  async listRules() {
    await this.ensureDefaults();
    return this.prisma.adminAutomationRule.findMany({
      orderBy: { createdAt: "asc" }
    });
  }

  async updateRule(
    id: string,
    payload: Partial<{
      enabled: boolean;
      approvalRequired: boolean;
      threshold: number | null;
    }>
  ) {
    return this.prisma.adminAutomationRule.update({
      where: { id },
      data: {
        enabled: payload.enabled ?? undefined,
        approvalRequired: payload.approvalRequired ?? undefined,
        threshold: payload.threshold ?? undefined
      }
    });
  }

  async listExecutions(status?: string) {
    return this.prisma.adminAutomationExecution.findMany({
      where: status ? { status } : undefined,
      include: {
        rule: true
      },
      orderBy: { createdAt: "desc" },
      take: 200
    });
  }

  async simulate(payload: SimulatePayload) {
    await this.ensureDefaults();
    const rule = await this.prisma.adminAutomationRule.findFirst({
      where: {
        triggerType: payload.triggerType,
        enabled: true
      },
      orderBy: { createdAt: "asc" }
    });

    const status = rule?.approvalRequired ? "pending_approval" : "executed";
    const execution = await this.prisma.adminAutomationExecution.create({
      data: {
        ruleId: rule?.id ?? null,
        triggerType: payload.triggerType,
        actionType: rule?.actionType ?? "manual_review",
        referenceId: payload.referenceId ?? null,
        status,
        severity: payload.severity ?? "medium",
        reason: payload.reason ?? null,
        payload: (payload.payload ?? {}) as Prisma.InputJsonValue,
        executedAt: status === "executed" ? new Date() : null
      },
      include: {
        rule: true
      }
    });

    if (status === "executed") {
      await this.prisma.adminAuditLog.create({
        data: {
          actorId: "system",
          actorRole: "automation",
          action: execution.actionType,
          targetType: execution.triggerType,
          targetId: execution.referenceId ?? null,
          severity: execution.severity,
          metadata: {
            executionId: execution.id,
            reason: execution.reason
          }
        }
      });
    }

    return execution;
  }

  async approveExecution(id: string, actorId: string) {
    const execution = await this.prisma.adminAutomationExecution.update({
      where: { id },
      data: {
        status: "executed",
        approvedBy: actorId,
        executedAt: new Date()
      },
      include: {
        rule: true
      }
    });

    await this.prisma.adminAuditLog.create({
      data: {
        actorId,
        actorRole: "admin",
        action: execution.actionType,
        targetType: execution.triggerType,
        targetId: execution.referenceId ?? null,
        severity: execution.severity,
        metadata: {
          executionId: execution.id,
          approvalWorkflow: true
        }
      }
    });

    return execution;
  }

  async cancelExecution(id: string, actorId: string, note?: string) {
    const execution = await this.prisma.adminAutomationExecution.update({
      where: { id },
      data: {
        status: "cancelled",
        approvedBy: actorId,
        reason: note ?? undefined
      },
      include: {
        rule: true
      }
    });

    await this.prisma.adminAuditLog.create({
      data: {
        actorId,
        actorRole: "admin",
        action: "override_automation",
        targetType: execution.triggerType,
        targetId: execution.referenceId ?? null,
        severity: execution.severity,
        metadata: {
          executionId: execution.id,
          note: note ?? null
        }
      }
    });

    return execution;
  }
}
