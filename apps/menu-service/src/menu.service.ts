import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

// Utilizing a local PrismaClient for the Menu service to avoid monorepo cyclic issues in MVP
const prisma = new PrismaClient();

@Injectable()
export class MenuService {
  async getMenu(sellerId: string) {
    return prisma.product.findMany({
      where: { sellerId },
      include: { category: true }
    });
  }

  async createProduct(sellerId: string, data: any) {
    return prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        prepTime: data.prepTime ?? 15,
        isActive: data.isActive ?? true,
        sellerId
      }
    });
  }

  async bulkUpdate(sellerId: string, productIds: string[], isActive: boolean) {
    return prisma.product.updateMany({
      where: {
        id: { in: productIds },
        sellerId
      },
      data: { isActive }
    });
  }
}
