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
    const user = await this.prisma.user.findUnique({
      where: { id: params.userId }
    });
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
    await this.dispatchChannels({
      title: params.title,
      message: params.message,
      fcmToken: (params.data as any)?.fcmToken,
      phone: (params.data as any)?.phone ?? user?.phone ?? undefined
    });
    return record;
  }

  private async dispatchChannels(payload: {
    title: string;
    message: string;
    fcmToken?: string;
    phone?: string;
  }) {
    const hasFcm = Boolean(process.env.FCM_SERVER_KEY && payload.fcmToken);
    if (hasFcm) {
      console.log("[Notification] Push send requested", {
        to: payload.fcmToken,
        title: payload.title
      });
      return;
    }

    const hasSmsConfig =
      Boolean(process.env.AFRICAS_TALKING_API_KEY) &&
      Boolean(process.env.AFRICAS_TALKING_USERNAME) &&
      Boolean(payload.phone);

    if (hasSmsConfig) {
      console.log("[Notification] SMS fallback requested", {
        to: payload.phone,
        message: payload.message
      });
      return;
    }

    console.log("[Notification] No delivery channel configured for user.");
  }
}
