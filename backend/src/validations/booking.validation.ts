import { z } from 'zod';

export const createBookingBodySchema = z.object({
  seats: z
    .number({ message: 'Seats count must be a number' })
    .int('Seats must be an integer')
    .min(1, 'Seats must be at least 1'),
});

export const tourSlotIdParamSchema = z.object({
  id: z.string({ message: 'Tour slot ID is required' }).uuid('Invalid tour slot ID: must be a valid UUID'),
});

export type CreateBookingBody = z.infer<typeof createBookingBodySchema>;
export type TourSlotIdParam = z.infer<typeof tourSlotIdParamSchema>;
