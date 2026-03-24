import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const messages = await (prisma as any).message.findMany({
      where: { orderId: params.id },
      orderBy: { createdAt: "asc" },
      include: { sender: true }
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { text, senderId, receiverId } = await request.json();
    const message = await (prisma as any).message.create({
      data: {
        text,
        senderId,
        receiverId,
        orderId: params.id
      },
      include: { sender: true }
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
