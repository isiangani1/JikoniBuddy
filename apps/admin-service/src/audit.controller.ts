import { Body, Controller, Get, Header, Param, Post, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { AuditService } from "./audit.service";
import { assertInternalApiKey } from "./internal-api-auth";

@Controller("audit")
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  list(
    @Req() req: Request,
    @Query("actorId") actorId?: string,
    @Query("actorRole") actorRole?: string,
    @Query("action") action?: string,
    @Query("targetType") targetType?: string,
    @Query("targetId") targetId?: string,
    @Query("severity") severity?: string,
    @Query("q") q?: string,
    @Query("dateFrom") dateFrom?: string,
    @Query("dateTo") dateTo?: string,
    @Query("page") page: string = "1",
    @Query("pageSize") pageSize: string = "50"
  ) {
    assertInternalApiKey(req);
    const resolvedPage = Math.max(1, Number(page) || 1);
    const resolvedSize = Math.min(200, Math.max(1, Number(pageSize) || 50));
    return this.audit.list(
      { actorId, actorRole, action, targetType, targetId, severity, q, dateFrom, dateTo },
      resolvedPage,
      resolvedSize
    );
  }

  @Get("export")
  @Header("Content-Type", "text/csv")
  export(
    @Req() req: Request,
    @Query("actorId") actorId?: string,
    @Query("actorRole") actorRole?: string,
    @Query("action") action?: string,
    @Query("targetType") targetType?: string,
    @Query("targetId") targetId?: string,
    @Query("severity") severity?: string,
    @Query("q") q?: string,
    @Query("dateFrom") dateFrom?: string,
    @Query("dateTo") dateTo?: string
  ) {
    assertInternalApiKey(req);
    return this.audit.exportCsv({
      actorId,
      actorRole,
      action,
      targetType,
      targetId,
      severity,
      q,
      dateFrom,
      dateTo
    });
  }

  @Get(":id")
  get(@Req() req: Request, @Param("id") id: string) {
    assertInternalApiKey(req);
    return this.audit.get(id);
  }

  @Post()
  create(
    @Req() req: Request,
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
    assertInternalApiKey(req);
    return this.audit.create(payload);
  }
}
