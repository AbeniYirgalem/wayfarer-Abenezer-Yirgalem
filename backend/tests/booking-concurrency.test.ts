import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/lib/prisma';
import { PlaceCategory } from '@prisma/client';

describe('Parallel Booking Concurrency — Row-Level Locking Verification', () => {
  const initialUserId = 'c0000000-0000-4000-8000-000000000000';
  const testPlaceId = 'c0000000-0000-4000-8000-000000000099';
  const testSlotId = 'c0000000-0000-4000-8000-000000000088';

  // Generate 20 distinct users for concurrent booking attempts
  const concurrentUsers = Array.from({ length: 20 }, (_, i) => {
    const hex = (i + 1).toString(16).padStart(12, '0');
    return {
      id: `c0000000-0000-4000-8000-${hex}`,
      name: `Concurrent Tester #${i + 1}`,
    };
  });

  const allUserIds = [initialUserId, ...concurrentUsers.map((u) => u.id)];

  beforeAll(async () => {
    // 1. Clean up any previous test artifacts
    await prisma.booking.deleteMany({
      where: {
        OR: [{ slotId: testSlotId }, { userId: { in: allUserIds } }],
      },
    });
    await prisma.tourSlot.deleteMany({ where: { id: testSlotId } });
    await prisma.place.deleteMany({ where: { id: testPlaceId } });
    await prisma.user.deleteMany({ where: { id: { in: allUserIds } } });

    // 2. Insert test place
    await prisma.place.create({
      data: {
        id: testPlaceId,
        name: 'Concurrency Stress Test Landmark',
        category: PlaceCategory.ENTERTAINMENT,
        description: 'Testing high-concurrency race conditions against PostgreSQL row-level locks',
        address: 'Meskel Square, Addis Ababa',
        openingHours: '24/7',
      },
    });

    // 3. Insert users
    await prisma.user.createMany({
      data: [
        { id: initialUserId, name: 'Pre-existing Booker' },
        ...concurrentUsers,
      ],
    });

    // 4. Create future tour slot with total capacity = 10
    const startsAt = new Date();
    startsAt.setDate(startsAt.getDate() + 14);

    await prisma.tourSlot.create({
      data: {
        id: testSlotId,
        placeId: testPlaceId,
        startsAt,
        capacity: 10,
      },
    });

    // 5. Pre-book 8 seats with initial user so exactly 2 seats remain
    await prisma.booking.create({
      data: {
        slotId: testSlotId,
        userId: initialUserId,
        seats: 8,
      },
    });
  });

  afterAll(async () => {
    // Clean up all resources
    await prisma.booking.deleteMany({
      where: {
        OR: [{ slotId: testSlotId }, { userId: { in: allUserIds } }],
      },
    });
    await prisma.tourSlot.deleteMany({ where: { id: testSlotId } });
    await prisma.place.deleteMany({ where: { id: testPlaceId } });
    await prisma.user.deleteMany({ where: { id: { in: allUserIds } } });
  });

  it('prevents overbooking when 20 simultaneous requests compete for 2 remaining seats', async () => {
    // Verify initial availability is exactly 2 seats
    const initialAvailability = await request(app).get(`/api/tours/${testSlotId}/bookings`);
    expect(initialAvailability.status).toBe(200);
    expect(initialAvailability.body.data.capacity).toBe(10);
    expect(initialAvailability.body.data.totalBookedSeats).toBe(8);
    expect(initialAvailability.body.data.availableSeats).toBe(2);

    // Fire 20 simultaneous booking requests in parallel (1 seat each)
    const bookingPromises = concurrentUsers.map((user) =>
      request(app)
        .post(`/api/tours/${testSlotId}/bookings`)
        .set('X-User-Id', user.id)
        .send({ seats: 1 })
    );

    const responses = await Promise.all(bookingPromises);

    // Filter outcomes by HTTP status
    const successfulRequests = responses.filter((res) => res.status === 201);
    const conflictedRequests = responses.filter((res) => res.status === 409);

    // Concurrency invariant 1: Exactly 2 requests must succeed
    expect(successfulRequests.length).toBe(2);

    // Concurrency invariant 2: Exactly 18 requests must receive 409 Conflict
    expect(conflictedRequests.length).toBe(18);

    // Validate that conflict errors contain the required message
    conflictedRequests.forEach((res) => {
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('fully booked or does not have enough available seats');
    });

    // Concurrency invariant 3: Total booked seats in PostgreSQL must equal exactly 10
    const aggregate = await prisma.booking.aggregate({
      where: { slotId: testSlotId },
      _sum: { seats: true },
    });
    expect(aggregate._sum.seats).toBe(10);

    // Concurrency invariant 4: No overbooking or negative seats left
    const finalAvailability = await request(app).get(`/api/tours/${testSlotId}/bookings`);
    expect(finalAvailability.status).toBe(200);
    expect(finalAvailability.body.data.capacity).toBe(10);
    expect(finalAvailability.body.data.totalBookedSeats).toBe(10);
    expect(finalAvailability.body.data.availableSeats).toBe(0);
  });
});
