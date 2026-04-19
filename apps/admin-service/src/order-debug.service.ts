import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class OrderDebugService {
  constructor(private readonly prisma: PrismaService) {}

  async listOrders(filters: {
    status?: string;
    search?: string;
    limit?: number;
  }) {
    const take = Math.min(Math.max(filters.limit ?? 30, 1), 100);
    const search = filters.search?.trim();

    return this.prisma.order.findMany({
      where: {
        ...(filters.status ? { status: filters.status as never } : {}),
        ...(search
          ? {
              OR: [
                { id: { contains: search, mode: "insensitive" } },
                { buyer: { email: { contains: search, mode: "insensitive" } } },
                { seller: { email: { contains: search, mode: "insensitive" } } },
                { seller: { displayName: { contains: search, mode: "insensitive" } } }
              ]
            }
          : {})
      },
      include: {
        buyer: {
          select: { id: true, name: true, displayName: true, email: true, phone: true }
        },
        seller: {
          select: { id: true, name: true, displayName: true, email: true, phone: true }
        },
        assignedBuddy: {
          select: { id: true, name: true, displayName: true, email: true, phone: true }
        },
        statusEvents: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" },
      take
    });
  }

  async getOrderDebug(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            displayName: true,
            email: true,
            phone: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            displayName: true,
            email: true,
            phone: true
          }
        },
        assignedBuddy: {
          select: {
            id: true,
            name: true,
            displayName: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: "asc" }
        },
        statusEvents: {
          orderBy: { createdAt: "asc" }
        },
        trackingPoints: {
          orderBy: { recordedAt: "asc" },
          take: 250
        },
        refundRequests: {
          include: {
            events: {
              orderBy: { createdAt: "asc" }
            }
          },
          orderBy: { createdAt: "asc" }
        }
      }
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    const payments = await this.prisma.payment.findMany({
      where: { reference: order.id },
      include: {
        events: {
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    const buddyActions = await this.prisma.buddyActionLog.findMany({
      where: {
        OR: [{ orderId: order.id }, { referenceId: order.id }]
      },
      orderBy: { createdAt: "asc" }
    });

    const timeline = [
      ...order.statusEvents.map((event) => ({
        id: event.id,
        type: "order_status",
        label: event.status,
        note: event.note,
        actorId: event.actorId,
        actorRole: event.actorRole,
        createdAt: event.createdAt
      })),
      ...payments.flatMap((payment) =>
        payment.events.map((event) => ({
          id: event.id,
          type: "payment",
          label: event.status,
          note: event.note,
          actorId: payment.userId,
          actorRole: "payment",
          createdAt: event.createdAt
        }))
      ),
      ...order.refundRequests.flatMap((refund) =>
        refund.events.map((event) => ({
          id: event.id,
          type: "refund",
          label: event.action,
          note: event.note,
          actorId: event.actorId,
          actorRole: "refund",
          createdAt: event.createdAt
        }))
      ),
      ...buddyActions.map((action) => ({
        id: action.id,
        type: "buddy_action",
        label: action.action,
        note: action.note,
        actorId: action.buddyId,
        actorRole: "buddy",
        createdAt: action.createdAt
      }))
    ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const traceSummary = order.trackingPoints.length
      ? {
          totalPoints: order.trackingPoints.length,
          firstSeenAt: order.trackingPoints[0]?.recordedAt ?? null,
          lastSeenAt:
            order.trackingPoints[order.trackingPoints.length - 1]?.recordedAt ?? null
        }
      : {
          totalPoints: 0,
          firstSeenAt: null,
          lastSeenAt: null
        };

    return {
      order,
      payments,
      buddyActions,
      timeline,
      traceSummary
    };
  }
}
