export type PlaceCategory = 'HISTORY' | 'FOOD' | 'NATURE' | 'CULTURE' | 'ENTERTAINMENT';

export interface User {
  id: string;
  name: string;
  createdAt: string;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  openingHours: string;
  imageUrl?: string | null;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  rating: number;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface TourSlot {
  id: string;
  placeId: string;
  startsAt: string;
  capacity: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  slotId: string;
  userId: string;
  seats: number;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

export interface HealthCheckResponse {
  success: boolean;
  message: string;
}

