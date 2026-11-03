import { PlaceCategory } from '../types';

/**
 * Clean class name utility (no external clsx/tailwind-merge needed)
 */
export function cn(...classes: Array<string | boolean | undefined | null>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format ISO date string to human-readable date (e.g., Nov 24, 2026)
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format ISO date string to time (e.g., 10:00 AM)
 */
export function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return '';
  }
}

/**
 * Category metadata for badges and visual identifiers
 */
export const CATEGORY_INFO: Record<
  PlaceCategory,
  { label: string; badgeClass: string; iconName: string }
> = {
  HISTORY: {
    label: 'History & Heritage',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    iconName: 'landmark',
  },
  FOOD: {
    label: 'Food & Dining',
    badgeClass: 'bg-orange-100 text-orange-900 border-orange-200',
    iconName: 'utensils',
  },
  NATURE: {
    label: 'Nature & Parks',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    iconName: 'trees',
  },
  CULTURE: {
    label: 'Art & Culture',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    iconName: 'compass',
  },
  ENTERTAINMENT: {
    label: 'Entertainment & Music',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-200',
    iconName: 'ticket',
  },
};
