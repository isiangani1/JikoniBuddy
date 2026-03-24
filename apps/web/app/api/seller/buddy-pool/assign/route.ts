import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Accept a buddy application (Assign them)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requestId, applicationId, helperId } = body;

    if (!requestId || !applicationId || !helperId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create Assignment
    const assignment = await (prisma as any).buddyAssignment.create({
      data: {
        requestId,
        helperId,
        status: "active",
        startTime: new Date()
      }
    });

    // 2. Update Request Status
    await (prisma as any).buddyRequest.update({
      where: { id: requestId },
      data: { status: "assigned" }
    });

    // 3. Update Application Status
    await (prisma as any).buddyApplication.update({
      where: { id: applicationId },
      data: { status: "accepted" }
    });

    // 4. Reject other applications for the same request
    await (prisma as any).buddyApplication.updateMany({
      where: { 
        requestId,
        id: { not: applicationId }
      },
      data: { status: "rejected" }
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Failed to assign buddy:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
