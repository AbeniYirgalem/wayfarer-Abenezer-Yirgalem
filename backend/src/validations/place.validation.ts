import { z } from 'zod';
import { PlaceCategory } from '@prisma/client';

export const placeCategoryEnum = z.nativeEnum(PlaceCategory, {
  message: 'Invalid category. Must be one of HISTORY, FOOD, NATURE, CULTURE, ENTERTAINMENT',
});

export const getPlacesQuerySchema = z.object({
  category: placeCategoryEnum.optional(),
  sort: z.enum(['top-rated']).optional(),
  search: z.string().trim().optional(),
});

export const placeIdParamSchema = z.object({
  id: z.string({ message: 'Place ID is required' }).uuid('Invalid place ID: must be a valid UUID'),
});

export type GetPlacesQuery = z.infer<typeof getPlacesQuerySchema>;
export type PlaceIdParam = z.infer<typeof placeIdParamSchema>;
