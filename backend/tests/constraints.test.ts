import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../src/lib/prisma';

describe('Database Integrity and Constraints', () => {
  const testUserId = '11111111-1111-4111-8111-111111111111'; // Abenezer
  const testPlaceId = 'a0000001-0000-4000-8000-000000000005'; // Entoto Park (no review from Abenezer)
  const testSlotId = 'b0000001-0000-4000-8000-000000000002'; // Slot without Abenezer booking

  it('enforces rating >= 1 and rating <= 5', async () => {
    // Attempt rating 6
    await expect(
      prisma.review.create({
        data: {
          id: 'e0000001-0000-4000-8000-000000000001',
          placeId: testPlaceId,
          userId: testUserId,
          rating: 6,
          body: 'Too high rating',
        },
      })
    ).rejects.toThrow();

    // Attempt rating 0
    await expect(
      prisma.review.create({
        data: {
          id: 'e0000001-0000-4000-8000-000000000002',
          placeId: testPlaceId,
          userId: testUserId,
          rating: 0,
          body: 'Too low rating',
        },
      })
    ).rejects.toThrow();
  });

  it('enforces non-empty review body', async () => {
    // Attempt empty body
    await expect(
      prisma.review.create({
        data: {
          id: 'e0000001-0000-4000-8000-000000000003',
          placeId: testPlaceId,
          userId: testUserId,
          rating: 4,
          body: '   ',
        },
      })
    ).rejects.toThrow();
  });

  it('enforces positive tour slot capacity', async () => {
    await expect(
      prisma.tourSlot.create({
        data: {
          id: 'e0000001-0000-4000-8000-000000000004',
          placeId: testPlaceId,
          startsAt: new Date('2028-01-01T10:00:00Z'),
          capacity: 0,
        },
      })
    ).rejects.toThrow();
  });

  it('enforces positive booking seats', async () => {
    await expect(
      prisma.booking.create({
        data: {
          id: 'e0000001-0000-4000-8000-000000000005',
          slotId: testSlotId,
          userId: testUserId,
          seats: 0,
        },
      })
    ).rejects.toThrow();
  });

  it('enforces composite unique constraint on [placeId, userId]', async () => {
    // Place 1 already has a review from User 1 (Abenezer)
    const existingPlaceId = 'a0000001-0000-4000-8000-000000000001';
    await expect(
      prisma.review.create({
        data: {
          id: 'e0000001-0000-4000-8000-000000000006',
          placeId: existingPlaceId,
          userId: testUserId,
          rating: 5,
          body: 'Duplicate review attempt',
        },
      })
    ).rejects.toThrow();
  });

  it('enforces composite unique constraint on [slotId, userId]', async () => {
    // Slot 1 already has a booking from User 1 (Abenezer)
    const existingSlotId = 'b0000001-0000-4000-8000-000000000001';
    await expect(
      prisma.booking.create({
        data: {
          id: 'e0000001-0000-4000-8000-000000000007',
          slotId: existingSlotId,
          userId: testUserId,
          seats: 1,
        },
      })
    ).rejects.toThrow();
  });
});

