export type { User, Place, Review, TourSlot, Booking } from '@prisma/client';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TourSlotAvailability {
  tourSlotId: string;
  totalCapacity: number;
  bookedSeats: number;
  availableSeats: number;
}

