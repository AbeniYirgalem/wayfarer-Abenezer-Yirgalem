'use client';

import React from 'react';
import Image from 'next/image';
import { SearchIcon, ShieldCheckIcon, ArrowRightIcon } from '../ui/Icons';
import { Button } from '../ui/Button';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onExploreClick: () => void;
}

export function HeroSection({
  searchQuery,
  onSearchChange,
  onExploreClick,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[540px] md:min-h-[620px] flex items-center justify-center overflow-hidden bg-[#163D32]">
      {/* Background Photography with atmospheric overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=80"
          alt="Addis Ababa landmark cathedral"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#163D32] via-[#163D32]/60 to-[#163D32]/80" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Value Prop Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <ShieldCheckIcon className="w-4 h-4" />
          <span>Honest Ratings · Fair Bookings</span>
        </div>

        {/* Editorial Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
          Discover places worth experiencing.
        </h1>

        {/* Editorial Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/80 leading-relaxed mb-10">
          Explore the vibrant culture, history, and landscapes of Addis Ababa without misleading
          reviews or overbooked tours. Powered by authentic Bayesian rankings and real-time seat guarantees.
        </p>

        {/* Hero Interactive Search Bar */}
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/30 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 flex items-center pl-3.5 pr-2">
            <SearchIcon className="w-5 h-5 text-[#777D78] shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search museums, restaurants, parks, or landmarks..."
              className="w-full h-11 text-sm bg-transparent text-[#252A27] placeholder:text-[#777D78] focus:outline-none"
            />
          </div>
          <Button
            size="md"
            variant="primary"
            onClick={onExploreClick}
            className="w-full sm:w-auto shadow-md"
          >
            <span>Explore Places</span>
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Quick Highlights */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/70">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            5 Diverse Categories
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Bayesian Weighted Ratings
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Zero Overbooking Guarantee
          </span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
