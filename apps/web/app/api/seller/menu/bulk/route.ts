import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    const body = await request.json();
    const { productIds, isActive } = body;
    
    if (!Array.isArray(productIds)) return NextResponse.json({ error: "Invalid productIds" }, { status: 400 });

    const result = await (prisma as any).product.updateMany({
      where: {
        id: { in: productIds },
        sellerId
      },
      data: { isActive }
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("Failed to bulk update menu:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
