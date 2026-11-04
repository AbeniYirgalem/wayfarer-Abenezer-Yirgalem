'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { PlaceListItem } from '../types';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedPlaces } from '../components/home/FeaturedPlaces';
import type { CategoryFilterValue } from '../components/home/CategoryFilter';

export default function HomePage() {
  const [places, setPlaces] = useState<PlaceListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterValue>('ALL');
  const [isTopRated, setIsTopRated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch places with asynchronous callback pattern for React 19 compliance
  useEffect(() => {
    let active = true;

    api
      .getPlaces({
        category: selectedCategory === 'ALL' ? undefined : selectedCategory,
        sort: isTopRated ? 'top-rated' : undefined,
        search: debouncedSearch.trim() || undefined,
      })
      .then((data) => {
        if (!active) return;
        setPlaces(data);
        setError(null);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'Failed to retrieve places. Please try again.';
        setError(message);
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCategory, isTopRated, debouncedSearch]);

  const handleRetry = () => {
    setIsLoading(true);
    api
      .getPlaces({
        category: selectedCategory === 'ALL' ? undefined : selectedCategory,
        sort: isTopRated ? 'top-rated' : undefined,
        search: debouncedSearch.trim() || undefined,
      })
      .then((data) => {
        setPlaces(data);
        setError(null);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to retrieve places. Please try again.';
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handlers
  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setIsTopRated(false);
    setSearchQuery('');
    setDebouncedSearch('');
  };

  const scrollToExplore = () => {
    const el = document.getElementById('explore');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExploreClick={scrollToExplore}
      />

      {/* 2. Destination Discovery & Filtering */}
      <FeaturedPlaces
        places={places}
        isLoading={isLoading}
        error={error}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isTopRated={isTopRated}
        onToggleTopRated={() => setIsTopRated((prev) => !prev)}
        searchQuery={searchQuery}
        onResetFilters={handleResetFilters}
        onRetry={handleRetry}
      />
    </div>
  );
}
