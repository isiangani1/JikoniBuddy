import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class RefundPublisher {
  constructor(@Inject("MESSAGE_BROKER") private readonly broker: ClientProxy) {}

  emit(event: string, payload: Record<string, unknown>) {
    this.broker.emit(event, payload);
  }
}
