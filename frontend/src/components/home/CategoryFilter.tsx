'use client';

import React from 'react';
import type { PlaceCategory } from '../../types';
import {
  CompassIcon,
  LandmarkIcon,
  UtensilsIcon,
  TreesIcon,
  TicketIcon,
} from '../ui/Icons';
import { cn } from '../../lib/utils';

export type CategoryFilterValue = 'ALL' | PlaceCategory;

interface CategoryFilterProps {
  selectedCategory: CategoryFilterValue;
  onSelectCategory: (category: CategoryFilterValue) => void;
}

const CATEGORIES: Array<{
  value: CategoryFilterValue;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'ALL',
    label: 'All Destinations',
    icon: <CompassIcon className="w-4 h-4" />,
  },
  {
    value: 'HISTORY',
    label: 'History & Heritage',
    icon: <LandmarkIcon className="w-4 h-4" />,
  },
  {
    value: 'FOOD',
    label: 'Food & Dining',
    icon: <UtensilsIcon className="w-4 h-4" />,
  },
  {
    value: 'NATURE',
    label: 'Nature & Parks',
    icon: <TreesIcon className="w-4 h-4" />,
  },
  {
    value: 'CULTURE',
    label: 'Art & Culture',
    icon: <CompassIcon className="w-4 h-4" />,
  },
  {
    value: 'ENTERTAINMENT',
    label: 'Entertainment',
    icon: <TicketIcon className="w-4 h-4" />,
  },
];

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2.5 min-w-max">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onSelectCategory(cat.value)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border select-none',
                isActive
                  ? 'bg-[#163D32] text-white border-[#163D32] shadow-sm'
                  : 'bg-white text-[#252A27] border-[#EDE9DF] hover:border-[#D6D2C4] hover:bg-[#F8F7F3]'
              )}
            >
              <span className={isActive ? 'text-emerald-300' : 'text-[#163D32]'}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryFilter;
