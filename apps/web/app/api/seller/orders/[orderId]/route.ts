import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request: Request, context: { params: { orderId: string } }) {
  const { orderId } = context.params;
  
  try {
    const body = await request.json();
    if (!body.status) return NextResponse.json({ error: "Missing status" }, { status: 400 });

    const order = await (prisma as any).order.update({
      where: { id: orderId },
      data: { status: body.status }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(`Failed to update order ${orderId}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
