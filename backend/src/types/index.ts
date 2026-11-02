export type { User, Place, Review, TourSlot, Booking, PlaceCategory } from '@prisma/client';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

export interface TourSlotAvailability {
  slotId: string;
  totalCapacity: number;
  bookedSeats: number;
  availableSeats: number;
}

