import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class PayoutPublisher {
  private readonly logger = new Logger(PayoutPublisher.name);

  constructor(@Inject("MESSAGE_BROKER") private readonly broker: ClientProxy) {}

  emitCompleted(payload: Record<string, unknown>) {
    try {
      this.broker.emit("payout.completed", payload);
    } catch (error) {
      this.logger.warn(`Failed to emit payout.completed: ${String(error)}`);
    }
  }

  emitFailed(payload: Record<string, unknown>) {
    try {
      this.broker.emit("payout.failed", payload);
    } catch (error) {
      this.logger.warn(`Failed to emit payout.failed: ${String(error)}`);
    }
  }
}
