'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { PlaceDetail } from '../../types';
import { PlaceRating } from './PlaceRating';
import { MapPinIcon, ClockIcon, CompassIcon, ShieldCheckIcon } from '../ui/Icons';
import { CATEGORY_INFO } from '../../lib/utils';

interface PlaceDetailsHeaderProps {
  place: PlaceDetail;
}

export function PlaceDetailsHeader({ place }: PlaceDetailsHeaderProps) {
  const [imgError, setImgError] = useState(false);
  const categoryMeta = CATEGORY_INFO[place.category];

  return (
    <section className="bg-white rounded-3xl border border-[#EDE9DF] overflow-hidden shadow-sm mb-12">
      {/* Breadcrumb Navigation */}
      <div className="px-6 py-4 bg-[#F8F7F3] border-b border-[#EDE9DF] flex items-center gap-2 text-xs text-[#777D78]">
        <Link href="/" className="hover:text-[#163D32] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/#explore" className="hover:text-[#163D32] transition-colors">
          Explore Places
        </Link>
        <span>/</span>
        <span className="font-semibold text-[#252A27] truncate">{place.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Destination Editorial Photo */}
        <div
          className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] lg:min-h-[480px] max-h-[520px] w-full bg-[#EDE9DF] overflow-hidden"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {place.imageUrl && !imgError ? (
            <Image
              src={place.imageUrl}
              alt={place.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover w-full h-full"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full min-h-[340px] flex flex-col items-center justify-center bg-[#EDE9DF] text-[#777D78] p-8">
              <CompassIcon className="w-12 h-12 mb-3 text-[#163D32] opacity-40" />
              <p className="text-sm font-medium">Addis Ababa Landmark</p>
            </div>
          )}

          {/* Floating Category Pill */}
          <div className="absolute top-5 left-5 z-10">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs ${categoryMeta.badgeClass}`}
            >
              {categoryMeta.label}
            </span>
          </div>
        </div>

        {/* Destination Information Column */}
        <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
          <div>
            {/* Rating Summary */}
            <div className="mb-4">
              <PlaceRating
                averageRating={place.averageRating}
                reviewCount={place.reviewCount}
                weightedRating={place.weightedRating}
                size="md"
              />
            </div>

            {/* Place Heading */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#252A27] tracking-tight leading-tight mb-4">
              {place.name}
            </h1>

            {/* Meta Information: Address & Hours */}
            <div className="space-y-2.5 mb-6 text-xs text-[#777D78] border-y border-[#EDE9DF] py-4">
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 text-[#163D32] shrink-0 mt-0.5" />
                <span className="text-[#252A27] leading-relaxed">{place.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-[#163D32] shrink-0" />
                <span className="text-[#252A27] font-medium">{place.openingHours}</span>
              </div>
            </div>

            {/* Editorial Description */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#777D78] mb-2">
                About this Destination
              </h3>
              <p className="text-sm text-[#252A27] leading-relaxed whitespace-pre-line">
                {place.description}
              </p>
            </div>
          </div>

          {/* Bayesian Rating Explainer Box */}
          <div className="p-4 rounded-2xl bg-[#F8F7F3] border border-[#EDE9DF]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#163D32] mb-1">
              <ShieldCheckIcon className="w-4 h-4 text-[#163D32]" />
              <span>Honest Rating Transparency</span>
            </div>
            <p className="text-[11px] text-[#777D78] leading-relaxed">
              Wayfarer calculates an honest ranking score ({place.weightedRating.toFixed(2)}) using
              Bayesian statistical smoothing, preventing 1-review outliers from manipulating rankings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlaceDetailsHeader;
