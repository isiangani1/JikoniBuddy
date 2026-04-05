import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { LocationStore } from "./location.store";

@WebSocketGateway({ cors: { origin: "*" } })
export class LocationGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly store: LocationStore) {}

  @SubscribeMessage("tracking:join")
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { orderId: string }
  ) {
    if (!body?.orderId) return;
    client.join(`order:${body.orderId}`);
    const last = await this.store.getLocation(body.orderId);
    if (last) {
      client.emit("tracking:update", last);
    }
  }

  @SubscribeMessage("tracking:leave")
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { orderId: string }
  ) {
    if (!body?.orderId) return;
    client.leave(`order:${body.orderId}`);
  }

  @SubscribeMessage("tracking:update")
  async handleUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: { orderId: string; buddyId?: string; lat: number; lng: number; accuracy?: number; timestamp?: string }
  ) {
    if (!body?.orderId) return;
    const payload = {
      orderId: body.orderId,
      buddyId: body.buddyId,
      lat: body.lat,
      lng: body.lng,
      accuracy: body.accuracy,
      timestamp: body.timestamp ?? new Date().toISOString()
    };
    await this.store.setLocation(payload);
    this.server.to(`order:${body.orderId}`).emit("tracking:update", payload);
  }
}
