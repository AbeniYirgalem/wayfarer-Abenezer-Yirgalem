import type {
  User,
  PlaceListItem,
  PlaceDetail,
  ReviewSubmissionResult,
  TourSlotAvailability,
  BookingResult,
  ApiResponse,
  GetPlacesFilterOptions,
} from '../types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly errors?: string[];
  public readonly raw?: unknown;

  constructor(status: number, message: string, errors?: string[], raw?: unknown) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.raw = raw;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Low-level HTTP requester connecting to Express REST API
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkError) {
    throw new ApiClientError(
      0,
      'Unable to connect to the Wayfarer backend service. Please ensure the API is running.',
      undefined,
      networkError
    );
  }

  let json: ApiResponse<T> | null = null;
  try {
    json = (await response.json()) as ApiResponse<T>;
  } catch {
    json = null;
  }

  if (!response.ok) {
    const errorObj = json?.error;
    const errorMessage =
      errorObj?.message ||
      json?.message ||
      `HTTP Error ${response.status}: ${response.statusText}`;
    const errorDetails = errorObj?.errors;

    throw new ApiClientError(
      response.status,
      errorMessage,
      errorDetails,
      json
    );
  }

  if (json && 'data' in json) {
    return json.data as T;
  }

  return json as unknown as T;
}

export const api = {
  /**
   * Health check
   */
  async checkHealth(): Promise<{ message: string; success: boolean }> {
    return request<{ message: string; success: boolean }>('/health');
  },

  /**
   * Fetch seeded users for the acting user switcher
   */
  async getUsers(): Promise<User[]> {
    return request<User[]>('/users');
  },

  /**
   * Fetch places with category, search, and top-rated sorting
   */
  async getPlaces(filters: GetPlacesFilterOptions = {}): Promise<PlaceListItem[]> {
    const params = new URLSearchParams();

    if (filters.category && filters.category !== 'ALL') {
      params.set('category', filters.category);
    }
    if (filters.sort === 'top-rated') {
      params.set('sort', 'top-rated');
    }
    if (filters.search && filters.search.trim().length > 0) {
      params.set('search', filters.search.trim());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/places?${queryString}` : '/places';

    return request<PlaceListItem[]>(endpoint);
  },

  /**
   * Fetch place details with attributed reviews and tour slot availability
   */
  async getPlaceById(id: string): Promise<PlaceDetail> {
    return request<PlaceDetail>(`/places/${id}`);
  },

  /**
   * Submit or update a review acting as the current user
   */
  async submitReview(
    placeId: string,
    payload: { rating: number; body?: string | null },
    userId: string
  ): Promise<ReviewSubmissionResult> {
    return request<ReviewSubmissionResult>(`/places/${placeId}/reviews`, {
      method: 'POST',
      headers: {
        'X-User-Id': userId,
      },
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch real-time availability for a tour slot
   */
  async getTourSlotAvailability(slotId: string): Promise<TourSlotAvailability> {
    return request<TourSlotAvailability>(`/tours/${slotId}/bookings`);
  },

  /**
   * Create a concurrency-safe tour booking
   */
  async createBooking(
    slotId: string,
    payload: { seats: number },
    userId: string
  ): Promise<BookingResult> {
    return request<BookingResult>(`/tours/${slotId}/bookings`, {
      method: 'POST',
      headers: {
        'X-User-Id': userId,
      },
      body: JSON.stringify(payload),
    });
  },
};

export default api;
