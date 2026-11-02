import { z } from 'zod';

export const placeCategoryEnum = z.enum([
  'HISTORY',
  'FOOD',
  'NATURE',
  'CULTURE',
  'ENTERTAINMENT',
]);

export const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
});

export const placeCreateSchema = z.object({
  name: z.string().min(1, 'Place name is required').max(150),
  category: placeCategoryEnum,
  description: z.string().min(1, 'Description is required'),
  openingHours: z.string().min(1, 'Opening hours are required'),
  address: z.string().min(1, 'Address is required'),
  imageUrl: z.string().url('Invalid image URL').optional().nullable(),
});

export const reviewCreateSchema = z.object({
  placeId: z.string().uuid('Invalid place ID'),
  userId: z.string().uuid('Invalid user ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  body: z.string().trim().min(1, 'Review body cannot be empty').max(500, 'Review body cannot exceed 500 characters'),
});

export const tourSlotCreateSchema = z.object({
  placeId: z.string().uuid('Invalid place ID'),
  startsAt: z.coerce.date(),
  capacity: z.number().int().positive('Capacity must be greater than zero'),
});

export const bookingCreateSchema = z.object({
  slotId: z.string().uuid('Invalid tour slot ID'),
  userId: z.string().uuid('Invalid user ID'),
  seats: z.number().int().positive('Seats must be greater than zero'),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type PlaceCreateInput = z.infer<typeof placeCreateSchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type TourSlotCreateInput = z.infer<typeof tourSlotCreateSchema>;
export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
