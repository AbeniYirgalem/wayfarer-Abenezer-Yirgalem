import React from 'react';
import type { PlaceListItem } from '../../types';
import { PlaceCard } from './PlaceCard';
import { PlaceCardSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { SearchIcon } from '../ui/Icons';

interface PlaceGridProps {
  places: PlaceListItem[];
  isLoading: boolean;
  onResetFilters?: () => void;
}

export function PlaceGrid({ places, isLoading, onResetFilters }: PlaceGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <PlaceCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <EmptyState
        icon={<SearchIcon className="w-7 h-7 text-[#163D32]" />}
        title="No matching destinations found"
        description="Try adjusting your category filter, changing your search terms, or resetting to browse all places."
        actionLabel={onResetFilters ? 'Clear all filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}

export default PlaceGrid;
