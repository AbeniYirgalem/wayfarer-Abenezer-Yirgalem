/**
 * Ranking Service
 *
 * Implements the Bayesian weighted rating formula:
 * WR = (v / (v + m)) * R + (m / (v + m)) * C
 *
 * Where:
 * - WR = Weighted rating
 * - R = Average rating of the place
 * - v = Number of reviews for the place
 * - m = Minimum review-count threshold (default: 5)
 * - C = Overall average rating across all reviewed places
 */

export interface PlaceRatingStats {
  averageRating: number;
  reviewCount: number;
  weightedRating: number;
}

export class RankingService {
  public static readonly DEFAULT_THRESHOLD_M = 5;

  /**
   * Calculates the arithmetic mean for an array of numeric ratings.
   */
  static calculateAverage(ratings: number[]): number {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    return Number((sum / ratings.length).toFixed(2));
  }

  /**
   * Calculates Bayesian weighted rating according to:
   * WR = (v / (v + m)) * R + (m / (v + m)) * C
   *
   * @param placeAverageRating - R: Average rating of the place
   * @param reviewCount - v: Number of reviews for the place
   * @param overallAverageRating - C: Overall average rating across all reviewed places
   * @param m - Minimum review-count threshold (default: 5)
   */
  static calculateWeightedRating(
    placeAverageRating: number,
    reviewCount: number,
    overallAverageRating: number,
    m: number = RankingService.DEFAULT_THRESHOLD_M
  ): number {
    if (reviewCount <= 0) {
      // With 0 reviews, the prior is anchored directly to the global mean C
      return Number(overallAverageRating.toFixed(2));
    }

    const v = reviewCount;
    const R = placeAverageRating;
    const C = overallAverageRating;

    const weighted = (v / (v + m)) * R + (m / (v + m)) * C;
    return Number(weighted.toFixed(2));
  }

  /**
   * Helper computing average, count, and weighted score in one pass.
   */
  static computeStats(
    ratings: number[],
    overallAverage: number,
    m: number = RankingService.DEFAULT_THRESHOLD_M
  ): PlaceRatingStats {
    const reviewCount = ratings.length;
    const averageRating = this.calculateAverage(ratings);
    const weightedRating = this.calculateWeightedRating(averageRating, reviewCount, overallAverage, m);
    return {
      averageRating,
      reviewCount,
      weightedRating,
    };
  }

  /**
   * Backward-compatible alias for existing tests
   */
  static calculateScore(ratings: number[]): number {
    return this.calculateAverage(ratings);
  }
}

export default RankingService;
