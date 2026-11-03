import React from 'react';
import { StarIcon } from '../ui/Icons';
import { cn } from '../../lib/utils';

interface PlaceRatingProps {
  averageRating: number;
  reviewCount: number;
  weightedRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export function PlaceRating({
  averageRating,
  reviewCount,
  weightedRating,
  size = 'md',
  showDetails = true,
  className,
}: PlaceRatingProps) {
  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base font-semibold',
  };

  const roundedAverage = Math.round(averageRating * 10) / 10;

  return (
    <div className={cn('flex items-center gap-1.5 flex-wrap', className)}>
      {/* 5-Star Row */}
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const filled = starIndex <= Math.round(averageRating);
          return (
            <StarIcon
              key={starIndex}
              fill={filled ? '#F59E0B' : 'transparent'}
              className={cn(starSizes[size], filled ? 'text-amber-500' : 'text-amber-300/60')}
            />
          );
        })}
      </div>

      {/* Numeric score and count */}
      {showDetails && (
        <div className="flex items-center gap-1">
          <span className={cn('font-bold text-[#252A27]', textSizes[size])}>
            {reviewCount > 0 ? roundedAverage.toFixed(1) : 'No reviews'}
          </span>

          {reviewCount > 0 && (
            <span className="text-xs text-[#777D78]">
              ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          )}
        </div>
      )}

      {/* Bayesian Weighted Rating Badge (if provided) */}
      {weightedRating !== undefined && reviewCount > 0 && (
        <span
          title={`Bayesian Weighted Score (${weightedRating.toFixed(2)}): Corrected for small sample sizes to eliminate review manipulation.`}
          className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#163D32]/10 text-[#163D32] border border-[#163D32]/20 cursor-help ml-1"
        >
          ★ {weightedRating.toFixed(2)} Honest Rank
        </span>
      )}
    </div>
  );
}

export default PlaceRating;
