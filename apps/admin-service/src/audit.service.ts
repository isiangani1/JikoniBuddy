import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./prisma.service";

export type AuditFilters = {
  actorId?: string;
  action?: string;
  targetType?: string;
  severity?: string;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    filters: AuditFilters,
    page: number,
    pageSize: number
  ) {
    const where = {
      ...(filters.actorId ? { actorId: filters.actorId } : {}),
      ...(filters.action ? { action: filters.action } : {}),
      ...(filters.targetType ? { targetType: filters.targetType } : {}),
      ...(filters.severity ? { severity: filters.severity } : {})
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.adminAuditLog.count({ where }),
      this.prisma.adminAuditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    ]);

    return { page, pageSize, total, items };
  }

  async create(payload: {
    actorId: string;
    actorRole?: string;
    action: string;
    targetType?: string;
    targetId?: string;
    severity?: string;
    meta?: Record<string, unknown>;
  }) {
    return this.prisma.adminAuditLog.create({
      data: {
        actorId: payload.actorId,
        actorRole: payload.actorRole ?? null,
        action: payload.action,
        targetType: payload.targetType ?? null,
        targetId: payload.targetId ?? null,
        severity: payload.severity ?? "low",
        metadata: (payload.meta ?? {}) as Prisma.InputJsonValue
      }
    });
  }

  async get(id: string) {
    return this.prisma.adminAuditLog.findUnique({ where: { id } });
  }
}
