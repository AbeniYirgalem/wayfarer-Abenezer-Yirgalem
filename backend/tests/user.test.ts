import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Users API (GET /api/users)', () => {
  it('GET /api/users returns list of seeded users for switcher', async () => {
    const res = await request(app).get('/api/users');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);

    const firstUser = res.body.data[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('name');
    expect(firstUser).toHaveProperty('createdAt');
  });
});
