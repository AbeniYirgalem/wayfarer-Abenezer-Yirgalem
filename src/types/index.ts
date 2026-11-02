export type { User, Place, Review, TourSlot, Booking, PlaceCategory } from '@prisma/client';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TourSlotAvailability {
  slotId: string;
  totalCapacity: number;
  bookedSeats: number;
  availableSeats: number;
}
