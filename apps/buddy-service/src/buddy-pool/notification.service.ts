import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class NotificationService {
  constructor(@Inject("MESSAGE_BROKER") private readonly broker: ClientProxy) {}

  notifyHelper(helperId: string, message: string) {
    const payload = {
      userId: helperId,
      title: "Buddy request",
      message,
      type: "system"
    };
    this.broker.emit("notification.send", payload);
    return payload;
  }

  notifySeller(sellerId: string, message: string) {
    const payload = {
      userId: sellerId,
      title: "Buddy update",
      message,
      type: "system"
    };
    this.broker.emit("notification.send", payload);
    return payload;
  }
}
