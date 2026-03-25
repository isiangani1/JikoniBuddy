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
      await this.prisma.buddyRequest.update({
        where: { id: requestId },
        data: { status: "matched" }
      });
      const existingJob = await this.prisma.job.findFirst({
        where: { requestId: request.id, buddyId: dto.helperId }
      });
      if (existingJob) {
        await this.prisma.job.update({
          where: { id: existingJob.id },
          data: { status: "scheduled" }
        });
      } else {
        await this.prisma.job.create({
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
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        role: true,
        status: true
      }
    });

    if (!user) return null;
    return {
      id: user.id,
      name: user.displayName ?? user.name ?? user.email.split("@")[0],
      role: user.role,
      status: user.status
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
        
        // Basic match score algorithm: 
        // 50% rating, 30% distance (closer is better, max 10km), 20% experience (max 100 jobs)
        const normalizedDistance = Math.max(0, 10 - distance) / 10; 
        const normalizedExperience = Math.min(100, profile.jobsCompleted) / 100; 
        
        const score = (rating / 5) * 50 + (normalizedDistance * 30) + (normalizedExperience * 20);
        
        return {
          ...profile.user,
          helperProfile: profile,
          matchScore: score,
          distance
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
}
