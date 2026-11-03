import React from 'react';
import type { PlaceDetailReview } from '../../types';
import { StarIcon } from '../ui/Icons';
import { formatDate, cn } from '../../lib/utils';

interface ReviewCardProps {
  review: PlaceDetailReview;
  isCurrentUser?: boolean;
}

export function ReviewCard({ review, isCurrentUser = false }: ReviewCardProps) {
  const initial = review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U';

  return (
    <article
      className={cn(
        'p-5 rounded-2xl border transition-all duration-200 bg-white',
        isCurrentUser
          ? 'border-[#163D32]/40 bg-[#163D32]/5 shadow-xs'
          : 'border-[#EDE9DF] hover:border-[#D6D2C4]'
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0',
              isCurrentUser
                ? 'bg-[#163D32] text-white'
                : 'bg-[#EDE9DF] text-[#252A27]'
            )}
          >
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-[#252A27]">
                {review.user?.name || 'Verified Traveler'}
              </h4>
              {isCurrentUser && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#163D32] text-white">
                  You
                </span>
              )}
            </div>
            <p className="text-xs text-[#777D78]">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center text-amber-500">
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon
              key={s}
              fill={s <= review.rating ? '#F59E0B' : 'transparent'}
              className={cn('w-4 h-4', s <= review.rating ? 'text-amber-500' : 'text-amber-200')}
            />
          ))}
        </div>
      </div>

      {/* Review Body */}
      <p className="text-sm text-[#252A27] leading-relaxed whitespace-pre-line">
        {review.body}
      </p>
    </article>
  );
}

export default ReviewCard;
