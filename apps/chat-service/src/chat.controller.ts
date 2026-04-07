import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Controller("chat")
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly gateway: ChatGateway,
    @Inject("MESSAGE_BROKER") private readonly broker: ClientProxy
  ) {}

  @Get("orders/:orderId/messages")
  async listMessages(
    @Param("orderId") orderId: string,
    @Query("limit") limit?: string,
    @Query("cursor") cursor?: string,
    @Query("userId") userId?: string
  ) {
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.chatService.listMessages(orderId, parsedLimit, cursor, userId);
  }

  @Post("orders/:orderId/messages")
  async sendMessage(
    @Param("orderId") orderId: string,
    @Body()
    body: { senderId: string; receiverId?: string; text: string }
  ) {
    const message = await this.chatService.sendMessage({
      orderId,
      senderId: body.senderId,
      receiverId: body.receiverId,
      text: body.text
    });

    this.gateway.emitToOrder(orderId, message);

    this.broker.emit("chat.message_sent", {
      orderId: message.orderId,
      senderId: message.senderId,
      receiverId: message.receiverId,
      text: message.text,
      createdAt: message.createdAt
    });

    return message;
  }

  @Post("orders/:orderId/read")
  async markRead(
    @Param("orderId") orderId: string,
    @Body() body: { userId: string }
  ) {
    const receipt = await this.chatService.markRead(orderId, body.userId);

    this.broker.emit("chat.message_read", {
      orderId,
      userId: body.userId,
      lastReadAt: receipt.lastReadAt
    });

    return { ok: true, lastReadAt: receipt.lastReadAt };
  }
}
