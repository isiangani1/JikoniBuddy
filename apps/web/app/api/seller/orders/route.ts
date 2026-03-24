import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    const orders = await (prisma as any).order.findMany({
      where: { sellerId },
      include: { items: { include: { product: true } }, buyer: true },
      orderBy: { createdAt: "desc" }
    });

    const formatted = orders.map((o: any) => ({
      id: o.id,
      buyerName: o.buyer?.name || "Customer",
      status: o.status,
      totalAmount: o.totalAmount,
      createdAt: o.createdAt.toISOString(),
      items: o.items && o.items.length > 0 ? o.items.map((i: any) => ({ 
        name: i.product?.name || "Menu Item", 
        quantity: i.quantity 
      })) : [{ name: "Swahili Pilau (Mock)", quantity: 2 }]
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    // Generate a test order
    // Ensure buyer exists
    let mockBuyer = await (prisma as any).user.findFirst({ where: { role: "buyer" } });
    if (!mockBuyer) {
      mockBuyer = await (prisma as any).user.create({ data: { email: `buyer_${Date.now()}@test.com`, phone: `${Date.now()}`, passwordHash: "mock", name: "Alice M.", role: "buyer" }});
    }
    
    // Ensure seller exists (if they logged in, they exist. If using 'test-seller-1', create it)
    let mockSeller = await (prisma as any).user.findUnique({ where: { id: sellerId } });
    if (!mockSeller) {
      mockSeller = await (prisma as any).user.create({ data: { id: sellerId, email: `seller_${Date.now()}@test.com`, phone: `s_${Date.now()}`, passwordHash: "mock", name: "Jikoni Test Seller", role: "seller" }});
    }

    const order = await (prisma as any).order.create({
      data: {
        sellerId: mockSeller.id,
        buyerId: mockBuyer.id,
        status: "pending",
        totalAmount: 1250,
        currency: "KES",
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to generate order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
