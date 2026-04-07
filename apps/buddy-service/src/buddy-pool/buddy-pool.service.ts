import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PrismaService } from "../prisma.service";
import { NotificationService } from "./notification.service";
import {
  ApplyBuddyRequestDto,
  CompleteAssignmentDto,
  ConfirmBuddyRequestDto,
  CreateBuddyRequestDto,
  CreatePayoutRequestDto,
  CreateRatingDto
} from "./dto";
import { BuddyPoolGateway } from "./buddy-pool.gateway";

@Injectable()
export class BuddyPoolService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService,
    private readonly gateway: BuddyPoolGateway,
    @Inject('MESSAGE_BROKER') private readonly broker: ClientProxy
  ) {}

  async createRequest(dto: CreateBuddyRequestDto) {
    const request = await this.prisma.buddyRequest.create({
      data: {
        sellerId: dto.sellerId,
        taskType: dto.taskType,
        locationLabel: dto.location.label,
        lat: dto.location.lat,
        lng: dto.location.lng,
        startTime: new Date(dto.timeWindow.start),
        endTime: new Date(dto.timeWindow.end),
        durationHours: dto.durationHours,
        compensation: dto.compensation
      }
    });

    const matches = await this.matchHelpers(request.taskType, request.lat, request.lng);
    const helperIds = matches.slice(0, 5).map(h => h.id);

    const autoHelper = matches.find((helper: any) => {
      const profile = helper.helperProfile;
      if (!profile?.autoAcceptEnabled) return false;
      const distanceOk = helper.distance <= (profile.autoAcceptMaxKm ?? 5);
      const responseOk =
        (profile.avgResponseMinutes ?? 30) <= (profile.autoAcceptMaxResponseMinutes ?? 30);
      const ratingOk = (profile.rating ?? 5) >= (profile.autoAcceptMinRating ?? 4.5);
      return distanceOk && responseOk && ratingOk;
    });

    if (autoHelper) {
      await this.applyToRequest(request.id, {
        helperId: autoHelper.id,
        note: "Auto-accepted by helper rules."
      });
      return { request, matches, autoAccepted: autoHelper.id };
    }

    helperIds.forEach((id) => {
      this.notifications.notifyHelper(
        id,
        `New ${request.taskType} request near you.`
      );
    });

    // Real-time socket broadcast
    this.gateway.notifyHelpersOfJob(helperIds, request);

    return { request, matches };
  }

  async autoMatchTopBuddy(dto: CreateBuddyRequestDto) {
    // 1. Create the official request
    const request = await this.prisma.buddyRequest.create({
      data: {
        sellerId: dto.sellerId,
        taskType: dto.taskType,
        locationLabel: dto.location.label,
        lat: dto.location.lat,
        lng: dto.location.lng,
        startTime: new Date(dto.timeWindow.start),
        endTime: new Date(dto.timeWindow.end),
        durationHours: dto.durationHours,
        compensation: dto.compensation,
      }
    });

    // 2. Find the #1 highest-ranked matching online buddy
    const matches = await this.matchHelpers(request.taskType, request.lat, request.lng);
    const topBuddy = matches[0];

    if (!topBuddy) {
      // Return a 404-like response so the EventBroker fallback can pause the seller
      return { success: false, reason: "No active buddies found for Auto-Match algorithms." };
    }

    // 3. Force-confirm the match instantly
    const assignment = await this.prisma.buddyAssignment.create({
      data: {
        requestId: request.id,
        helperId: topBuddy.id
      }
    });

    await this.prisma.buddyRequest.update({
      where: { id: request.id },
      data: { status: "confirmed" }
    });

    // 4. Dispatch the aggressive WebSockets alert to the Buddy's app!
    const targetSocket = this.gateway['connectedBuddies'].get(topBuddy.id);
    if (targetSocket) {
      this.gateway.server.to(targetSocket).emit('buddy.job_confirmed', {
        ...assignment,
        taskType: dto.taskType,
        sellerId: dto.sellerId,
        locationLabel: dto.location.label
      });
    }

    return { success: true, request, assignment, buddy: topBuddy };
  }

  async listRequests(status?: string) {
    if (!status) return this.prisma.buddyRequest.findMany();
    return this.prisma.buddyRequest.findMany({
      where: { status: status as any }
    });
  }

  async getRequest(id: string) {
    return this.prisma.buddyRequest.findUnique({
      where: { id },
      include: { applications: true, assignments: true }
    });
  }

  async applyToRequest(requestId: string, dto: ApplyBuddyRequestDto) {
    const existing = await this.prisma.buddyApplication.findFirst({
      where: { requestId, helperId: dto.helperId }
    });

    const application = existing
      ? await this.prisma.buddyApplication.update({
          where: { id: existing.id },
          data: { note: dto.note, status: "accepted" }
        })
      : await this.prisma.buddyApplication.create({
          data: {
            requestId,
            helperId: dto.helperId,
            note: dto.note,
            status: "accepted"
          }
        });

    const request = await this.prisma.buddyRequest.findUnique({ where: { id: requestId } });
    if (request) {
      const responseMinutes = Math.max(
        1,
        (Date.now() - new Date(request.createdAt).getTime()) / (1000 * 60)
      );
      await this.prisma.helperProfile.update({
        where: { userId: dto.helperId },
        data: {
          avgResponseMinutes: {
            set: await this.getSmoothedResponse(dto.helperId, responseMinutes)
          }
        }
      }).catch(() => null);
      await this.prisma.buddyRequest.update({
        where: { id: requestId },
        data: { status: "matched" }
      });
      const existingJob = await this.prisma.job.findFirst({
        where: { requestId: request.id, buddyId: dto.helperId }
      });
      let updatedJob;
      if (existingJob) {
        updatedJob = await this.prisma.job.update({
          where: { id: existingJob.id },
          data: { status: "scheduled" }
        });
      } else {
        updatedJob = await this.prisma.job.create({
          data: {
            buddyId: dto.helperId,
            sellerId: request.sellerId,
            requestId: request.id,
            title: `${request.taskType} support`,
            taskType: request.taskType,
            locationLabel: request.locationLabel,
            startTime: request.startTime,
            endTime: request.endTime,
            payAmount: request.compensation ?? 0,
            status: "scheduled"
          }
        });
      }
      if (updatedJob) {
        this.gateway.notifyBuddyJobStatus(dto.helperId, updatedJob);
      }
      this.notifications.notifySeller(
        request.sellerId,
        "A helper has applied to your Buddy request."
      );
      this.gateway.notifySellerOfApplicant(request.sellerId, dto.helperId);
    }

    return application;
  }

  async rejectRequest(requestId: string, helperId: string) {
    const existing = await this.prisma.buddyApplication.findFirst({
      where: { requestId, helperId }
    });

    const application = existing
      ? await this.prisma.buddyApplication.update({
          where: { id: existing.id },
          data: { status: "rejected" }
        })
      : await this.prisma.buddyApplication.create({
          data: {
            requestId,
            helperId,
            status: "rejected"
          }
        });

    return application;
  }

  async confirmHelper(requestId: string, dto: ConfirmBuddyRequestDto) {
    const assignment = await this.prisma.buddyAssignment.create({
      data: {
        requestId,
        helperId: dto.helperId
      }
    });

    const request = await this.prisma.buddyRequest.update({
      where: { id: requestId },
      data: { status: "confirmed" }
    });

    this.notifications.notifyHelper(
      dto.helperId,
      "You have been confirmed for a Buddy request."
    );
    this.gateway.notifyHelperOfConfirmation(dto.helperId, assignment);

    // Broadcast the successful match to the distributed microservice layer
    this.broker.emit('buddy.assigned', {
      requestId,
      helperId: dto.helperId,
      sellerId: request.sellerId
    });

    return assignment;
  }

  async completeAssignment(assignmentId: string, _dto: CompleteAssignmentDto) {
    const assignment = await this.prisma.buddyAssignment.update({
      where: { id: assignmentId },
      data: { status: "completed", completedAt: new Date() }
    });
    const request = await this.prisma.buddyRequest.findUnique({
      where: { id: assignment.requestId }
    });
    this.broker.emit('buddy.completed', {
      requestId: assignment.requestId,
      helperId: assignment.helperId,
      sellerId: request?.sellerId
    });
    return assignment;
  }

  async createRating(dto: CreateRatingDto) {
    return this.prisma.rating.create({
      data: {
        requestId: dto.requestId,
        helperId: dto.helperId,
        rating: dto.rating,
        comment: dto.comment
      }
    });
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        skills: true,
        availability: true,
        helperProfile: true,
        ratings: {
          select: {
            rating: true
          }
        }
      }
    });

    if (!user) return null;

    const avgRating = user.ratings.length > 0 
      ? user.ratings.reduce((acc, r) => acc + r.rating, 0) / user.ratings.length 
      : 5.0;

    return {
      id: user.id,
      name: user.displayName ?? user.name ?? user.email.split("@")[0],
      role: user.role,
      status: user.status,
      rating: avgRating,
      ratingCount: user.ratings.length,
      profilePhotoUrl: user.profilePhotoUrl,
      skills: user.skills.map(s => s.taskType),
      availability: user.availability.map(a => ({
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime
      })),
      isOnline: user.helperProfile?.isOnline ?? false,
      jobsCompleted: user.helperProfile?.jobsCompleted ?? 0
    };
  }

  async getUserEarnings(userId: string) {
    const earnings = await this.prisma.earning.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const total = this.sumEarnings(earnings);
    const todayTotal = this.sumEarnings(
      earnings.filter((item) => item.createdAt >= startOfToday)
    );
    const weekTotal = this.sumEarnings(
      earnings.filter((item) => item.createdAt >= startOfWeek)
    );
    const monthTotal = this.sumEarnings(
      earnings.filter((item) => item.createdAt >= startOfMonth)
    );

    const stats = [
      {
        label: "Today",
        value: `KES ${todayTotal.toLocaleString()}`,
        icon: "wallet",
        trend: [8, 12, 10, 14, 16, 13, 18]
      },
      {
        label: "This Week",
        value: `KES ${weekTotal.toLocaleString()}`,
        icon: "trend",
        trend: [6, 9, 8, 11, 10, 14, 15]
      },
      {
        label: "This Month",
        value: `KES ${monthTotal.toLocaleString()}`,
        icon: "calendar",
        trend: [4, 6, 7, 9, 12, 11, 14]
      },
      {
        label: "Total",
        value: `KES ${total.toLocaleString()}`,
        icon: "target",
        trend: [3, 5, 6, 8, 9, 10, 12]
      }
    ];

    return {
      stats,
      earnings: earnings.map((earning) => ({
        amount: earning.amount,
        currency: earning.currency,
        source: earning.source,
        status: earning.status,
        createdAt: earning.createdAt,
        paidAt: earning.paidAt
      }))
    };
  }

  async getUserPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  async createPayoutRequest(userId: string, dto: CreatePayoutRequestDto) {
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        amount: dto.amount,
        currency: "KES",
        method: "M-Pesa",
        reference: dto.mpesaNumber,
        status: "pending"
      }
    });

    await this.prisma.notification.create({
      data: {
        userId,
        title: "Payout requested",
        message: `Your payout request for KES ${dto.amount} is being processed.`,
        type: "payment",
        status: "unread"
      }
    });

    return payment;
  }

  async getUserJobs(userId: string, status?: string) {
    const statuses = status?.split(",").map((item) => item.trim()) ?? [];
    const jobs = await this.prisma.job.findMany({
      where: {
        buddyId: userId,
        status: statuses.length ? { in: statuses as any } : undefined
      },
      orderBy: { startTime: "desc" }
    });
    return jobs.map((job) => ({
      ...job,
      seller: job.sellerId
    }));
  }

  async getUserApplications(userId: string) {
    const applications = await this.prisma.buddyApplication.findMany({
      where: { helperId: userId },
      include: { request: true },
      orderBy: { createdAt: "desc" }
    });
    return applications.map((application) => ({
      id: application.id,
      status: application.status,
      request: application.request
        ? {
            id: application.request.id,
            taskType: application.request.taskType,
            locationLabel: application.request.locationLabel,
            startTime: application.request.startTime,
            durationHours: application.request.durationHours,
            compensation: application.request.compensation,
            status: application.request.status
          }
        : null
    }));
  }

  async getUserRatings(userId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { helperId: userId },
      orderBy: { createdAt: "desc" }
    });

    const average =
      ratings.length === 0
        ? 0
        : ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;

    const stats = [
      {
        label: "Overall rating",
        value: average ? average.toFixed(1) : "4.8",
        icon: "star",
        trend: [4.4, 4.6, 4.5, 4.7, 4.8, 4.8, 4.9]
      },
      {
        label: "Total reviews",
        value: ratings.length.toString(),
        icon: "chat",
        trend: [120, 132, 148, 162, 173, 180, 186]
      },
      {
        label: "Repeat sellers",
        value: Math.max(3, Math.round(ratings.length / 4)).toString(),
        icon: "repeat",
        trend: [20, 26, 30, 34, 38, 40, 42]
      },
      {
        label: "On-time rate",
        value: "97%",
        icon: "clock",
        trend: [92, 94, 95, 96, 97, 97, 98]
      }
    ];

    return {
      stats,
      reviews: ratings.map((rating) => ({
        seller: `Seller ${rating.requestId.slice(0, 4).toUpperCase()}`,
        score: rating.rating,
        comment: rating.comment,
        createdAt: rating.createdAt
      }))
    };
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  async getDashboardMetrics(userId: string) {
    const metrics = await this.prisma.metricSnapshot.findMany({
      where: { userId },
      orderBy: { recordedAt: "asc" }
    });

    const latestValue = (type: string) => {
      const filtered = metrics.filter((item) => item.type === type);
      return filtered.length ? filtered[filtered.length - 1].value : 0;
    };

    const acceptance = latestValue("acceptance_rate");
    const onTime = latestValue("on_time_rate");
    const ratingQuality = latestValue("rating_quality");
    const centerValue = Math.round((acceptance + onTime + ratingQuality) / 3);

    const lineMetrics = metrics.filter(
      (item) => item.type === "requests_completed"
    );
    const points = lineMetrics.map((item) => item.value);
    const xLabels = lineMetrics.map((item) => item.label ?? "");

    return {
      radial: {
        centerValue: `${centerValue || 92}%`,
        centerLabel: "Reliability",
        rings: [
          {
            label: "Acceptance rate",
            percent: acceptance || 88,
            color: "#7C5CFF",
            radius: 110
          },
          {
            label: "On-time shifts",
            percent: onTime || 94,
            color: "#2DD4BF",
            radius: 90
          },
          {
            label: "Rating quality",
            percent: ratingQuality || 96,
            color: "#F7C948",
            radius: 70
          }
        ]
      },
      line: {
        points: points.length ? points : [12, 18, 22, 30, 28, 40, 43],
        xLabels: xLabels.length ? xLabels : ["Jan", "Mar", "May", "Jul", "Sep", "Nov", ""],
        headlineValue: points.length ? `${Math.round(points[points.length - 1] * 1000).toLocaleString()}` : "43,000",
        headlineLabel: "Revenue retained",
        footerLeft: "Latest: 43k · Peak: 45k",
        footerRight: "Churn down 6%"
      }
    };
  }

  async checkInJob(jobId: string, helperId?: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return null;
    if (helperId && job.buddyId !== helperId) return null;

    const updated = await this.prisma.job.update({
      where: { id: jobId },
      data: { status: "in_progress" }
    });

    this.notifications.notifySeller(
      updated.sellerId,
      `Buddy checked in for ${updated.title}.`
    );
    this.gateway.notifyBuddyJobStatus(updated.buddyId, updated);
    this.gateway.notifySellerJobStatus(updated.sellerId, updated);
    return updated;
  }

  async checkOutJob(jobId: string, helperId?: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return null;
    if (helperId && job.buddyId !== helperId) return null;

    const updated = await this.prisma.job.update({
      where: { id: jobId },
      data: { endTime: new Date() }
    });

    this.notifications.notifySeller(
      updated.sellerId,
      `Buddy checked out for ${updated.title}.`
    );
    this.gateway.notifyBuddyJobStatus(updated.buddyId, updated);
    this.gateway.notifySellerJobStatus(updated.sellerId, updated);
    return updated;
  }

  async addJobNote(jobId: string, helperId: string, note: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.buddyId !== helperId) return null;

    this.notifications.notifySeller(
      job.sellerId,
      `Job note from buddy: ${note}`
    );
    return { ok: true };
  }

  async raiseDispute(jobId: string, helperId: string, note: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.buddyId !== helperId) return null;

    this.notifications.notifySeller(
      job.sellerId,
      `Dispute raised by buddy: ${note}`
    );
    return { ok: true };
  }

  async completeJob(jobId: string, helperId: string, note?: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.buddyId !== helperId) return null;

    const updated = await this.prisma.job.update({
      where: { id: jobId },
      data: { status: "completed", endTime: new Date() }
    });

    this.notifications.notifySeller(
      updated.sellerId,
      note
        ? `Buddy completed ${updated.title}. Note: ${note}`
        : `Buddy completed ${updated.title}.`
    );
    this.gateway.notifyBuddyJobStatus(updated.buddyId, updated);
    this.gateway.notifySellerJobStatus(updated.sellerId, updated);
    this.broker.emit("buddy.completed", {
      requestId: updated.requestId ?? updated.id,
      helperId: updated.buddyId,
      sellerId: updated.sellerId
    });
    return updated;
  }

  private sumEarnings(items: { amount: number }[]) {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }

  private async matchHelpers(taskType: string, lat: number, lng: number) {
    const profiles = await this.prisma.helperProfile.findMany({
      where: {
        isOnline: true,
        user: {
          skills: { some: { taskType: taskType as any } },
          status: "active"
        }
      },
      include: { user: true }
    });

    const scoredHelpers = profiles
      .filter((profile) => profile.lat !== null && profile.lng !== null)
      .map((profile) => {
        const distance = this.haversineDistance(profile.lat!, profile.lng!, lat, lng);
        const rating = profile.rating || 5.0;
        const responseMinutes = profile.avgResponseMinutes ?? 30;
        
        // Match score algorithm:
        // 40% rating, 30% distance (closer is better, max 10km), 20% response speed, 10% experience
        const normalizedDistance = Math.max(0, 10 - distance) / 10; 
        const normalizedExperience = Math.min(100, profile.jobsCompleted) / 100; 
        const normalizedResponse = Math.max(0, 60 - responseMinutes) / 60;
        
        const score =
          (rating / 5) * 40 +
          normalizedDistance * 30 +
          normalizedResponse * 20 +
          normalizedExperience * 10;
        
        return {
          ...profile.user,
          helperProfile: profile,
          matchScore: score,
          distance,
          responseMinutes
        };
      })
      .filter((helper) => helper.distance <= 10);

    return scoredHelpers.sort((a, b) => b.matchScore - a.matchScore);
  }

  private withinRadius(
    helperLat: number,
    helperLng: number,
    requestLat: number,
    requestLng: number,
    radiusKm: number
  ) {
    const distance = this.haversineDistance(
      helperLat,
      helperLng,
      requestLat,
      requestLng
    );
    return distance <= radiusKm;
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async updateUserStatus(id: string, isOnline: boolean) {
    return this.prisma.helperProfile.update({
      where: { userId: id },
      data: { isOnline }
    });
  }

  private async getSmoothedResponse(userId: string, newMinutes: number) {
    const profile = await this.prisma.helperProfile.findUnique({
      where: { userId }
    });
    const current = profile?.avgResponseMinutes ?? 30;
    const next = current * 0.7 + newMinutes * 0.3;
    return Math.round(next * 10) / 10;
  }

  async getUserAvailability(userId: string) {
    return this.prisma.userAvailability.findMany({
      where: { userId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
    });
  }

  async setUserAvailability(
    userId: string,
    slots: { dayOfWeek: number; startTime: string; endTime: string }[]
  ) {
    await this.prisma.userAvailability.deleteMany({ where: { userId } });
    if (!slots.length) return [];
    return this.prisma.userAvailability.createMany({
      data: slots.map((slot) => ({
        userId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime
      }))
    });
  }

  async getPerformanceAnalytics(userId: string) {
    const [jobs, applications, profile, earnings] = await Promise.all([
      this.prisma.job.findMany({ where: { buddyId: userId } }),
      this.prisma.buddyApplication.findMany({ where: { helperId: userId } }),
      this.prisma.helperProfile.findUnique({ where: { userId } }),
      this.prisma.earning.findMany({ where: { userId } })
    ]);

    const totalApplications = applications.length;
    const accepted = applications.filter((a) => a.status === "accepted").length;
    const acceptanceRate = totalApplications ? Math.round((accepted / totalApplications) * 100) : 0;
    const completed = jobs.filter((j) => j.status === "completed").length;
    const cancelled = jobs.filter((j) => j.status === "cancelled").length;
    const totalEarned = earnings.reduce((sum, item) => sum + item.amount, 0);

    return {
      acceptanceRate,
      completedJobs: completed,
      cancelledJobs: cancelled,
      avgResponseMinutes: profile?.avgResponseMinutes ?? 30,
      rating: profile?.rating ?? 5,
      totalEarned
    };
  }

  async getIdleSuggestions() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recent = await this.prisma.buddyRequest.findMany({
      where: { createdAt: { gte: cutoff } },
      select: { locationLabel: true }
    });
    const counts = new Map<string, number>();
    recent.forEach((req) => {
      counts.set(req.locationLabel, (counts.get(req.locationLabel) ?? 0) + 1);
    });
    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label, count]) => ({ label, count }));

    if (sorted.length) return sorted;
    return [
      { label: "Westlands", count: 4 },
      { label: "Kilimani", count: 3 },
      { label: "CBD", count: 2 }
    ];
  }

  async getFraudSignals(userId: string) {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const cancelled = await this.prisma.job.count({
      where: { buddyId: userId, status: "cancelled", createdAt: { gte: cutoff } }
    });

    return {
      repeatedCancellations: cancelled >= 3,
      cancellationCount: cancelled,
      gpsSpoofing: false,
      notes: cancelled >= 3 ? ["High cancellation count in last 30 days."] : []
    };
  }

  async getAutoAcceptRules(userId: string) {
    return this.prisma.helperProfile.findUnique({
      where: { userId },
      select: {
        autoAcceptEnabled: true,
        autoAcceptMaxKm: true,
        autoAcceptMaxResponseMinutes: true,
        autoAcceptMinRating: true
      }
    });
  }

  async updateAutoAcceptRules(
    userId: string,
    rules: {
      autoAcceptEnabled?: boolean;
      autoAcceptMaxKm?: number;
      autoAcceptMaxResponseMinutes?: number;
      autoAcceptMinRating?: number;
    }
  ) {
    return this.prisma.helperProfile.update({
      where: { userId },
      data: {
        autoAcceptEnabled: rules.autoAcceptEnabled ?? false,
        autoAcceptMaxKm: rules.autoAcceptMaxKm ?? 5,
        autoAcceptMaxResponseMinutes: rules.autoAcceptMaxResponseMinutes ?? 30,
        autoAcceptMinRating: rules.autoAcceptMinRating ?? 4.5
      }
    });
  }
}
