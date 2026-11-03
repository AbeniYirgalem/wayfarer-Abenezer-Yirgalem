import { describe, it, expect } from 'vitest';
import { RankingService } from '../src/services/ranking.service';

describe('RankingService - Bayesian Weighted Rating', () => {
  const globalAverageC = 3.5;
  const thresholdM = 5;

  it('calculates average score correctly for basic ratings', () => {
    const ratings = [5, 4, 3, 4];
    const score = RankingService.calculateScore(ratings);
    expect(score).toBe(4);
  });

  it('returns 0 when no ratings are provided to calculateAverage', () => {
    const score = RankingService.calculateAverage([]);
    expect(score).toBe(0);
  });

  it('anchors zero-review places to the global average C', () => {
    const weighted = RankingService.calculateWeightedRating(0, 0, globalAverageC, thresholdM);
    expect(weighted).toBe(globalAverageC);
  });

  it('demonstrates that many positive reviews outrank a single 5-star review', () => {
    // Place A: 1 review of 5.0
    // WR = (1 / (1 + 5)) * 5.0 + (5 / (1 + 5)) * 3.5 = (5 / 6) + (17.5 / 6) = 22.5 / 6 = 3.75
    const placeAScore = RankingService.calculateWeightedRating(5.0, 1, globalAverageC, thresholdM);
    expect(placeAScore).toBe(3.75);

    // Place B: 50 reviews with average 4.8
    // WR = (50 / 55) * 4.8 + (5 / 55) * 3.5 = 4.3636 + 0.3181 = 4.68
    const placeBScore = RankingService.calculateWeightedRating(4.8, 50, globalAverageC, thresholdM);
    expect(placeBScore).toBe(4.68);

    // Place B outranks Place A despite Place A having a 5.0 average
    expect(placeBScore).toBeGreaterThan(placeAScore);
  });

  it('penalizes low average ratings proportionally', () => {
    const lowPlaceScore = RankingService.calculateWeightedRating(2.0, 10, globalAverageC, thresholdM);
    const highPlaceScore = RankingService.calculateWeightedRating(4.5, 10, globalAverageC, thresholdM);

    expect(lowPlaceScore).toBeLessThan(highPlaceScore);
    expect(lowPlaceScore).toBeLessThan(globalAverageC);
  });

  it('computes complete stats bundle via computeStats', () => {
    const ratings = [5, 5, 4, 5, 4]; // avg = 4.6, count = 5
    const stats = RankingService.computeStats(ratings, globalAverageC, thresholdM);

    expect(stats.reviewCount).toBe(5);
    expect(stats.averageRating).toBe(4.6);
    // WR = (5 / 10) * 4.6 + (5 / 10) * 3.5 = 2.3 + 1.75 = 4.05
    expect(stats.weightedRating).toBe(4.05);
  });

  it('predictably ranks items by weighted rating and breaks ties by review count', () => {
    const places = [
      { id: '1', name: 'Place 1', weightedRating: 4.2, reviewCount: 10 },
      { id: '2', name: 'Place 2', weightedRating: 4.5, reviewCount: 5 },
      { id: '3', name: 'Place 3', weightedRating: 4.2, reviewCount: 20 },
      { id: '4', name: 'Place 4', weightedRating: 3.8, reviewCount: 15 },
    ];

    const sorted = [...places].sort((a, b) => {
      if (b.weightedRating !== a.weightedRating) {
        return b.weightedRating - a.weightedRating;
      }
      return b.reviewCount - a.reviewCount;
    });

    expect(sorted.map((p) => p.id)).toEqual(['2', '3', '1', '4']);
  });
});
