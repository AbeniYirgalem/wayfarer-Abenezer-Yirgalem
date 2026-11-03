'use client';

import React from 'react';
import type { PlaceListItem } from '../../types';
import { CategoryFilter, CategoryFilterValue } from './CategoryFilter';
import { PlaceGrid } from '../places/PlaceGrid';
import { SparklesIcon, FilterIcon, RefreshCwIcon, XIcon } from '../ui/Icons';
import { cn } from '../../lib/utils';

interface FeaturedPlacesProps {
  places: PlaceListItem[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: CategoryFilterValue;
  onSelectCategory: (cat: CategoryFilterValue) => void;
  isTopRated: boolean;
  onToggleTopRated: () => void;
  searchQuery: string;
  onResetFilters: () => void;
  onRetry: () => void;
}

export function FeaturedPlaces({
  places,
  isLoading,
  error,
  selectedCategory,
  onSelectCategory,
  isTopRated,
  onToggleTopRated,
  searchQuery,
  onResetFilters,
  onRetry,
}: FeaturedPlacesProps) {
  const hasActiveFilters =
    selectedCategory !== 'ALL' || isTopRated || searchQuery.trim().length > 0;

  return (
    <section id="explore" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#163D32] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#163D32]" />
            Curated Destinations
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#252A27] tracking-tight">
            Explore Addis Ababa
          </h2>
          <p className="text-sm text-[#777D78] mt-2 max-w-xl">
            Authentic historical landmarks, culinary gems, mountain vistas, and cultural hotspots —
            ranked fairly using Bayesian statistical smoothing to prevent rating fraud.
          </p>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center gap-3">
          {/* Top-Rated Toggle */}
          <button
            type="button"
            onClick={onToggleTopRated}
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 shadow-xs',
              isTopRated
                ? 'bg-[#163D32] text-white border-[#163D32]'
                : 'bg-white text-[#252A27] border-[#EDE9DF] hover:border-[#D6D2C4] hover:bg-[#F8F7F3]'
            )}
            title="Sort places using Bayesian weighted formula: WR = (v / (v+5))*R + (5 / (v+5))*C"
          >
            <SparklesIcon className={cn('w-4 h-4', isTopRated ? 'text-amber-300' : 'text-amber-500')} />
            <span>Top Rated (Honest)</span>
          </button>

          {/* Reset Filters (when active) */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#777D78] hover:text-[#252A27] hover:bg-[#EDE9DF] border border-transparent transition-colors"
            >
              <XIcon className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs Filter */}
      <div className="mb-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>

      {/* Filter Stats Bar */}
      <div className="flex items-center justify-between text-xs text-[#777D78] mb-6 pb-4 border-b border-[#EDE9DF]">
        <div className="flex items-center gap-2">
          <FilterIcon className="w-3.5 h-3.5 text-[#163D32]" />
          <span>
            {isLoading
              ? 'Loading destinations...'
              : `Showing ${places.length} ${places.length === 1 ? 'place' : 'places'}`}
          </span>
          {searchQuery && (
            <span className="font-medium text-[#252A27]">
              matching &ldquo;{searchQuery}&rdquo;
            </span>
          )}
          {isTopRated && (
            <span className="text-[#163D32] font-semibold bg-[#163D32]/10 px-2 py-0.5 rounded-md text-[11px]">
              Sorted by Bayesian Weight
            </span>
          )}
        </div>
      </div>

      {/* Error State with Retry */}
      {error && !isLoading && (
        <div className="p-6 mb-8 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-sm">Failed to retrieve destinations</h4>
            <p className="text-xs text-rose-600 mt-1">{error}</p>
          </div>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition-colors shrink-0"
          >
            <RefreshCwIcon className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Places Grid */}
      <PlaceGrid
        places={places}
        isLoading={isLoading}
        onResetFilters={hasActiveFilters ? onResetFilters : undefined}
      />
    </section>
  );
}

export default FeaturedPlaces;
