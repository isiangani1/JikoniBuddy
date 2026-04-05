import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: { origin: "*", credentials: true }
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string | undefined;
    if (userId) {
      client.join(userId);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string | undefined;
    if (userId) {
      client.leave(userId);
    }
  }

  emitToUser(userId: string, payload: Record<string, unknown>) {
    this.server.to(userId).emit("notification", payload);
  }
}
