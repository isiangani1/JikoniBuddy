import { Controller, Get, Param, Query } from "@nestjs/common";
import { RiskService } from "./risk.service";

@Controller("risk")
export class RiskController {
  constructor(private readonly risk: RiskService) {}

  @Get("users")
  async listUsers(
    @Query("role") role?: string,
    @Query("severity") severity?: string,
    @Query("minScore") minScore?: string,
    @Query("limit") limit?: string
  ) {
    return this.risk.listUsers({
      role,
      severity,
      minScore: minScore ? Number(minScore) : undefined,
      limit: limit ? Number(limit) : undefined
    });
  }

  @Get("users/:id")
  async getUserRisk(@Param("id") id: string) {
    return this.risk.getUserRisk(id);
  }
}
