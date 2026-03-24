import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    let profile = await (prisma as any).sellerProfile.findUnique({
      where: { userId: sellerId }
    });

    if (!profile) {
      profile = await (prisma as any).sellerProfile.create({
        data: { userId: sellerId }
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to fetch capacity settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    const body = await request.json();
    
    const updateData: any = {};
    if (body.isAcceptingOrders !== undefined) updateData.isAcceptingOrders = body.isAcceptingOrders;
    if (body.maxOrdersPerHour !== undefined) updateData.maxOrdersPerHour = body.maxOrdersPerHour;
    if (body.operatingHoursOpen !== undefined) updateData.operatingHoursOpen = body.operatingHoursOpen;
    if (body.operatingHoursClose !== undefined) updateData.operatingHoursClose = body.operatingHoursClose;
    if (body.autoBuddyScaling !== undefined) updateData.autoBuddyScaling = body.autoBuddyScaling;
    if (body.prepBufferMinutes !== undefined) updateData.prepBufferMinutes = body.prepBufferMinutes;

    const profile = await (prisma as any).sellerProfile.upsert({
      where: { userId: sellerId },
      update: updateData,
      create: {
        userId: sellerId,
        ...updateData
      }
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Failed to update capacity settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
