'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, ApiClientError } from '../../../lib/api';
import type { PlaceDetail, PlaceDetailTourSlot, ReviewSubmissionResult } from '../../../types';
import { PlaceDetailsHeader } from '../../../components/places/PlaceDetailsHeader';
import { TourSlotList } from '../../../components/tours/TourSlotList';
import { BookingModal } from '../../../components/tours/BookingModal';
import { ReviewList } from '../../../components/reviews/ReviewList';
import { ReviewForm } from '../../../components/reviews/ReviewForm';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button } from '../../../components/ui/Button';
import { useUser } from '../../../context/UserContext';
import {
  CalendarIcon,
  StarIcon,
  CompassIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from '../../../components/ui/Icons';

export default function PlaceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { currentUser } = useUser();

  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  // Selected tour slot for booking modal
  const [selectedSlot, setSelectedSlot] = useState<PlaceDetailTourSlot | null>(null);

  // Fetch destination with async callback pattern
  useEffect(() => {
    if (!id) return;
    let active = true;

    api
      .getPlaceById(id)
      .then((data) => {
        if (!active) return;
        setPlace(data);
        setError(null);
        setIsNotFound(false);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof ApiClientError && err.status === 404) {
          setIsNotFound(true);
        } else {
          const msg = err instanceof Error ? err.message : 'Failed to retrieve destination details';
          setError(msg);
        }
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleRetry = () => {
    if (!id) return;
    setIsLoading(true);
    api
      .getPlaceById(id)
      .then((data) => {
        setPlace(data);
        setError(null);
        setIsNotFound(false);
      })
      .catch((err: unknown) => {
        if (err instanceof ApiClientError && err.status === 404) {
          setIsNotFound(true);
        } else {
          const msg = err instanceof Error ? err.message : 'Failed to retrieve destination details';
          setError(msg);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Callback when review is submitted or updated
  const handleReviewSubmitted = (result: ReviewSubmissionResult) => {
    if (!place) return;

    // Update reviews array (upsert)
    const existingIndex = place.reviews.findIndex((r) => r.id === result.review.id);
    let updatedReviews = [...place.reviews];

    if (existingIndex >= 0) {
      updatedReviews[existingIndex] = result.review;
    } else {
      updatedReviews = [result.review, ...updatedReviews];
    }

    setPlace({
      ...place,
      averageRating: result.placeStats.averageRating,
      reviewCount: result.placeStats.reviewCount,
      weightedRating: result.placeStats.weightedRating,
      reviews: updatedReviews,
    });
  };

  // Callback when tour booking succeeds
  const handleBookingSuccess = () => {
    // Re-fetch fresh place data to refresh slot capacity and availability dynamically
    handleRetry();
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="w-full h-96 rounded-3xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="w-full h-48 rounded-2xl" />
            <Skeleton className="w-full h-64 rounded-2xl" />
          </div>
          <div>
            <Skeleton className="w-full h-72 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (isNotFound) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <EmptyState
          icon={<CompassIcon className="w-8 h-8 text-[#163D32]" />}
          title="Destination Not Found"
          description="The destination you are looking for does not exist or may have been removed."
          actionLabel="Return to Destinations"
          onAction={() => router.push('/')}
        />
      </main>
    );
  }

  if (error || !place) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20">
        <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center">
          <h3 className="font-serif text-2xl font-bold text-rose-900 mb-2">
            Failed to Load Destination
          </h3>
          <p className="text-sm text-rose-700 mb-6 max-w-md mx-auto">{error}</p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push('/')}>
              Back to Home
            </Button>
            <Button variant="primary" size="sm" onClick={handleRetry}>
              <RefreshCwIcon className="w-4 h-4 mr-1.5" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in duration-300">
      {/* 1. Destination Editorial Header */}
      <PlaceDetailsHeader place={place} />

      {/* 2. Upcoming Tours & Booking Section */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#163D32] mb-1">
              <CalendarIcon className="w-3.5 h-3.5 text-[#163D32]" />
              Guided Tours & Experiences
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252A27]">
              Available Tour Slots
            </h2>
            <p className="text-xs text-[#777D78] mt-1">
              Reserve your guided experience with instant confirmation and guaranteed seat availability.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#163D32] bg-[#163D32]/10 px-3 py-1.5 rounded-xl border border-[#163D32]/20 font-medium">
            <ShieldCheckIcon className="w-4 h-4 shrink-0" />
            <span>Guaranteed departures</span>
          </div>
        </div>

        {/* Tour Slot Grid */}
        <TourSlotList
          slots={place.tourSlots}
          onBookSlot={(slot) => setSelectedSlot(slot)}
        />
      </section>

      {/* 3. Verified Reviews & Feedback Section */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EDE9DF]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#163D32] mb-1">
              <StarIcon className="w-3.5 h-3.5 text-amber-500" />
              Community Feedback
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#252A27]">
              Traveler Reviews ({place.reviews.length})
            </h2>
          </div>

          <div className="text-right">
            <span className="font-serif text-3xl font-bold text-[#252A27]">
              {place.averageRating > 0 ? place.averageRating.toFixed(1) : '—'}
            </span>
            <span className="text-xs text-[#777D78] block">Overall Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Review Submission Form Column */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="sticky top-24">
              <ReviewForm
                key={`${currentUser?.id || 'guest'}-${place.id}`}
                placeId={place.id}
                placeName={place.name}
                existingReviews={place.reviews}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
          </div>

          {/* Chronological Review List Column */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <ReviewList
              reviews={place.reviews}
              currentUserId={currentUser?.id}
            />
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          placeName={place.name}
          isOpen={Boolean(selectedSlot)}
          onClose={() => setSelectedSlot(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </main>
  );
}
