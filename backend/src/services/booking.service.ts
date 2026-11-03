import prisma from '../lib/prisma';
import { AppError } from '../utils/app-error';

export interface CreateBookingDTO {
  slotId: string;
  userId: string;
  seats: number;
}

export interface BookingResult {
  bookingId: string;
  slotId: string;
  seats: number;
  remainingSeats: number;
}

export interface TourSlotAvailability {
  id: string;
  placeId: string;
  place: {
    id: string;
    name: string;
    address: string;
    imageUrl: string | null;
    category: string;
  };
  startsAt: Date;
  capacity: number;
  totalBookedSeats: number;
  availableSeats: number;
}

export class BookingService {
  /**
   * Retrieves tour slot availability, calculating total booked seats and available seats.
   */
  static async getTourSlotAvailability(slotId: string): Promise<TourSlotAvailability> {
    const slot = await prisma.tourSlot.findUnique({
      where: { id: slotId },
      include: {
        place: {
          select: {
            id: true,
            name: true,
            address: true,
            imageUrl: true,
            category: true,
          },
        },
        bookings: {
          select: { seats: true },
        },
      },
    });

    if (!slot) {
      throw AppError.notFound(`Tour slot with ID '${slotId}' not found`);
    }

    const totalBookedSeats = slot.bookings.reduce((sum, b) => sum + b.seats, 0);
    const availableSeats = Math.max(0, slot.capacity - totalBookedSeats);

    return {
      id: slot.id,
      placeId: slot.placeId,
      place: slot.place,
      startsAt: slot.startsAt,
      capacity: slot.capacity,
      totalBookedSeats,
      availableSeats,
    };
  }

  /**
   * Concurrency-safe booking creation using PostgreSQL row-level locking (SELECT ... FOR UPDATE)
   * within an atomic transaction. Guarantees that concurrent seat reservations cannot exceed capacity.
   */
  static async createBooking(dto: CreateBookingDTO): Promise<BookingResult> {
    const { slotId, userId, seats } = dto;

    if (seats <= 0) {
      throw AppError.badRequest('Requested seats count must be a positive integer');
    }

    // Execute atomic transaction with pessimistic row-level locking
    return await prisma.$transaction(async (tx) => {
      // 1. Verify acting user exists
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!user) {
        throw AppError.notFound(`Acting user with ID '${userId}' not found`);
      }

      // 2. Lock the TourSlot row exclusively for update using parameterized SQL
      const lockedSlots = await tx.$queryRaw<
        Array<{ id: string; placeId: string; startsAt: Date; capacity: number }>
      >`
        SELECT id, "placeId", "startsAt", capacity
        FROM tour_slots
        WHERE id = ${slotId}
        FOR UPDATE
      `;

      if (!lockedSlots || lockedSlots.length === 0) {
        throw AppError.notFound(`Tour slot with ID '${slotId}' not found`);
      }

      const slot = lockedSlots[0];

      // 3. Reject bookings for past tour slots
      if (new Date(slot.startsAt).getTime() <= Date.now()) {
        throw AppError.badRequest('Cannot book past tour slots');
      }

      // 4. Enforce one booking per user per tour slot
      const existingBooking = await tx.booking.findUnique({
        where: {
          slotId_userId: {
            slotId,
            userId,
          },
        },
      });

      if (existingBooking) {
        throw AppError.conflict('You have already booked seats for this tour slot');
      }

      // 5. Calculate total booked seats directly inside the transaction
      const aggregate = await tx.booking.aggregate({
        where: { slotId },
        _sum: { seats: true },
      });
      const totalBookedSeats = aggregate._sum.seats || 0;
      const availableSeats = slot.capacity - totalBookedSeats;

      // 6. Enforce capacity limit
      if (seats > availableSeats) {
        throw AppError.conflict(
          'Sorry, this tour is fully booked or does not have enough available seats.'
        );
      }

      // 7. Create booking record
      const newBooking = await tx.booking.create({
        data: {
          slotId,
          userId,
          seats,
        },
      });

      const remainingSeats = availableSeats - seats;

      return {
        bookingId: newBooking.id,
        slotId: newBooking.slotId,
        seats: newBooking.seats,
        remainingSeats,
      };
    });
  }

  /**
   * Retrieves all bookings for a user (backward compatibility)
   */
  static async getBookingsByUser(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default BookingService;
