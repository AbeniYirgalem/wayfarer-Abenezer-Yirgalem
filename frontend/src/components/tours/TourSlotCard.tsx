import React from 'react';
import type { PlaceDetailTourSlot } from '../../types';
import { CalendarIcon, ClockIcon, UsersIcon } from '../ui/Icons';
import { Button } from '../ui/Button';
import { formatDate, formatTime, cn } from '../../lib/utils';

interface TourSlotCardProps {
  slot: PlaceDetailTourSlot;
  onBookClick: (slot: PlaceDetailTourSlot) => void;
}

export function TourSlotCard({ slot, onBookClick }: TourSlotCardProps) {
  const isFull = slot.availableSeats <= 0;

  return (
    <div
      className={cn(
        'p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between h-full bg-white',
        isFull
          ? 'border-[#EDE9DF] bg-[#F8F7F3]/70 opacity-80'
          : 'border-[#EDE9DF] hover:border-[#163D32]/40 hover:shadow-sm'
      )}
    >
      <div>
        {/* Date and Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#163D32]">
            <CalendarIcon className="w-4 h-4" />
            <span>{formatDate(slot.startsAt)}</span>
          </div>

          <span
            className={cn(
              'px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
              isFull
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : slot.availableSeats <= 3
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            )}
          >
            {isFull
              ? 'Fully Booked'
              : `${slot.availableSeats} of ${slot.capacity} seats left`}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 text-xs text-[#777D78] mb-4">
          <ClockIcon className="w-3.5 h-3.5" />
          <span>Starts at {formatTime(slot.startsAt)}</span>
        </div>

        {/* Seat Bar visualization */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] text-[#777D78] mb-1.5">
            <span className="flex items-center gap-1">
              <UsersIcon className="w-3 h-3 text-[#163D32]" />
              <span>Booked capacity</span>
            </span>
            <span>
              {slot.totalBookedSeats} / {slot.capacity}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#EDE9DF] overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-300 rounded-full',
                isFull
                  ? 'bg-rose-500'
                  : slot.availableSeats <= 3
                  ? 'bg-amber-500'
                  : 'bg-[#163D32]'
              )}
              style={{
                width: `${Math.min(100, (slot.totalBookedSeats / slot.capacity) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Booking Action */}
      <Button
        variant={isFull ? 'outline' : 'primary'}
        size="sm"
        disabled={isFull}
        onClick={() => onBookClick(slot)}
        className="w-full mt-2"
      >
        {isFull ? 'Sold Out' : 'Reserve Seats'}
      </Button>
    </div>
  );
}

export default TourSlotCard;
