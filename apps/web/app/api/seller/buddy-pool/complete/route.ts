import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Complete an assignment and submit a rating
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assignmentId, rating, comment, helperId, sellerId } = body;

    // 1. Create Rating
    await (prisma as any).rating.create({
      data: {
        fromUserId: sellerId,
        toUserId: helperId,
        value: parseInt(rating),
        comment: comment || "",
        type: "buddy_rating"
      }
    });

    // 2. Mark Assignment as completed
    const assignment = await (prisma as any).buddyAssignment.update({
      where: { id: assignmentId },
      data: { 
        status: "completed",
        endTime: new Date()
      }
    });

    // 3. Check if all assignments for the request are done to close the request
    const remainingActive = await (prisma as any).buddyAssignment.count({
      where: { 
        requestId: assignment.requestId,
        status: "active"
      }
    });

    if (remainingActive === 0) {
      await (prisma as any).buddyRequest.update({
        where: { id: assignment.requestId },
        data: { status: "completed" }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to complete buddy assignment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
