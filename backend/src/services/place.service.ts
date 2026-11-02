/**
 * Place Service
 *
 * Business logic for place discovery and exploration.
 * Core features scheduled for Phase 2.
 */

import prisma from '../lib/prisma';
import type { Place } from '@prisma/client';

export class PlaceService {
  static async getPlaces(): Promise<Place[]> {
    return prisma.place.findMany();
  }

  static async getPlaceById(id: string): Promise<Place | null> {
    return prisma.place.findUnique({
      where: { id },
    });
  }
}

