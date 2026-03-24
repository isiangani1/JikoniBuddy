import { Controller, Get, Query } from "@nestjs/common";
import { BuyerService } from "./buyer.service";

@Controller("buyer")
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Get("health")
  health() {
    return {
      status: "ok",
      service: "buyer-service",
      timestamp: new Date().toISOString()
    };
  }

  @Get("summary")
  summary() {
    return {
      activeSessions: 0,
      curatedSections: 0
    };
  }

  @Get("categories/header")
  async headerCategories() {
    return this.buyerService.getHeaderCategories();
  }

  @Get("curated/home")
  async curatedHome() {
    return this.buyerService.getHomeSections();
  }

  @Get("search")
  async search(@Query("q") query?: string) {
    return this.buyerService.search(query ?? "");
  }
}
