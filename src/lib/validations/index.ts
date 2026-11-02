import { z } from 'zod';

export const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  avatarUrl: z.string().url().optional().nullable(),
});

export const placeCreateSchema = z.object({
  name: z.string().min(1, 'Place name is required').max(150),
  description: z.string().min(1, 'Description is required'),
  city: z.string().min(1, 'City is required'),
  category: z.string().min(1, 'Category is required'),
  address: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});

export const reviewCreateSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(1, 'Review comment is required').max(1000),
  userId: z.string().uuid('Invalid user ID'),
  placeId: z.string().uuid('Invalid place ID'),
});

export const tourSlotCreateSchema = z.object({
  placeId: z.string().uuid('Invalid place ID'),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional().nullable(),
  capacity: z.number().int().positive('Capacity must be a positive integer'),
  price: z.number().nonnegative('Price cannot be negative').optional().nullable(),
});

export const bookingCreateSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  tourSlotId: z.string().uuid('Invalid tour slot ID'),
  seats: z.number().int().positive('Seats must be a positive integer'),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type PlaceCreateInput = z.infer<typeof placeCreateSchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type TourSlotCreateInput = z.infer<typeof tourSlotCreateSchema>;
export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;

