import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await (prisma as any).order.findUnique({
      where: { id: params.id },
      include: {
        assignedBuddy: true,
        buyer: {
          include: {
            addresses: {
              where: { isDefault: true },
              take: 1
            }
          }
        },
        seller: true
      }
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Mocking driver movement for "Live" feel if no real-time coordinates are streaming yet
    const driverLoc = order.assignedBuddy ? { 
      lat: order.assignedBuddy.lat || -1.286389, 
      lng: order.assignedBuddy.lng || 36.817223 
    } : null;

    const destination = order.buyer.addresses[0] || { lat: -1.3000, lng: 36.8000 };

    return NextResponse.json({
      driver: driverLoc,
      destination: { lat: destination.lat, lng: destination.lng, label: (destination as any).label || "Buyer Home" },
      seller: { lat: order.seller.lat || -1.2800, lng: order.seller.lng || 36.8200 },
      status: order.status
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tracking data" }, { status: 500 });
  }
}
