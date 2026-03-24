import { Controller, Get, Post, Put, Body, Param, Query } from "@nestjs/common";
import { MenuService } from "./menu.service";

@Controller("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getSellerMenu(@Query("sellerId") sellerId: string) {
    // In a prod system, sellerId is extracted from JWT
    return this.menuService.getMenu(sellerId);
  }

  @Post()
  createMenuProduct(
    @Query("sellerId") sellerId: string,
    @Body() payload: any
  ) {
    return this.menuService.createProduct(sellerId, payload);
  }

  @Put("bulk")
  bulkUpdateMenuStatus(
    @Query("sellerId") sellerId: string,
    @Body() payload: { productIds: string[]; isActive: boolean }
  ) {
    return this.menuService.bulkUpdate(sellerId, payload.productIds, payload.isActive);
  }
}
