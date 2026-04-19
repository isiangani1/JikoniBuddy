import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AutomationService } from "./automation.service";

@Controller("automation")
export class AutomationController {
  constructor(private readonly automation: AutomationService) {}

  @Get("rules")
  listRules() {
    return this.automation.listRules();
  }

  @Patch("rules/:id")
  updateRule(
    @Param("id") id: string,
    @Body()
    payload: {
      enabled?: boolean;
      approvalRequired?: boolean;
      threshold?: number | null;
    }
  ) {
    return this.automation.updateRule(id, payload);
  }

  @Get("executions")
  listExecutions(@Query("status") status?: string) {
    return this.automation.listExecutions(status);
  }

  @Post("simulate")
  simulate(
    @Body()
    payload: {
      triggerType: string;
      referenceId?: string;
      severity?: string;
      reason?: string;
      payload?: Record<string, unknown>;
    }
  ) {
    return this.automation.simulate(payload);
  }

  @Post("executions/:id/approve")
  approve(
    @Param("id") id: string,
    @Body() body: { actorId: string }
  ) {
    return this.automation.approveExecution(id, body.actorId);
  }

  @Post("executions/:id/cancel")
  cancel(
    @Param("id") id: string,
    @Body() body: { actorId: string; note?: string }
  ) {
    return this.automation.cancelExecution(id, body.actorId, body.note);
  }
}
