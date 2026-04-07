import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

export type ChatMessageDTO = {
  id: string;
  orderId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: Date;
};

export type ChatReadState = {
  lastReadAt: Date | null;
  unreadCount: number;
};

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async listMessages(orderId: string, limit = 50, cursor?: string, userId?: string) {
    const take = Math.min(Math.max(limit, 1), 100);
    const messages = await this.prisma.message.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
      take,
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1
          }
        : {})
    });

    const nextCursor = messages.length === take ? messages[messages.length - 1]?.id : null;

    const readState: ChatReadState = userId
      ? await this.getReadState(orderId, userId)
      : { lastReadAt: null, unreadCount: 0 };

    return { messages, nextCursor, ...readState };
  }

  async sendMessage(input: {
    orderId: string;
    senderId: string;
    receiverId?: string;
    text: string;
  }) {
    const order = await this.prisma.order.findUnique({
      where: { id: input.orderId }
    });
    if (!order) throw new BadRequestException("Order not found");

    const participants = [order.buyerId, order.sellerId, order.assignedBuddyId].filter(Boolean) as string[];
    if (!participants.includes(input.senderId)) {
      throw new BadRequestException("Sender is not part of this order");
    }

    const receiverId = input.receiverId ?? participants.find((id) => id !== input.senderId);
    if (!receiverId) {
      throw new BadRequestException("Receiver is required");
    }

    const message = await this.prisma.message.create({
      data: {
        orderId: input.orderId,
        senderId: input.senderId,
        receiverId,
        text: input.text
      }
    });

    return message as ChatMessageDTO;
  }

  async markRead(orderId: string, userId: string, readAt?: Date) {
    const timestamp = readAt ?? new Date();
    const receipt = await this.prisma.chatReadReceipt.upsert({
      where: { orderId_userId: { orderId, userId } },
      update: { lastReadAt: timestamp },
      create: { orderId, userId, lastReadAt: timestamp }
    });
    return receipt;
  }

  private async getReadState(orderId: string, userId: string): Promise<ChatReadState> {
    const receipt = await this.prisma.chatReadReceipt.findUnique({
      where: { orderId_userId: { orderId, userId } }
    });
    const lastReadAt = receipt?.lastReadAt ?? null;
    const unreadCount = await this.prisma.message.count({
      where: {
        orderId,
        receiverId: userId,
        ...(lastReadAt ? { createdAt: { gt: lastReadAt } } : {})
      }
    });
    return { lastReadAt, unreadCount };
  }
}
