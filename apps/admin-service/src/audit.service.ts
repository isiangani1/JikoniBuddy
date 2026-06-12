import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./prisma.service";

export type AuditFilters = {
  actorId?: string;
  actorRole?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  severity?: string;
  q?: string;
  dateFrom?: string;
  dateTo?: string;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    filters: AuditFilters,
    page: number,
    pageSize: number
  ) {
    const where = this.buildWhere(filters);

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

  async exportCsv(filters: AuditFilters) {
    const rows = await this.prisma.adminAuditLog.findMany({
      where: this.buildWhere(filters),
      orderBy: { createdAt: "desc" },
      take: 1000
    });

    const header = [
      "id",
      "createdAt",
      "actorId",
      "actorRole",
      "action",
      "targetType",
      "targetId",
      "severity",
      "metadata"
    ];

    const body = rows.map((row) =>
      [
        row.id,
        row.createdAt.toISOString(),
        row.actorId,
        row.actorRole ?? "",
        row.action,
        row.targetType ?? "",
        row.targetId ?? "",
        row.severity,
        JSON.stringify(row.metadata ?? {})
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    );

    return [header.join(","), ...body].join("\n");
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

  private buildWhere(filters: AuditFilters): Prisma.AdminAuditLogWhereInput {
    const q = filters.q?.trim();

    return {
      ...(filters.actorId ? { actorId: filters.actorId } : {}),
      ...(filters.actorRole ? { actorRole: filters.actorRole } : {}),
      ...(filters.action ? { action: filters.action } : {}),
      ...(filters.targetType ? { targetType: filters.targetType } : {}),
      ...(filters.targetId ? { targetId: filters.targetId } : {}),
      ...(filters.severity ? { severity: filters.severity } : {}),
      ...(filters.dateFrom || filters.dateTo
        ? {
            createdAt: {
              ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
              ...(filters.dateTo ? { lte: new Date(filters.dateTo) } : {})
            }
          }
        : {}),
      ...(q
        ? {
            OR: [
              { actorId: { contains: q, mode: "insensitive" } },
              { actorRole: { contains: q, mode: "insensitive" } },
              { action: { contains: q, mode: "insensitive" } },
              { targetType: { contains: q, mode: "insensitive" } },
              { targetId: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    };
  }
}
