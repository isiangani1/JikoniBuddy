import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
  notifyHelper(helperId: string, message: string) {
    // Stub: integrate FCM/SMS later
    return { helperId, message, channel: "stub" };
  }

  notifySeller(sellerId: string, message: string) {
    return { sellerId, message, channel: "stub" };
  }
}
