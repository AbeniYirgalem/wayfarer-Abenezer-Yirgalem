/**
 * Review Service
 *
 * Business logic for user reviews and ratings.
 * Core features scheduled for Phase 2.
 */

import prisma from '../lib/prisma';
import type { Review } from '@prisma/client';

export class ReviewService {
  static async getReviewsByPlaceId(placeId: string): Promise<Review[]> {
    return prisma.review.findMany({
      where: { placeId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

