import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  namespace: "/ws/seller",
  cors: { origin: "*" }
})
export class SellerRealtimeGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage("seller:join")
  handleJoin(client: Socket, @MessageBody() payload: { sellerId: string }) {
    if (!payload?.sellerId) return;
    client.join(`seller:${payload.sellerId}`);
  }

  emitOrderUpdate(sellerId: string, order: any) {
    this.server.to(`seller:${sellerId}`).emit("order.updated", order);
  }

  emitBuddyAssigned(sellerId: string, payload: any) {
    this.server.to(`seller:${sellerId}`).emit("buddy.assigned", payload);
  }
}
