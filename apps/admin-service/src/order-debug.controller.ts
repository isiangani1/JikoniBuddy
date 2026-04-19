import { Controller, Get, Param, Query } from "@nestjs/common";
import { OrderDebugService } from "./order-debug.service";

@Controller("orders")
export class OrderDebugController {
  constructor(private readonly orders: OrderDebugService) {}

  @Get()
  async listOrders(
    @Query("status") status?: string,
    @Query("search") search?: string,
    @Query("limit") limit?: string
  ) {
    return this.orders.listOrders({
      status,
      search,
      limit: limit ? Number(limit) : undefined
    });
  }

  @Get(":id")
  async getOrderDebug(@Param("id") id: string) {
    return this.orders.getOrderDebug(id);
  }
}
