import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { BuddyPoolService } from "./buddy-pool.service";
import {
  ApplyBuddyRequestDto,
  CompleteAssignmentDto,
  ConfirmBuddyRequestDto,
  CreateBuddyRequestDto,
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
}
