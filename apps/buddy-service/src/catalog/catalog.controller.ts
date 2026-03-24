import { Controller, Get, Param, Query } from "@nestjs/common";
import { CatalogService } from "./catalog.service";

@Controller("catalog")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get("categories")
  async listCategories(
    @Query("kind") kind?: string,
    @Query("parentSlug") parentSlug?: string
  ) {
    return this.catalogService.listCategories({ kind, parentSlug });
  }

  @Get("home-sections")
  async listHomeSections() {
    return this.catalogService.listHomeSections();
  }

  @Get("categories/:slug/products")
  async listCategoryProducts(
    @Param("slug") slug: string,
    @Query("limit") limit?: string
  ) {
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.catalogService.listCategoryProducts(
      slug,
      Number.isFinite(parsedLimit) ? parsedLimit : undefined
    );
  }
}
