import { Prisma, PlaceCategory } from '@prisma/client';
import prisma from '../lib/prisma';
import { RankingService, PlaceRatingStats } from './ranking.service';
import { AppError } from '../utils/app-error';

export interface PlaceListItem extends PlaceRatingStats {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  openingHours: string;
  imageUrl: string | null;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceDetailTourSlot {
  id: string;
  placeId: string;
  startsAt: Date;
  capacity: number;
  totalBookedSeats: number;
  availableSeats: number;
}

export interface PlaceDetailReview {
  id: string;
  placeId: string;
  userId: string;
  rating: number;
  body: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
  };
}

export interface PlaceDetail extends PlaceListItem {
  reviews: PlaceDetailReview[];
  tourSlots: PlaceDetailTourSlot[];
}

export interface GetPlacesFilterOptions {
  category?: PlaceCategory;
  sort?: 'top-rated';
  search?: string;
}

export class PlaceService {
  /**
   * Retrieves the global average rating across all reviews in the database.
   */
  static async getOverallAverageRating(): Promise<number> {
    const aggregate = await prisma.review.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
    });

    if (!aggregate._count.rating || aggregate._count.rating === 0) {
      return 3.5; // Neutral default prior if no reviews exist in system
    }

    return Number((aggregate._avg.rating ?? 3.5).toFixed(2));
  }

  /**
   * Lists places with backend-level filtering, search, and Bayesian weighted ranking.
   */
  static async getPlaces(options: GetPlacesFilterOptions = {}): Promise<PlaceListItem[]> {
    const { category, sort, search } = options;

    const where: Prisma.PlaceWhereInput = {};

    if (category) {
      where.category = category;
    }

    if (search && search.trim().length > 0) {
      const term = search.trim();
      where.OR = [
        {
          name: {
            contains: term,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: term,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [places, overallAverage] = await Promise.all([
      prisma.place.findMany({
        where,
        include: {
          reviews: {
            select: { rating: true },
          },
        },
      }),
      this.getOverallAverageRating(),
    ]);

    const formattedPlaces: PlaceListItem[] = places.map((place) => {
      const ratings = place.reviews.map((r) => r.rating);
      const stats = RankingService.computeStats(ratings, overallAverage);

      return {
        id: place.id,
        name: place.name,
        category: place.category,
        description: place.description,
        openingHours: place.openingHours,
        imageUrl: place.imageUrl,
        address: place.address,
        createdAt: place.createdAt,
        updatedAt: place.updatedAt,
        averageRating: stats.averageRating,
        reviewCount: stats.reviewCount,
        weightedRating: stats.weightedRating,
      };
    });

    // Backend sorting
    if (sort === 'top-rated') {
      formattedPlaces.sort((a, b) => {
        // Primary sort: weightedRating descending
        if (b.weightedRating !== a.weightedRating) {
          return b.weightedRating - a.weightedRating;
        }
        // Secondary sort: reviewCount descending
        if (b.reviewCount !== a.reviewCount) {
          return b.reviewCount - a.reviewCount;
        }
        // Tertiary sort: name alphabetical
        return a.name.localeCompare(b.name);
      });
    } else {
      // Default: most recently created descending, then name
      formattedPlaces.sort((a, b) => {
        const timeDiff = b.createdAt.getTime() - a.createdAt.getTime();
        if (timeDiff !== 0) return timeDiff;
        return a.name.localeCompare(b.name);
      });
    }

    return formattedPlaces;
  }

  /**
   * Retrieves single place details with stats, reviews (with author), and future tour slots (with seat availability).
   */
  static async getPlaceById(id: string): Promise<PlaceDetail> {
    const now = new Date();

    const [place, overallAverage] = await Promise.all([
      prisma.place.findUnique({
        where: { id },
        include: {
          reviews: {
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: { id: true, name: true },
              },
            },
          },
          tourSlots: {
            where: {
              startsAt: {
                gte: now,
              },
            },
            orderBy: {
              startsAt: 'asc',
            },
            include: {
              bookings: {
                select: { seats: true },
              },
            },
          },
        },
      }),
      this.getOverallAverageRating(),
    ]);

    if (!place) {
      throw AppError.notFound(`Place with ID '${id}' not found`);
    }

    const ratings = place.reviews.map((r) => r.rating);
    const stats = RankingService.computeStats(ratings, overallAverage);

    const tourSlots: PlaceDetailTourSlot[] = place.tourSlots.map((slot) => {
      const totalBookedSeats = slot.bookings.reduce((sum, b) => sum + b.seats, 0);
      const availableSeats = Math.max(0, slot.capacity - totalBookedSeats);

      return {
        id: slot.id,
        placeId: slot.placeId,
        startsAt: slot.startsAt,
        capacity: slot.capacity,
        totalBookedSeats,
        availableSeats,
      };
    });

    const reviews: PlaceDetailReview[] = place.reviews.map((r) => ({
      id: r.id,
      placeId: r.placeId,
      userId: r.userId,
      rating: r.rating,
      body: r.body,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: r.user,
    }));

    return {
      id: place.id,
      name: place.name,
      category: place.category,
      description: place.description,
      openingHours: place.openingHours,
      imageUrl: place.imageUrl,
      address: place.address,
      createdAt: place.createdAt,
      updatedAt: place.updatedAt,
      averageRating: stats.averageRating,
      reviewCount: stats.reviewCount,
      weightedRating: stats.weightedRating,
      reviews,
      tourSlots,
    };
  }
}

export default PlaceService;
