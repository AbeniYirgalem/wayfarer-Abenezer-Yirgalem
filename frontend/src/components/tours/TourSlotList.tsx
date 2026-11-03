import React from 'react';
import type { PlaceDetailTourSlot } from '../../types';
import { TourSlotCard } from './TourSlotCard';
import { EmptyState } from '../ui/EmptyState';
import { CalendarIcon } from '../ui/Icons';

interface TourSlotListProps {
  slots: PlaceDetailTourSlot[];
  onBookSlot: (slot: PlaceDetailTourSlot) => void;
}

export function TourSlotList({ slots, onBookSlot }: TourSlotListProps) {
  if (slots.length === 0) {
    return (
      <EmptyState
        icon={<CalendarIcon className="w-6 h-6 text-[#163D32]" />}
        title="No upcoming tours scheduled"
        description="There are currently no scheduled future tour slots for this destination. Check back soon for new departures."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {slots.map((slot) => (
        <TourSlotCard key={slot.id} slot={slot} onBookClick={onBookSlot} />
      ))}
    </div>
  );
}

export default TourSlotList;
