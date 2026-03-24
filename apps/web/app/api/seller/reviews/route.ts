import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    // 1. Fetch ratings for this seller
    const reviews = await (prisma as any).rating.findMany({
      where: {
        toUserId: sellerId,
        type: "order_rating"
      },
      orderBy: { createdAt: "desc" }
    });

    // 2. Aggregate for trends (simplified monthly grouping)
    const trends: Record<string, { total: number, count: number }> = {};
    reviews.forEach((r: any) => {
      const date = new Date(r.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!trends[key]) trends[key] = { total: 0, count: 0 };
      trends[key].total += r.value;
      trends[key].count++;
    });

    const chartData = Object.entries(trends).map(([month, data]) => ({
      month,
      avg: parseFloat((data.total / data.count).toFixed(1))
    })).sort((a,b) => a.month.localeCompare(b.month));

    // 3. Overall Average
    const totalAvg = reviews.length > 0
      ? (reviews.reduce((acc: number, r: any) => acc + r.value, 0) / reviews.length).toFixed(1)
      : "5.0";

    return NextResponse.json({ reviews, chartData, totalAvg });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
