import { describe, it, expect } from 'vitest';
import { RankingService } from '../src/services/ranking.service';

describe('RankingService', () => {
  it('calculates average score correctly for basic ratings', () => {
    const ratings = [5, 4, 3, 4];
    const score = RankingService.calculateScore(ratings);
    expect(score).toBe(4);
  });

  it('returns 0 when no ratings are provided', () => {
    const score = RankingService.calculateScore([]);
    expect(score).toBe(0);
  });
});

