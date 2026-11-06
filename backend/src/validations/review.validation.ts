import { z } from 'zod';

export const createReviewBodySchema = z.object({
  rating: z
    .number({ message: 'Rating is required and must be a number' })
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  body: z
    .string({ message: 'Review body must be a string' })
    .max(500, 'Review body cannot exceed 500 characters')
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return null;
      const trimmed = val.trim();
      return trimmed.length > 0 ? trimmed : null;
    }),
});

export const actingUserHeaderSchema = z.object({
  'x-user-id': z
    .string({ message: 'X-User-Id header is required to identify the acting user' })
    .uuid('X-User-Id header must be a valid UUID'),
});

export type CreateReviewBody = z.infer<typeof createReviewBodySchema>;
