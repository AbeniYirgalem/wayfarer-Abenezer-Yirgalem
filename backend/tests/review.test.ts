import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/lib/prisma';
import { PlaceCategory } from '@prisma/client';

describe('Review API & Business Logic (POST /api/places/:id/reviews)', () => {
  const testUserId = '88888888-8888-4888-8888-888888888881';
  const testPlaceId = '88888888-8888-4888-8888-888888888882';

  beforeAll(async () => {
    // Create isolated test user and place
    await prisma.user.upsert({
      where: { id: testUserId },
      create: { id: testUserId, name: 'Review Test Traveler' },
      update: {},
    });

    await prisma.place.upsert({
      where: { id: testPlaceId },
      create: {
        id: testPlaceId,
        name: 'Review Test Scenic Lookout',
        category: PlaceCategory.NATURE,
        description: 'Test lookout spot for integration tests',
        address: 'Test Mountain, Addis Ababa',
        openingHours: '06:00 - 18:00',
      },
      update: {},
    });

    // Clean up any lingering reviews for this pair
    await prisma.review.deleteMany({
      where: { placeId: testPlaceId, userId: testUserId },
    });
  });

  afterAll(async () => {
    await prisma.review.deleteMany({
      where: { placeId: testPlaceId, userId: testUserId },
    });
    await prisma.place.deleteMany({
      where: { id: testPlaceId },
    });
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
  });

  it('submits a new review and calculates updated place stats', async () => {
    const res = await request(app)
      .post(`/api/places/${testPlaceId}/reviews`)
      .set('X-User-Id', testUserId)
      .send({
        rating: 5,
        body: 'Breathtaking panoramic view of the entire valley!',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isNew).toBe(true);
    expect(res.body.data.review.rating).toBe(5);
    expect(res.body.data.review.body).toBe('Breathtaking panoramic view of the entire valley!');
    expect(res.body.data.review.user.name).toBe('Review Test Traveler');
    expect(res.body.data.placeStats.reviewCount).toBe(1);
    expect(res.body.data.placeStats.averageRating).toBe(5);

    // Verify DB persistence
    const dbReview = await prisma.review.findUnique({
      where: { placeId_userId: { placeId: testPlaceId, userId: testUserId } },
    });
    expect(dbReview).not.toBeNull();
    expect(dbReview?.rating).toBe(5);
  });

  it('updates existing review when same user submits again (enforces one review per user per place)', async () => {
    const initialCount = await prisma.review.count({
      where: { placeId: testPlaceId },
    });

    const res = await request(app)
      .post(`/api/places/${testPlaceId}/reviews`)
      .set('X-User-Id', testUserId)
      .send({
        rating: 4,
        body: 'Updated review: Still wonderful, but parking was crowded.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isNew).toBe(false);
    expect(res.body.data.review.rating).toBe(4);
    expect(res.body.data.review.body).toContain('Updated review');

    // Verify review count did not increase
    const finalCount = await prisma.review.count({
      where: { placeId: testPlaceId },
    });
    expect(finalCount).toBe(initialCount);

    // Verify DB was updated
    const dbReview = await prisma.review.findUnique({
      where: { placeId_userId: { placeId: testPlaceId, userId: testUserId } },
    });
    expect(dbReview?.rating).toBe(4);
    expect(dbReview?.body).toContain('Updated review');
  });

  it('rejects invalid rating (< 1 or > 5 or floating)', async () => {
    // Rating 6
    const resOver = await request(app)
      .post(`/api/places/${testPlaceId}/reviews`)
      .set('X-User-Id', testUserId)
      .send({
        rating: 6,
        body: 'Invalid rating above 5',
      });
    expect(resOver.status).toBe(400);
    expect(resOver.body.success).toBe(false);

    // Rating 0
    const resUnder = await request(app)
      .post(`/api/places/${testPlaceId}/reviews`)
      .set('X-User-Id', testUserId)
      .send({
        rating: 0,
        body: 'Invalid rating below 1',
      });
    expect(resUnder.status).toBe(400);
    expect(resUnder.body.success).toBe(false);

    // Decimal rating
    const resDecimal = await request(app)
      .post(`/api/places/${testPlaceId}/reviews`)
      .set('X-User-Id', testUserId)
      .send({
        rating: 4.5,
        body: 'Invalid fractional rating',
      });
    expect(resDecimal.status).toBe(400);
    expect(resDecimal.body.success).toBe(false);
  });

  it('accepts empty or whitespace-only review body and saves null body', async () => {
    const res = await request(app)
      .post(`/api/places/${testPlaceId}/reviews`)
      .set('X-User-Id', testUserId)
      .send({
        rating: 5,
        body: '   ',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.review.rating).toBe(5);
    expect(res.body.data.review.body).toBeNull();
  });

  it('accepts review without body field and saves rating successfully', async () => {
    const res = await request(app)
      .post(`/api/places/${testPlaceId}/reviews`)
      .set('X-User-Id', testUserId)
      .send({
        rating: 4,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.review.rating).toBe(4);
    expect(res.body.data.review.body).toBeNull();
  });

  it('rejects review body exceeding 500 characters', async () => {
    const longBody = 'A'.repeat(501);
    const res = await request(app)
      .post(`/api/places/${testPlaceId}/reviews`)
      .set('X-User-Id', testUserId)
      .send({
        rating: 5,
        body: longBody,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects request with missing or invalid X-User-Id header', async () => {
    // Missing header
    const resMissing = await request(app)
      .post(`/api/places/${testPlaceId}/reviews`)
      .send({
        rating: 5,
        body: 'Valid review text',
      });
    expect(resMissing.status).toBe(400);

    // Invalid UUID header
    const resInvalid = await request(app)
      .post(`/api/places/${testPlaceId}/reviews`)
      .set('X-User-Id', 'not-a-valid-uuid')
      .send({
        rating: 5,
        body: 'Valid review text',
      });
    expect(resInvalid.status).toBe(400);
  });

  it('returns 404 if acting user does not exist in the database', async () => {
    const nonExistentUserId = '99999999-9999-4999-9999-999999999999';
    const res = await request(app)
      .post(`/api/places/${testPlaceId}/reviews`)
      .set('X-User-Id', nonExistentUserId)
      .send({
        rating: 5,
        body: 'Valid review text',
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 if place does not exist', async () => {
    const nonExistentPlaceId = '99999999-9999-4999-9999-999999999998';
    const res = await request(app)
      .post(`/api/places/${nonExistentPlaceId}/reviews`)
      .set('X-User-Id', testUserId)
      .send({
        rating: 5,
        body: 'Valid review text',
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
