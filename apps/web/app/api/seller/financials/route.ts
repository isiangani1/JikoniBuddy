import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    // 1. Fetch payments linked to this seller's orders
    const payments = await (prisma as any).payment.findMany({
      where: {
        order: {
          sellerId
        }
      },
      include: {
        order: {
          include: {
            buyer: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // 2. Fetch Earnings records
    const earnings = await (prisma as any).earning.findMany({
      where: { userId: sellerId },
      orderBy: { createdAt: "desc" }
    });

    const totalBalance = earnings.reduce((acc: number, e: any) => e.status === "available" ? acc + e.amount : acc, 0);
    const pendingBalance = earnings.reduce((acc: number, e: any) => e.status === "pending" ? acc + e.amount : acc, 0);

    return NextResponse.json({ payments, earnings, totalBalance, pendingBalance });
  } catch (error) {
    console.error("Failed to fetch financials:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Handle Payout Request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellerId, amount } = body;

    // In a real app, logic would:
    // 1. Verify balance
    // 2. Queue M-Pesa B2C transaction
    // 3. Update Earning records
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing

    return NextResponse.json({ success: true, message: "Payout request queued for M-Pesa processing." });
  } catch (error) {
    return NextResponse.json({ error: "Payout failed" }, { status: 500 });
  }
}
