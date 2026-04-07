import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";

@WebSocketGateway({
  namespace: "/ws/chat",
  cors: { origin: "*" }
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage("chat:join")
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() payload: { orderId: string }) {
    if (!payload?.orderId) return;
    client.join(`order:${payload.orderId}`);
  }

  @SubscribeMessage("chat:leave")
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() payload: { orderId: string }) {
    if (!payload?.orderId) return;
    client.leave(`order:${payload.orderId}`);
  }

  @SubscribeMessage("chat:message")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { orderId: string; senderId: string; receiverId?: string; text: string }
  ) {
    if (!payload?.orderId || !payload?.senderId || !payload?.text) return;
    const message = await this.chatService.sendMessage(payload);
    this.server.to(`order:${payload.orderId}`).emit("chat:message", message);
    return message;
  }

  emitToOrder(orderId: string, payload: any) {
    this.server.to(`order:${orderId}`).emit("chat:message", payload);
  }
}
