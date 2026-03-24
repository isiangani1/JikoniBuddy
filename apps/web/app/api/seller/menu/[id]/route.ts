import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    const body = await request.json();
    
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.prepTime !== undefined) updateData.prepTime = parseInt(body.prepTime);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    
    const product = await (prisma as any).product.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(`Failed to update product ${id}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  try {
    await (prisma as any).product.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
