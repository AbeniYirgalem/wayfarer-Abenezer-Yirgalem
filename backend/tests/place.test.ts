import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Places API (GET /api/places & GET /api/places/:id)', () => {
  it('GET /api/places returns list of places with stats', async () => {
    const res = await request(app).get('/api/places');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const firstPlace = res.body.data[0];
    expect(firstPlace).toHaveProperty('id');
    expect(firstPlace).toHaveProperty('name');
    expect(firstPlace).toHaveProperty('category');
    expect(firstPlace).toHaveProperty('averageRating');
    expect(firstPlace).toHaveProperty('reviewCount');
    expect(firstPlace).toHaveProperty('weightedRating');
  });

  it('GET /api/places?category=HISTORY filters places by category', async () => {
    const res = await request(app).get('/api/places?category=HISTORY');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((place: { category: string }) => {
      expect(place.category).toBe('HISTORY');
    });
  });

  it('GET /api/places?category=INVALID returns 400 validation error', async () => {
    const res = await request(app).get('/api/places?category=INVALID');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/places?search=National filters places by search term', async () => {
    const res = await request(app).get('/api/places?search=National');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((place: { name: string; description: string }) => {
      const matches =
        place.name.toLowerCase().includes('national') ||
        place.description.toLowerCase().includes('national');
      expect(matches).toBe(true);
    });
  });

  it('GET /api/places?sort=top-rated orders places by Bayesian weighted rating descending', async () => {
    const res = await request(app).get('/api/places?sort=top-rated');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const places = res.body.data;
    for (let i = 0; i < places.length - 1; i++) {
      expect(places[i].weightedRating).toBeGreaterThanOrEqual(
        places[i + 1].weightedRating
      );
    }
  });

  it('GET /api/places/:id returns details, author-attributed reviews, and available tour slots', async () => {
    // Fetch all places first to get a valid place ID
    const listRes = await request(app).get('/api/places');
    const targetPlace = listRes.body.data[0];

    const res = await request(app).get(`/api/places/${targetPlace.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(targetPlace.id);
    expect(res.body.data.name).toBe(targetPlace.name);
    expect(res.body.data).toHaveProperty('averageRating');
    expect(res.body.data).toHaveProperty('reviewCount');
    expect(res.body.data).toHaveProperty('weightedRating');
    expect(res.body.data).toHaveProperty('reviews');
    expect(res.body.data).toHaveProperty('tourSlots');

    // Reviews should attribute user name
    if (res.body.data.reviews.length > 0) {
      expect(res.body.data.reviews[0]).toHaveProperty('user');
      expect(res.body.data.reviews[0].user).toHaveProperty('name');
    }

    // Tour slots should have availableSeats dynamically calculated
    if (res.body.data.tourSlots.length > 0) {
      const slot = res.body.data.tourSlots[0];
      expect(slot).toHaveProperty('capacity');
      expect(slot).toHaveProperty('totalBookedSeats');
      expect(slot).toHaveProperty('availableSeats');
      expect(slot.availableSeats).toBe(slot.capacity - slot.totalBookedSeats);
    }
  });

  it('GET /api/places/:id returns 404 for non-existent place', async () => {
    const res = await request(app).get('/api/places/00000000-0000-4000-8000-000000000000');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/places/:id returns 400 for malformed UUID', async () => {
    const res = await request(app).get('/api/places/invalid-uuid-format');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
