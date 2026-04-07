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

  @EventPattern("order.created")
  async handleOrderCreated(@Payload() _data: { orderId: string }) {
    // No-op handler to prevent unhandled event warnings.
    return;
  }

  @EventPattern("payment.initiated")
  async handlePaymentInitiated(@Payload() _data: { orderId?: string; paymentId?: string }) {
    // No-op handler to prevent unhandled event warnings.
    return;
  }

  @EventPattern("order.status_updated")
  async handleOrderStatusUpdated(
    @Payload()
    data: {
      orderId: string;
      status: string;
      buyerId?: string;
      sellerId?: string;
    }
  ) {
    if (!data?.buyerId || !data?.orderId || !data?.status) return;
    await this.notifications.createNotification({
      userId: data.buyerId,
      title: "Order update",
      message: `Order ${data.orderId} is now ${data.status.replace(/_/g, " ")}.`,
      type: "system",
      data
    });
  }

  @EventPattern("refund.requested")
  async handleRefundRequested(
    @Payload()
    data: {
      refundId: string;
      orderId: string;
      userId: string;
      status: string;
    }
  ) {
    if (!data?.userId) return;
    await this.notifications.createNotification({
      userId: data.userId,
      title: "Refund requested",
      message: `We received your refund request for order ${data.orderId}.`,
      type: "system",
      data
    });
  }

  @EventPattern("refund.approved")
  async handleRefundApproved(
    @Payload()
    data: {
      refundId: string;
      orderId: string;
      userId: string;
      status: string;
    }
  ) {
    if (!data?.userId) return;
    await this.notifications.createNotification({
      userId: data.userId,
      title: "Refund approved",
      message: `Your refund for order ${data.orderId} has been approved.`,
      type: "payment",
      data
    });
  }

  @EventPattern("refund.denied")
  async handleRefundDenied(
    @Payload()
    data: {
      refundId: string;
      orderId: string;
      userId: string;
      status: string;
    }
  ) {
    if (!data?.userId) return;
    await this.notifications.createNotification({
      userId: data.userId,
      title: "Refund denied",
      message: `Your refund for order ${data.orderId} was denied.`,
      type: "system",
      data
    });
  }

  @EventPattern("refund.paid")
  async handleRefundPaid(
    @Payload()
    data: {
      refundId: string;
      orderId: string;
      userId: string;
      status: string;
    }
  ) {
    if (!data?.userId) return;
    await this.notifications.createNotification({
      userId: data.userId,
      title: "Refund paid",
      message: `Refund for order ${data.orderId} has been paid out.`,
      type: "payment",
      data
    });
  }

  @EventPattern("notification.send")
  async handleGenericNotification(
    @Payload()
    data: {
      userId: string;
      title: string;
      message: string;
      type?: string;
      meta?: Record<string, unknown>;
    }
  ) {
    if (!data?.userId) return;
    await this.notifications.createNotification({
      userId: data.userId,
      title: data.title ?? "Notification",
      message: data.message ?? "",
      type: (data.type as any) ?? "system",
      data: data.meta ?? {}
    });
  }
}
