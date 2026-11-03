import React from 'react';
import type { PlaceDetailReview } from '../../types';
import { ReviewCard } from './ReviewCard';
import { EmptyState } from '../ui/EmptyState';
import { StarIcon } from '../ui/Icons';

interface ReviewListProps {
  reviews: PlaceDetailReview[];
  currentUserId?: string;
}

export function ReviewList({ reviews, currentUserId }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={<StarIcon className="w-6 h-6 text-amber-500" />}
        title="No traveler reviews yet"
        description="Be the first verified explorer to share your authentic experience and help fellow travelers."
      />
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          isCurrentUser={currentUserId ? review.userId === currentUserId : false}
        />
      ))}
    </div>
  );
}

export default ReviewList;
