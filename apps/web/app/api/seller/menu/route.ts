import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    const products = await (prisma as any).product.findMany({
      where: { sellerId },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch menu:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    const body = await request.json();
    
    // Ensure default category exists
    let category = await (prisma as any).category.findFirst({ where: { slug: "general" } });
    if (!category) {
      category = await (prisma as any).category.create({ data: { name: "General", slug: "general" } });
    }

    const product = await (prisma as any).product.create({
      data: {
        sellerId,
        categoryId: category.id,
        name: body.name,
        price: parseFloat(body.price),
        prepTime: parseInt(body.prepTime) || 15,
        isActive: true,
        imageUrl: body.imageUrl || null,
        description: body.description || null
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
