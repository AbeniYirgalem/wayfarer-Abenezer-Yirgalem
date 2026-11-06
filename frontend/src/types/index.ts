export type PlaceCategory = 'HISTORY' | 'FOOD' | 'NATURE' | 'CULTURE' | 'ENTERTAINMENT';

export interface User {
  id: string;
  name: string;
  createdAt: string;
}

export interface PlaceListItem {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  openingHours: string;
  imageUrl: string | null;
  address: string;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  reviewCount: number;
  weightedRating: number;
}

export interface PlaceDetailReview {
  id: string;
  placeId: string;
  userId: string;
  rating: number;
  body: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
}

export interface PlaceDetailTourSlot {
  id: string;
  placeId: string;
  startsAt: string;
  capacity: number;
  totalBookedSeats: number;
  availableSeats: number;
}

export interface PlaceDetail extends PlaceListItem {
  reviews: PlaceDetailReview[];
  tourSlots: PlaceDetailTourSlot[];
}

export interface ReviewSubmissionResult {
  isNew: boolean;
  review: PlaceDetailReview;
  placeStats: {
    averageRating: number;
    reviewCount: number;
    weightedRating: number;
  };
}

export interface TourSlotAvailability {
  id: string;
  placeId: string;
  place: {
    id: string;
    name: string;
    address: string;
    imageUrl: string | null;
    category: PlaceCategory;
  };
  startsAt: string;
  capacity: number;
  totalBookedSeats: number;
  availableSeats: number;
}

export interface BookingResult {
  bookingId: string;
  slotId: string;
  seats: number;
  remainingSeats: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  error?: {
    message: string;
    errors?: string[];
  };
}

export interface GetPlacesFilterOptions {
  category?: PlaceCategory | 'ALL';
  sort?: 'top-rated';
  search?: string;
}
