import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./prisma.service";
import { NotificationGateway } from "./notification.gateway";

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationGateway
  ) {}

  async createNotification(params: {
    userId: string;
    title: string;
    message: string;
    type: "payment" | "system";
    data?: Record<string, unknown>;
  }) {
    const record = await this.prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        message: params.message,
        type: params.type,
        status: "unread",
        data: (params.data ?? {}) as Prisma.InputJsonValue
      }
    });
    this.gateway.emitToUser(params.userId, {
      id: record.id,
      title: record.title,
      message: record.message,
      type: record.type,
      createdAt: record.createdAt,
      data: record.data
    });
    return record;
  }
}
