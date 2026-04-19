import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AuditService } from "./audit.service";

@Controller("audit")
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  list(
    @Query("actorId") actorId?: string,
    @Query("action") action?: string,
    @Query("targetType") targetType?: string,
    @Query("severity") severity?: string,
    @Query("page") page: string = "1",
    @Query("pageSize") pageSize: string = "50"
  ) {
    const resolvedPage = Math.max(1, Number(page) || 1);
    const resolvedSize = Math.min(200, Math.max(1, Number(pageSize) || 50));
    return this.audit.list({ actorId, action, targetType, severity }, resolvedPage, resolvedSize);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.audit.get(id);
  }

  @Post()
  create(
    @Body()
    payload: {
      actorId: string;
      actorRole?: string;
      action: string;
      targetType?: string;
      targetId?: string;
      severity?: string;
      meta?: Record<string, unknown>;
    }
  ) {
    return this.audit.create(payload);
  }
}
