'use client';

import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { api, ApiClientError } from '../../lib/api';
import type { PlaceDetailReview, ReviewSubmissionResult } from '../../types';
import { StarIcon, AlertCircleIcon, CheckIcon, UserIcon } from '../ui/Icons';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface ReviewFormProps {
  placeId: string;
  placeName: string;
  existingReviews: PlaceDetailReview[];
  onReviewSubmitted: (result: ReviewSubmissionResult) => void;
}

export function ReviewForm({
  placeId,
  placeName,
  existingReviews,
  onReviewSubmitted,
}: ReviewFormProps) {
  const { currentUser } = useUser();

  // Find if current user already reviewed this place
  const userExistingReview = currentUser
    ? existingReviews.find((r) => r.userId === currentUser.id)
    : undefined;

  const [rating, setRating] = useState<number>(userExistingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [body, setBody] = useState<string>(userExistingReview?.body || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setServerError(null);
    setSuccessMessage(null);

    if (!currentUser) {
      setValidationError('Please select a traveler profile in the navigation bar first.');
      return;
    }

    const trimmedBody = body.trim();

    if (trimmedBody.length > 500) {
      setValidationError('Review feedback must be 500 characters or less.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setValidationError('Please select a star rating between 1 and 5.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api.submitReview(
        placeId,
        {
          rating,
          body: trimmedBody.length > 0 ? trimmedBody : null,
        },
        currentUser.id
      );

      const msg = result.isNew
        ? 'Thank you! Your verified review has been published.'
        : 'Your review was updated successfully.';

      setSuccessMessage(msg);
      onReviewSubmitted(result);

      // Auto-dismiss success after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setServerError(err.message);
      } else {
        setServerError('An unexpected error occurred while saving your review.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE9DF] p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#EDE9DF]">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#252A27]">
            {userExistingReview ? 'Update Your Review' : 'Write a Verified Review'}
          </h3>
          <p className="text-xs text-[#777D78] mt-0.5">
            Share your experience at {placeName}. Honest ratings shape fair rankings.
          </p>
        </div>

        {/* Identity Badge */}
        {currentUser ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8F7F3] border border-[#EDE9DF] text-xs">
            <div className="w-5 h-5 rounded-full bg-[#163D32] text-white flex items-center justify-center font-bold text-[10px]">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-[#252A27]">{currentUser.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <UserIcon className="w-4 h-4" />
            <span>No user selected</span>
          </div>
        )}
      </div>

      {/* Warning if no user selected */}
      {!currentUser && (
        <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircleIcon className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
          <div>
            <p className="font-semibold">Traveler profile required</p>
            <p className="mt-0.5 text-amber-800">
              Please choose a traveler profile from the user menu in the navigation bar to submit a review.
            </p>
          </div>
        </div>
      )}

      {/* Existing review notice */}
      {userExistingReview && (
        <div className="mb-5 p-3 rounded-xl bg-[#163D32]/5 border border-[#163D32]/20 text-xs text-[#163D32] flex items-center gap-2">
          <CheckIcon className="w-4 h-4 shrink-0 text-[#163D32]" />
          <span>
            You previously reviewed this destination. Submitting will update your existing rating and text.
          </span>
        </div>
      )}

      {/* Success alert */}
      {successMessage && (
        <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Server error */}
      {serverError && (
        <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2.5">
          <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star Rating Picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#777D78] mb-2">
            Your Rating
          </label>
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating ?? rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  disabled={!currentUser || isSubmitting}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 rounded-lg hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#163D32] disabled:hover:scale-100 disabled:opacity-50"
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                  <StarIcon
                    fill={active ? '#F59E0B' : 'transparent'}
                    className={cn(
                      'w-7 h-7 transition-colors',
                      active ? 'text-amber-500' : 'text-[#D6D2C4]'
                    )}
                  />
                </button>
              );
            })}
            <span className="text-xs font-semibold text-[#252A27] ml-2">
              {rating} of 5 Stars
            </span>
          </div>
        </div>

        {/* Review Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="review-body"
              className="block text-xs font-semibold uppercase tracking-wider text-[#777D78]"
            >
              Your Feedback <span className="font-normal lowercase text-[#777D78]/70">(optional)</span>
            </label>
            <span
              className={cn(
                'text-xs font-mono',
                body.length > 500 ? 'text-rose-600 font-bold' : 'text-[#777D78]'
              )}
            >
              {body.length} / 500
            </span>
          </div>
          <textarea
            id="review-body"
            disabled={!currentUser || isSubmitting}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Share details of your experience (optional)..."
            className={cn(
              'w-full px-3.5 py-2.5 text-sm bg-[#F8F7F3] border rounded-xl text-[#252A27] placeholder:text-[#777D78]/60 transition-colors resize-y min-h-[100px]',
              'focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163D32]/20 focus:border-[#163D32]',
              validationError
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-[#D6D2C4] hover:border-[#B5B0A1]',
              !currentUser && 'opacity-60 cursor-not-allowed'
            )}
          />
          {validationError && (
            <p className="mt-1 text-xs text-rose-600">{validationError}</p>
          )}
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!currentUser || isSubmitting}
            isLoading={isSubmitting}
          >
            {userExistingReview ? 'Update Review' : 'Publish Review'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
