import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { BuddyPoolService } from "./buddy-pool.service";
import {
  ApplyBuddyRequestDto,
  CompleteAssignmentDto,
  ConfirmBuddyRequestDto,
  CreateBuddyRequestDto,
  CreatePayoutRequestDto,
  CreateRatingDto
} from "./dto";

@Controller("buddy")
export class BuddyPoolController {
  constructor(private readonly buddyService: BuddyPoolService) {}

  @Post("auto-match")
  autoMatchTopBuddy(@Body() dto: CreateBuddyRequestDto) {
    return this.buddyService.autoMatchTopBuddy(dto);
  }

  @Post("requests")
  createRequest(@Body() dto: CreateBuddyRequestDto) {
    return this.buddyService.createRequest(dto);
  }

  @Get("requests")
  listRequests(@Query("status") status?: string) {
    return this.buddyService.listRequests(status);
  }

  @Get("requests/:id")
  getRequest(@Param("id") id: string) {
    return this.buddyService.getRequest(id);
  }

  @Post("requests/:id/apply")
  applyToRequest(@Param("id") id: string, @Body() dto: ApplyBuddyRequestDto) {
    return this.buddyService.applyToRequest(id, dto);
  }

  @Post("requests/:id/reject")
  rejectRequest(@Param("id") id: string, @Body("helperId") helperId: string) {
    return this.buddyService.rejectRequest(id, helperId);
  }

  @Post("requests/:id/confirm")
  confirmHelper(
    @Param("id") id: string,
    @Body() dto: ConfirmBuddyRequestDto
  ) {
    return this.buddyService.confirmHelper(id, dto);
  }

  @Post("assignments/:id/complete")
  completeAssignment(
    @Param("id") id: string,
    @Body() dto: CompleteAssignmentDto
  ) {
    return this.buddyService.completeAssignment(id, dto);
  }

  @Post("jobs/:id/checkin")
  checkInJob(@Param("id") id: string, @Body("helperId") helperId?: string) {
    return this.buddyService.checkInJob(id, helperId);
  }

  @Post("jobs/:id/checkout")
  checkOutJob(@Param("id") id: string, @Body("helperId") helperId?: string) {
    return this.buddyService.checkOutJob(id, helperId);
  }

  @Post("jobs/:id/notes")
  addJobNote(
    @Param("id") id: string,
    @Body() body: { helperId: string; note: string }
  ) {
    return this.buddyService.addJobNote(id, body.helperId, body.note);
  }

  @Post("jobs/:id/disputes")
  raiseDispute(
    @Param("id") id: string,
    @Body() body: { helperId: string; note: string }
  ) {
    return this.buddyService.raiseDispute(id, body.helperId, body.note);
  }

  @Post("jobs/:id/complete")
  completeJob(
    @Param("id") id: string,
    @Body() body: { helperId: string; note?: string }
  ) {
    return this.buddyService.completeJob(id, body.helperId, body.note);
  }

  @Post("ratings")
  createRating(@Body() dto: CreateRatingDto) {
    return this.buddyService.createRating(dto);
  }

  @Get("users/:id")
  getUser(@Param("id") id: string) {
    return this.buddyService.getUser(id);
  }

  @Put("users/:id/status")
  updateUserStatus(@Param("id") id: string, @Body("isOnline") isOnline: boolean) {
    return this.buddyService.updateUserStatus(id, isOnline);
  }

  @Get("users/:id/earnings")
  getUserEarnings(@Param("id") id: string) {
    return this.buddyService.getUserEarnings(id);
  }

  @Get("users/:id/payments")
  getUserPayments(@Param("id") id: string) {
    return this.buddyService.getUserPayments(id);
  }

  @Get("users/:id/jobs")
  getUserJobs(@Param("id") id: string, @Query("status") status?: string) {
    return this.buddyService.getUserJobs(id, status);
  }

  @Get("users/:id/ratings")
  getUserRatings(@Param("id") id: string) {
    return this.buddyService.getUserRatings(id);
  }

  @Get("users/:id/notifications")
  getUserNotifications(@Param("id") id: string) {
    return this.buddyService.getUserNotifications(id);
  }

  @Get("users/:id/dashboard-metrics")
  getDashboardMetrics(@Param("id") id: string) {
    return this.buddyService.getDashboardMetrics(id);
  }

  @Get("users/:id/requests")
  getUserRequests(@Param("id") id: string) {
    return this.buddyService.getUserApplications(id);
  }

  @Get("users/:id/availability")
  getUserAvailability(@Param("id") id: string) {
    return this.buddyService.getUserAvailability(id);
  }

  @Put("users/:id/availability")
  setUserAvailability(
    @Param("id") id: string,
    @Body() body: { slots: { dayOfWeek: number; startTime: string; endTime: string }[] }
  ) {
    return this.buddyService.setUserAvailability(id, body.slots ?? []);
  }

  @Get("users/:id/performance")
  getPerformanceAnalytics(@Param("id") id: string) {
    return this.buddyService.getPerformanceAnalytics(id);
  }

  @Get("users/:id/idle-suggestions")
  getIdleSuggestions(@Param("id") _id: string) {
    return this.buddyService.getIdleSuggestions();
  }

  @Get("users/:id/fraud-signals")
  getFraudSignals(@Param("id") id: string) {
    return this.buddyService.getFraudSignals(id);
  }

  @Get("users/:id/auto-accept")
  getAutoAcceptRules(@Param("id") id: string) {
    return this.buddyService.getAutoAcceptRules(id);
  }

  @Put("users/:id/auto-accept")
  updateAutoAcceptRules(
    @Param("id") id: string,
    @Body()
    body: {
      autoAcceptEnabled?: boolean;
      autoAcceptMaxKm?: number;
      autoAcceptMaxResponseMinutes?: number;
      autoAcceptMinRating?: number;
    }
  ) {
    return this.buddyService.updateAutoAcceptRules(id, body);
  }

  @Post("users/:id/payouts")
  createPayoutRequest(
    @Param("id") id: string,
    @Body() dto: CreatePayoutRequestDto
  ) {
    return this.buddyService.createPayoutRequest(id, dto);
  }
}
