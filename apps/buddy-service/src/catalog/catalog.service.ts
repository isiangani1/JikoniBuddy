import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async listCategories(params: { kind?: string; parentSlug?: string }) {
    const { kind, parentSlug } = params;
    let parentId: string | undefined;
    if (parentSlug) {
      const parent = await this.prisma.category.findUnique({
        where: { slug: parentSlug }
      });
      if (!parent) {
        throw new NotFoundException("Parent category not found");
      }
      parentId = parent.id;
    }
    return this.prisma.category.findMany({
      where: {
        ...(kind ? { kind: kind as any } : {}),
        ...(parentId ? { parentId } : {})
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });
  }

  async listHomeSections() {
    return this.prisma.category.findMany({
      where: { kind: "home" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 8
        }
      }
    });
  }

  async listCategoryProducts(slug: string, limit = 12) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: limit
        }
      }
    });
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return category;
  }
}
