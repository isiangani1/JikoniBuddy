import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { NotificationService } from "./notification.service";

@Controller()
export class NotificationEventsController {
  constructor(private readonly notifications: NotificationService) {}

  @EventPattern("payout.completed")
  async handlePayoutCompleted(
    @Payload()
    data: {
      userId: string;
      amount: number;
      reference?: string;
      transactionId?: string;
    }
  ) {
    if (!data?.userId) return;
    await this.notifications.createNotification({
      userId: data.userId,
      title: "Payout completed",
      message: `Your payout of KES ${Number(data.amount ?? 0).toLocaleString()} has been completed.`,
      type: "payment",
      data
    });
  }

  @EventPattern("payout.failed")
  async handlePayoutFailed(
    @Payload()
    data: {
      userId: string;
      amount: number;
      reference?: string;
      transactionId?: string;
    }
  ) {
    if (!data?.userId) return;
    await this.notifications.createNotification({
      userId: data.userId,
      title: "Payout failed",
      message: `Your payout of KES ${Number(data.amount ?? 0).toLocaleString()} failed. We are retrying.`,
      type: "payment",
      data
    });

    const financeUsers = (process.env.FINANCE_ALERT_USER_IDS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    for (const adminId of financeUsers) {
      await this.notifications.createNotification({
        userId: adminId,
        title: "Payout failure alert",
        message: `Payout failed for user ${data.userId}. Reference: ${data.reference ?? "n/a"}.`,
        type: "system",
        data
      });
    }
  }
}
