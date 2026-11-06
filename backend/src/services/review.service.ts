import prisma from '../lib/prisma';
import { AppError } from '../utils/app-error';
import { RankingService, PlaceRatingStats } from './ranking.service';
import { PlaceService } from './place.service';

export interface CreateReviewDTO {
  placeId: string;
  userId: string;
  rating: number;
  body?: string | null;
}

export interface ReviewSubmissionResult {
  isNew: boolean;
  review: {
    id: string;
    placeId: string;
    userId: string;
    rating: number;
    body: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
    };
  };
  placeStats: PlaceRatingStats;
}

export class ReviewService {
  /**
   * Submits a review for a place by the acting user.
   * If a review from this user already exists for this place, it is updated;
   * otherwise, a new review is created.
   */
  static async submitReview(dto: CreateReviewDTO): Promise<ReviewSubmissionResult> {
    const { placeId, userId, rating, body } = dto;

    // 1. Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });
    if (!user) {
      throw AppError.notFound(`Acting user with ID '${userId}' does not exist in the database`);
    }

    // 2. Verify place exists
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      select: { id: true },
    });
    if (!place) {
      throw AppError.notFound(`Place with ID '${placeId}' not found`);
    }

    // 3. Determine if review already exists
    const existing = await prisma.review.findUnique({
      where: {
        placeId_userId: {
          placeId,
          userId,
        },
      },
    });
    const isNew = !existing;

    // 4. Upsert review
    const normalizedBody = body && body.trim() ? body.trim() : null;

    const review = await prisma.review.upsert({
      where: {
        placeId_userId: {
          placeId,
          userId,
        },
      },
      create: {
        placeId,
        userId,
        rating,
        body: normalizedBody,
      },
      update: {
        rating,
        body: normalizedBody,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 5. Calculate updated place statistics
    const [placeReviews, overallAverage] = await Promise.all([
      prisma.review.findMany({
        where: { placeId },
        select: { rating: true },
      }),
      PlaceService.getOverallAverageRating(),
    ]);

    const ratings = placeReviews.map((r) => r.rating);
    const placeStats = RankingService.computeStats(ratings, overallAverage);

    return {
      isNew,
      review,
      placeStats,
    };
  }

  /**
   * Retrieves all reviews for a place ordered by creation date descending.
   */
  static async getReviewsByPlaceId(placeId: string) {
    return prisma.review.findMany({
      where: { placeId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });
  }
}

export default ReviewService;
