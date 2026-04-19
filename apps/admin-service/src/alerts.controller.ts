import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AlertsService } from "./alerts.service";

@Controller("alerts")
export class AlertsController {
  constructor(private readonly alerts: AlertsService) {}

  @Get("rules")
  listRules() {
    return this.alerts.listRules();
  }

  @Patch("rules/:id")
  updateRule(
    @Param("id") id: string,
    @Body() payload: { threshold?: number; enabled?: boolean; severity?: string }
  ) {
    return this.alerts.updateRule(id, payload);
  }

  @Get()
  listEvents(
    @Query("status") status?: string,
    @Query("severity") severity?: string
  ) {
    const severities = severity?.split(",").map((value) => value.trim()).filter(Boolean);
    return this.alerts.listEvents({ status, severity: severities?.length ? severities : undefined });
  }

  @Post()
  createEvent(
    @Body()
    payload: {
      ruleId?: string;
      title: string;
      message: string;
      severity?: string;
      source?: string;
    }
  ) {
    return this.alerts.createEvent(payload);
  }

  @Post(":id/ack")
  acknowledge(@Param("id") id: string) {
    return this.alerts.acknowledge(id);
  }
}
