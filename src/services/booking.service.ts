/**
 * Booking Service
 *
 * Business logic for tour bookings and concurrency safety to prevent overbooking.
 * Core transactional booking logic scheduled for Phase 3.
 */

import prisma from '@/lib/prisma';
import type { Booking } from '@prisma/client';

export class BookingService {
  static async getBookingsByUser(userId: string): Promise<Booking[]> {
    return prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

