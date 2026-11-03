import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/lib/prisma';
import { PlaceCategory } from '@prisma/client';

describe('Booking API & Business Logic (GET & POST /api/tours/:id/bookings)', () => {
  const testUserId1 = '77777777-7777-4777-8777-777777777771';
  const testUserId2 = '77777777-7777-4777-8777-777777777772';
  const testPlaceId = '77777777-7777-4777-8777-777777777773';
  const futureSlotId = '77777777-7777-4777-8777-777777777774';
  const pastSlotId = '77777777-7777-4777-8777-777777777775';

  beforeAll(async () => {
    // 1. Create test users
    await prisma.user.upsert({
      where: { id: testUserId1 },
      create: { id: testUserId1, name: 'Booking Test User 1' },
      update: {},
    });
    await prisma.user.upsert({
      where: { id: testUserId2 },
      create: { id: testUserId2, name: 'Booking Test User 2' },
      update: {},
    });

    // 2. Create test place
    await prisma.place.upsert({
      where: { id: testPlaceId },
      create: {
        id: testPlaceId,
        name: 'Booking Test Monastery',
        category: PlaceCategory.CULTURE,
        description: 'Test monastery for booking tests',
        address: 'Debre Libanos, Ethiopia',
        openingHours: '08:00 - 17:00',
      },
      update: {},
    });

    // 3. Create a future slot (capacity: 10)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    await prisma.tourSlot.upsert({
      where: { id: futureSlotId },
      create: {
        id: futureSlotId,
        placeId: testPlaceId,
        startsAt: futureDate,
        capacity: 10,
      },
      update: {
        startsAt: futureDate,
        capacity: 10,
      },
    });

    // 4. Create a past slot (capacity: 10)
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);

    await prisma.tourSlot.upsert({
      where: { id: pastSlotId },
      create: {
        id: pastSlotId,
        placeId: testPlaceId,
        startsAt: pastDate,
        capacity: 10,
      },
      update: {
        startsAt: pastDate,
        capacity: 10,
      },
    });

    // Clean up any test bookings
    await prisma.booking.deleteMany({
      where: { slotId: { in: [futureSlotId, pastSlotId] } },
    });
  });

  afterAll(async () => {
    await prisma.booking.deleteMany({
      where: { slotId: { in: [futureSlotId, pastSlotId] } },
    });
    await prisma.tourSlot.deleteMany({
      where: { id: { in: [futureSlotId, pastSlotId] } },
    });
    await prisma.place.deleteMany({
      where: { id: testPlaceId },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [testUserId1, testUserId2] } },
    });
  });

  it('GET /api/tours/:id/bookings returns initial slot availability accurately', async () => {
    const res = await request(app).get(`/api/tours/${futureSlotId}/bookings`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(futureSlotId);
    expect(res.body.data.capacity).toBe(10);
    expect(res.body.data.totalBookedSeats).toBe(0);
    expect(res.body.data.availableSeats).toBe(10);
  });

  it('POST /api/tours/:id/bookings successfully creates booking and updates available seats', async () => {
    const res = await request(app)
      .post(`/api/tours/${futureSlotId}/bookings`)
      .set('X-User-Id', testUserId1)
      .send({ seats: 3 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.seats).toBe(3);
    expect(res.body.data.remainingSeats).toBe(7);

    // Verify availability endpoint reflects reservation
    const availRes = await request(app).get(`/api/tours/${futureSlotId}/bookings`);
    expect(availRes.body.data.totalBookedSeats).toBe(3);
    expect(availRes.body.data.availableSeats).toBe(7);
  });

  it('rejects duplicate booking if the same user attempts to book the same slot twice', async () => {
    const res = await request(app)
      .post(`/api/tours/${futureSlotId}/bookings`)
      .set('X-User-Id', testUserId1)
      .send({ seats: 1 });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('already booked');
  });

  it('rejects booking when requested seats exceed available seats', async () => {
    // Current available is 7. Attempt to book 8 seats with User 2.
    const res = await request(app)
      .post(`/api/tours/${futureSlotId}/bookings`)
      .set('X-User-Id', testUserId2)
      .send({ seats: 8 });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('fully booked or does not have enough available seats');
  });

  it('rejects booking for past tour slots', async () => {
    const res = await request(app)
      .post(`/api/tours/${pastSlotId}/bookings`)
      .set('X-User-Id', testUserId2)
      .send({ seats: 1 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('past tour slots');
  });

  it('rejects invalid seat counts (0 or negative)', async () => {
    const resZero = await request(app)
      .post(`/api/tours/${futureSlotId}/bookings`)
      .set('X-User-Id', testUserId2)
      .send({ seats: 0 });
    expect(resZero.status).toBe(400);

    const resNegative = await request(app)
      .post(`/api/tours/${futureSlotId}/bookings`)
      .set('X-User-Id', testUserId2)
      .send({ seats: -2 });
    expect(resNegative.status).toBe(400);
  });

  it('returns 404 for non-existent tour slot', async () => {
    const nonExistentSlotId = '99999999-9999-4999-9999-999999999997';
    const res = await request(app)
      .post(`/api/tours/${nonExistentSlotId}/bookings`)
      .set('X-User-Id', testUserId2)
      .send({ seats: 1 });

    expect(res.status).toBe(404);
  });
});
