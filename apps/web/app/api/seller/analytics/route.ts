import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  const period = searchParams.get("period") || "7d"; // 7d, 30d
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    const now = new Date();
    const startDate = new Date();
    if (period === "7d") startDate.setDate(now.getDate() - 7);
    else startDate.setDate(now.getDate() - 30);

    // 1. Fetch Orders in period
    const orders = await (prisma as any).order.findMany({
      where: {
        sellerId,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: "asc" }
    });

    // 2. Aggregate Data
    // For a real app, we'd group by day in Postgres. Here we'll do it in JS for simplicity.
    const dailyStats: Record<string, { revenue: number, orders: number, cancelled: number, delayed: number }> = {};
    
    // Fill gaps
    for (let i = 0; i <= (period === "7d" ? 7 : 30); i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dailyStats[key] = { revenue: 0, orders: 0, cancelled: 0, delayed: 0 };
    }

    orders.forEach((o: any) => {
      const key = new Date(o.createdAt).toISOString().split('T')[0];
      if (dailyStats[key]) {
        dailyStats[key].orders++;
        if (o.status === "completed") dailyStats[key].revenue += o.totalAmount;
        if (o.status === "cancelled") dailyStats[key].cancelled++;
        // Delayed logic would depend on prepTime vs completion time
      }
    });

    const chartData = Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      ...stats
    })).sort((a,b) => a.date.localeCompare(b.date));

    // 3. Overall Totals
    const totals = {
      totalRevenue: orders.reduce((acc: number, o: any) => o.status === "completed" ? acc + o.totalAmount : acc, 0),
      totalOrders: orders.length,
      completionRate: (orders.filter((o: any) => o.status === "completed").length / (orders.length || 1) * 100).toFixed(1),
      cancellationRate: (orders.filter((o: any) => o.status === "cancelled").length / (orders.length || 1) * 100).toFixed(1)
    };

    return NextResponse.json({ chartData, totals });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
