import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all buddy requests for a seller
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    const requests = await (prisma as any).buddyRequest.findMany({
      where: { sellerId },
      include: {
        applications: {
          include: {
            helper: {
              include: {
                user: true
              }
            }
          }
        },
        assignments: {
          include: {
            helper: {
              include: {
                user: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Failed to fetch buddy requests:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST a new buddy SOS request
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    const body = await request.json();
    const { task, startTime, endTime, location, budget } = body;

    const buddyRequest = await (prisma as any).buddyRequest.create({
      data: {
        sellerId,
        task,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location: location || "Kitchen Main",
        budget: parseFloat(budget) || 0,
        status: "open"
      }
    });

    return NextResponse.json(buddyRequest);
  } catch (error) {
    console.error("Failed to create buddy request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
