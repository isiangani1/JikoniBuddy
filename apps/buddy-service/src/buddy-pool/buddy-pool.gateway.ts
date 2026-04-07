import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/buddy',
})
export class BuddyPoolGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  // Track connected buddies mapping userId -> socketId
  private connectedBuddies = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedBuddies.set(userId, client.id);
      console.log(`Buddy/Seller connected: ${userId} (${client.id})`);
    }
  }

  handleDisconnect(client: Socket) {
    let disconnectedUserId: string | null = null;
    this.connectedBuddies.forEach((socketId, userId) => {
      if (socketId === client.id) {
        disconnectedUserId = userId;
      }
    });

    if (disconnectedUserId) {
      this.connectedBuddies.delete(disconnectedUserId);
      console.log(`Buddy/Seller disconnected: ${disconnectedUserId}`);
    }
  }

  // Callable internally by services to broadcast job offers to matched buddies
  notifyHelpersOfJob(helperIds: string[], jobRequest: any) {
    helperIds.forEach((id) => {
      const socketId = this.connectedBuddies.get(id);
      if (socketId) {
        this.server.to(socketId).emit('buddy.job_offered', jobRequest);
      }
    });
  }

  // Callable internally to notify seller of new applicants
  notifySellerOfApplicant(sellerId: string, applicant: any) {
    const socketId = this.connectedBuddies.get(sellerId);
    if (socketId) {
      this.server.to(socketId).emit('seller.applicant_found', applicant);
    }
  }

  // Callable internally to confirm a job to a specific buddy
  notifyHelperOfConfirmation(helperId: string, jobData: any) {
    const socketId = this.connectedBuddies.get(helperId);
    if (socketId) {
      this.server.to(socketId).emit('buddy.job_confirmed', jobData);
    }
  }

  notifyBuddyJobStatus(helperId: string, jobData: any) {
    const socketId = this.connectedBuddies.get(helperId);
    if (socketId) {
      this.server.to(socketId).emit('buddy.job_status', jobData);
    }
  }

  notifySellerJobStatus(sellerId: string, jobData: any) {
    const socketId = this.connectedBuddies.get(sellerId);
    if (socketId) {
      this.server.to(socketId).emit('seller.job_status', jobData);
    }
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', data: 'ok' };
  }

  @SubscribeMessage('buddy.job_completed')
  handleJobCompleted(@MessageBody() payload: { requestId: string, helperId: string, sellerId: string, payAmount: number }) {
    console.log(`[Gateway] Job ${payload.requestId} completed by ${payload.helperId}. Pointing to seller ${payload.sellerId}.`);
    const sellerSocketId = this.connectedBuddies.get(payload.sellerId);
    if (sellerSocketId) {
      this.server.to(sellerSocketId).emit('seller.job_awaiting_approval', payload);
    }
    return { event: 'job_completed_ack', status: 'success' };
  }
}
