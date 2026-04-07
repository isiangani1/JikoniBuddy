import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ReviewService } from "./review.service";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviews: ReviewService) {}

  @Get()
  list(
    @Query("sellerId") sellerId?: string,
    @Query("orderId") orderId?: string,
    @Query("buyerId") buyerId?: string
  ) {
    return this.reviews.listReviews({ sellerId, orderId, buyerId });
  }

  @Get("summary")
  getSummary(@Query("sellerId") sellerId: string) {
    return this.reviews.getSummary(sellerId);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.reviews.getReview(id);
  }

  @Post()
  submit(
    @Body()
    payload: {
      orderId: string;
      sellerId: string;
      buyerId: string;
      rating: number;
      comment?: string;
    }
  ) {
    return this.reviews.submitReview(payload);
  }
}
