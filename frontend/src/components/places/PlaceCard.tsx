'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PlaceListItem } from '../../types';
import { PlaceRating } from './PlaceRating';
import { MapPinIcon, ArrowRightIcon, CompassIcon } from '../ui/Icons';
import { CATEGORY_INFO } from '../../lib/utils';

interface PlaceCardProps {
  place: PlaceListItem;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const [imgError, setImgError] = useState(false);
  const categoryMeta = CATEGORY_INFO[place.category];

  return (
    <article className="group bg-white rounded-2xl border border-[#EDE9DF] overflow-hidden shadow-sm hover:shadow-md hover:border-[#D6D2C4] transition-all duration-300 flex flex-col h-full">
      {/* Destination Image Container */}
      <Link
        href={`/places/${place.id}`}
        className="relative block h-56 w-full overflow-hidden bg-[#EDE9DF]"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {place.imageUrl && !imgError ? (
          <Image
            src={place.imageUrl}
            alt={place.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#EDE9DF] text-[#777D78]">
            <CompassIcon className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-xs font-medium">Addis Ababa Destination</span>
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs ${categoryMeta.badgeClass}`}
          >
            {categoryMeta.label}
          </span>
        </div>
      </Link>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Rating Row */}
        <div className="mb-2">
          <PlaceRating
            averageRating={place.averageRating}
            reviewCount={place.reviewCount}
            weightedRating={place.weightedRating}
            size="sm"
          />
        </div>

        {/* Place Title */}
        <h3 className="font-serif text-lg font-bold text-[#252A27] group-hover:text-[#163D32] transition-colors line-clamp-1 mb-1.5">
          <Link href={`/places/${place.id}`}>{place.name}</Link>
        </h3>

        {/* Address / Location */}
        <div className="flex items-center gap-1.5 text-xs text-[#777D78] mb-3">
          <MapPinIcon className="w-3.5 h-3.5 shrink-0 text-[#163D32]" />
          <span className="truncate">{place.address}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#777D78] leading-relaxed line-clamp-2 mb-4">
          {place.description}
        </p>

        {/* Card Footer / Action */}
        <div className="pt-3 border-t border-[#EDE9DF]/80 mt-auto flex items-center justify-between">
          <span className="text-xs text-[#777D78] font-mono">
            {place.openingHours.split(';')[0]}
          </span>
          <Link
            href={`/places/${place.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#163D32] hover:text-[#1D4D40] group-hover:translate-x-0.5 transition-all"
          >
            <span>View Place</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PlaceCard;
