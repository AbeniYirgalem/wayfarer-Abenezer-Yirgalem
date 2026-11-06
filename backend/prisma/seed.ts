import crypto from 'node:crypto';
import prisma from '../src/lib/prisma';
import { PlaceCategory } from '@prisma/client';

export const USERS = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Abenezer',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Hana',
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Dawit',
  },
];

export const PLACES = [
  {
    id: 'a0000001-0000-4000-8000-000000000001',
    name: 'National Museum of Ethiopia',
    category: PlaceCategory.HISTORY,
    description:
      'Home to the famous hominid fossil Lucy (Dinknesh), historical royal artifacts, regalia of Ethiopian emperors, and ancient ceremonial crowns spanning millennia.',
    address: 'King George VI St, Arat Kilo, Addis Ababa, Ethiopia',
    openingHours: 'Mon–Sun: 09:00 – 17:00',
    imageUrl:
      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000002',
    name: 'Holy Trinity Cathedral (Kidist Selassie)',
    category: PlaceCategory.HISTORY,
    description:
      'Splendid copper-domed cathedral with European stained glass windows, imperial murals, and the resting place of Emperor Haile Selassie and Empress Menen Asfaw.',
    address: 'Arat Kilo, Addis Ababa, Ethiopia',
    openingHours: 'Mon–Sun: 08:00 – 18:00',
    imageUrl:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000003',
    name: '2000 Habesha Cultural Restaurant',
    category: PlaceCategory.FOOD,
    description:
      'Vibrant cultural dining hall serving authentic Ethiopian injera with doro wat, kitfo, and traditional honey wine (tej), accompanied by live folk dancing.',
    address: 'Namibia St, Bole, Addis Ababa, Ethiopia',
    openingHours: 'Mon–Sun: 12:00 – 23:00',
    imageUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000004',
    name: 'Tomoca Coffee (Piazza)',
    category: PlaceCategory.FOOD,
    description:
      'The oldest and most iconic Italian-style coffee roaster in Addis Ababa, preparing intense espresso and macchiato from freshly roasted Ethiopian Arabica beans since 1953.',
    address: 'Wavel St, Piazza, Addis Ababa, Ethiopia',
    openingHours: 'Mon–Sat: 07:00 – 20:30, Sun: 08:00 – 19:30',
    imageUrl:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000005',
    name: 'Entoto Natural Park',
    category: PlaceCategory.NATURE,
    description:
      'Lush eucalyptus forest park perched 3,000 meters above Addis Ababa, offering scenic ridge walking trails, suspension bridges, horseback riding, and panoramic skyline vistas.',
    address: 'Entoto Hills, Northern Addis Ababa, Ethiopia',
    openingHours: 'Mon–Sun: 06:00 – 21:00',
    imageUrl:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000006',
    name: 'Unity Park (Grand Palace Complex)',
    category: PlaceCategory.NATURE,
    description:
      'Expansive park set inside the historic Menelik II Palace compound, featuring lush botanical gardens, historical throne halls, a regional heritage zoo, and contemporary sculptures.',
    address: 'Menelik II Palace, Addis Ababa, Ethiopia',
    openingHours: 'Tue–Sun: 09:00 – 17:30 (Closed Mondays)',
    imageUrl:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000007',
    name: 'Ethnological Museum',
    category: PlaceCategory.CULTURE,
    description:
      'Housed within Emperor Haile Selassie’s former Guenete Leul Palace, this world-class museum depicts the cultural traditions, sacred icons, musical instruments, and lifecycle ceremonies of Ethiopia.',
    address: 'Sidist Kilo, Addis Ababa University Main Campus, Ethiopia',
    openingHours: 'Mon–Fri: 08:30 – 17:00, Sat–Sun: 09:00 – 17:00',
    imageUrl:
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000008',
    name: "Red Terror Martyrs' Memorial Museum",
    category: PlaceCategory.CULTURE,
    description:
      'A deeply moving memorial museum commemorating victims of the Derg military regime, preserving survivor testimonials, photographs, and personal artifacts.',
    address: 'Meskel Square, Addis Ababa, Ethiopia',
    openingHours: 'Mon–Sun: 08:30 – 18:30',
    imageUrl:
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000009',
    name: 'Fendika Cultural Centre',
    category: PlaceCategory.ENTERTAINMENT,
    description:
      'Celebrated live music and artistic sanctuary in Kazanchis founded by dancer Melaku Belay, showcasing electrifying Ethio-jazz, traditional Azmari troubadours, and poetry.',
    address: 'Zewditu St, Kazanchis, Addis Ababa, Ethiopia',
    openingHours: 'Mon–Sun: 16:00 – 01:00',
    imageUrl:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a0000001-0000-4000-8000-000000000010',
    name: 'Bole Medhane Alem Boulevard',
    category: PlaceCategory.ENTERTAINMENT,
    description:
      'Lively urban promenade lined with rooftop terraces, boutique cafes, international restaurants, cinemas, and contemporary fashion outlets in the heart of Bole.',
    address: 'Cameroon St, Bole, Addis Ababa, Ethiopia',
    openingHours: 'Mon–Sun: 10:00 – 02:00',
    imageUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  },
];

export const REVIEWS = [
  // Place 1: National Museum of Ethiopia (3 reviews)
  {
    id: 'r0000001-0000-4000-8000-000000000001',
    placeId: 'a0000001-0000-4000-8000-000000000001',
    userId: '11111111-1111-4111-8111-111111111111',
    rating: 5,
    body: 'Seeing the original Lucy hominid cast and the ancient imperial crowns was truly unforgettable. An essential stop for any traveler in Addis.',
  },
  {
    id: 'r0000001-0000-4000-8000-000000000002',
    placeId: 'a0000001-0000-4000-8000-000000000001',
    userId: '22222222-2222-4222-8222-222222222222',
    rating: 4,
    body: 'Fascinating paleontology and art galleries. The exhibits are rich with history, though bilingual interpretive signage could be expanded.',
  },
  {
    id: 'r0000001-0000-4000-8000-000000000003',
    placeId: 'a0000001-0000-4000-8000-000000000001',
    userId: '33333333-3333-4333-8333-333333333333',
    rating: 5,
    body: 'A deeply humbling collection covering human origins. Very affordable admission and friendly, knowledgeable museum guides.',
  },

  // Place 2: Holy Trinity Cathedral (2 reviews)
  {
    id: 'r0000001-0000-4000-8000-000000000004',
    placeId: 'a0000001-0000-4000-8000-000000000002',
    userId: '11111111-1111-4111-8111-111111111111',
    rating: 5,
    body: 'Remarkable copper domes, intricate stained glass artwork, and imperial crypts. The serene cathedral gardens provide a peaceful retreat.',
  },
  {
    id: 'r0000001-0000-4000-8000-000000000005',
    placeId: 'a0000001-0000-4000-8000-000000000002',
    userId: '22222222-2222-4222-8222-222222222222',
    rating: 4,
    body: 'Historical grandeur and spiritual significance. The guided walk through the royal cemetery was respectful and insightful.',
  },

  // Place 3: 2000 Habesha Cultural Restaurant (2 reviews)
  {
    id: 'r0000001-0000-4000-8000-000000000006',
    placeId: 'a0000001-0000-4000-8000-000000000003',
    userId: '11111111-1111-4111-8111-111111111111',
    rating: 5,
    body: 'Superb cultural banquet! The spicy doro wat and cold tej paired with energetic Gurage and Tigray folk dances made for an amazing night.',
  },
  {
    id: 'r0000001-0000-4000-8000-000000000007',
    placeId: 'a0000001-0000-4000-8000-000000000003',
    userId: '33333333-3333-4333-8333-333333333333',
    rating: 4,
    body: 'Generous injera platters with great variety for both meat lovers and vegetarians. Arrive early on weekends to secure decent stage views.',
  },

  // Place 4: Tomoca Coffee (Piazza) (3 reviews)
  {
    id: 'r0000001-0000-4000-8000-000000000008',
    placeId: 'a0000001-0000-4000-8000-000000000004',
    userId: '11111111-1111-4111-8111-111111111111',
    rating: 5,
    body: 'Unbeatable macchiato. Standing at the wood counter watching the vintage espresso machine while inhaling fresh roasted coffee is unbeatable.',
  },
  {
    id: 'r0000001-0000-4000-8000-000000000009',
    placeId: 'a0000001-0000-4000-8000-000000000004',
    userId: '22222222-2222-4222-8222-222222222222',
    rating: 5,
    body: 'The gold standard of coffee in Addis Ababa. Picked up several bags of freshly ground Harar beans to take home.',
  },
  {
    id: 'r0000001-0000-4000-8000-000000000010',
    placeId: 'a0000001-0000-4000-8000-000000000004',
    userId: '33333333-3333-4333-8333-333333333333',
    rating: 4,
    body: 'Lively, authentic ambiance in the historic Piazza district. Fast service despite the constant morning rush of patrons.',
  },

  // Place 5: Entoto Natural Park (2 reviews)
  {
    id: 'r0000001-0000-4000-8000-000000000011',
    placeId: 'a0000001-0000-4000-8000-000000000005',
    userId: '22222222-2222-4222-8222-222222222222',
    rating: 5,
    body: 'Crisp high-altitude air, beautiful eucalyptus canopy trails, and fantastic viewpoints. The park bridges and viewpoints are top quality.',
  },
  {
    id: 'r0000001-0000-4000-8000-000000000012',
    placeId: 'a0000001-0000-4000-8000-000000000005',
    userId: '33333333-3333-4333-8333-333333333333',
    rating: 4,
    body: 'Great family weekend getaway. Excellent cycling paths and horseback riding. Make sure to pack warm clothing for cloudy afternoons.',
  },

  // Place 6: Unity Park (2 reviews)
  {
    id: 'r0000001-0000-4000-8000-000000000013',
    placeId: 'a0000001-0000-4000-8000-000000000006',
    userId: '11111111-1111-4111-8111-111111111111',
    rating: 5,
    body: 'A masterpiece of urban renewal. Restoring Menelik II’s banquet palace while adding regional culture pavilions and gardens was brilliantly executed.',
  },
  {
    id: 'r0000001-0000-4000-8000-000000000014',
    placeId: 'a0000001-0000-4000-8000-000000000006',
    userId: '22222222-2222-4222-8222-222222222222',
    rating: 4,
    body: 'Spotlessly clean, well organized, and educational. The historical state throne hall and royal quarters are fascinating.',
  },

  // Place 7: Ethnological Museum (2 reviews)
  {
    id: 'r0000001-0000-4000-8000-000000000015',
    placeId: 'a0000001-0000-4000-8000-000000000007',
    userId: '22222222-2222-4222-8222-222222222222',
    rating: 5,
    body: 'One of the finest anthropological museums in Africa. The narrative structure following childhood, marriage, and elderhood is inspired.',
  },
  {
    id: 'r0000001-0000-4000-8000-000000000016',
    placeId: 'a0000001-0000-4000-8000-000000000007',
    userId: '33333333-3333-4333-8333-333333333333',
    rating: 4,
    body: 'Walking through Haile Selassie’s preserved bedrooms and the palace library surrounded by the peaceful Addis Ababa University gardens.',
  },

  // Place 8: Red Terror Martyrs' Memorial Museum (2 reviews)
  {
    id: 'r0000001-0000-4000-8000-000000000017',
    placeId: 'a0000001-0000-4000-8000-000000000008',
    userId: '11111111-1111-4111-8111-111111111111',
    rating: 5,
    body: 'A poignant and sobering chronicle of a tragic era. The docents are personal survivors whose stories bring profound depth to the memorial.',
  },
  {
    id: 'r0000001-0000-4000-8000-000000000018',
    placeId: 'a0000001-0000-4000-8000-000000000008',
    userId: '33333333-3333-4333-8333-333333333333',
    rating: 5,
    body: 'Intensely moving exhibition at Meskel Square. Donating at the exit helps preserve the archives and support educational remembrance.',
  },

  // Place 9: Fendika Cultural Centre (1 review - fulfills requirement of place with only 1 or 2 reviews)
  {
    id: 'r0000001-0000-4000-8000-000000000019',
    placeId: 'a0000001-0000-4000-8000-000000000009',
    userId: '11111111-1111-4111-8111-111111111111',
    rating: 5,
    body: 'Electrifying artistic soul of Addis. Legendary Ethio-jazz sets, passionate folk performances, and welcoming bohemian crowd.',
  },

  // Place 10: Bole Medhane Alem Boulevard (1 review - fulfills requirement of place with only 1 or 2 reviews)
  {
    id: 'r0000001-0000-4000-8000-000000000020',
    placeId: 'a0000001-0000-4000-8000-000000000010',
    userId: '22222222-2222-4222-8222-222222222222',
    rating: 4,
    body: 'Modern, bustling strip with diverse dessert bars, cinema multiplexes, and lively cafes. Great place for an evening stroll.',
  },
];

// Deterministic UUID generator from seed string
export function deterministicUuid(seed: string): string {
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  return (
    hash.slice(0, 8) +
    '-' +
    hash.slice(8, 12) +
    '-4' +
    hash.slice(13, 16) +
    '-a' +
    hash.slice(17, 20) +
    '-' +
    hash.slice(20, 32)
  );
}

// Legacy slot definitions preserved for backward compatibility with existing tests
const LEGACY_SLOT_DEFS: Record<string, { id: string; startsAt: Date; capacity: number }> = {
  'a0000001-0000-4000-8000-000000000001-0': {
    id: 'b0000001-0000-4000-8000-000000000001',
    startsAt: new Date('2027-01-15T09:30:00Z'),
    capacity: 15,
  },
  'a0000001-0000-4000-8000-000000000001-1': {
    id: 'b0000001-0000-4000-8000-000000000002',
    startsAt: new Date('2027-01-16T14:00:00Z'),
    capacity: 12,
  },
  'a0000001-0000-4000-8000-000000000002-0': {
    id: 'b0000001-0000-4000-8000-000000000003',
    startsAt: new Date('2027-01-18T10:00:00Z'),
    capacity: 20,
  },
  'a0000001-0000-4000-8000-000000000005-0': {
    id: 'b0000001-0000-4000-8000-000000000004',
    startsAt: new Date('2027-01-20T08:00:00Z'),
    capacity: 10,
  },
  'a0000001-0000-4000-8000-000000000006-0': {
    id: 'b0000001-0000-4000-8000-000000000005',
    startsAt: new Date('2027-01-22T10:30:00Z'),
    capacity: 25,
  },
  'a0000001-0000-4000-8000-000000000007-0': {
    id: 'b0000001-0000-4000-8000-000000000006',
    startsAt: new Date('2027-01-25T11:00:00Z'),
    capacity: 15,
  },
};

// Legacy booking IDs preserved for backward compatibility
const LEGACY_BOOKING_MAP: Record<string, string> = {
  'b0000001-0000-4000-8000-000000000001-11111111-1111-4111-8111-111111111111':
    'c0000001-0000-4000-8000-000000000001',
  'b0000001-0000-4000-8000-000000000001-22222222-2222-4222-8222-222222222222':
    'c0000001-0000-4000-8000-000000000002',
  'b0000001-0000-4000-8000-000000000003-33333333-3333-4333-8333-333333333333':
    'c0000001-0000-4000-8000-000000000003',
  'b0000001-0000-4000-8000-000000000004-11111111-1111-4111-8111-111111111111':
    'c0000001-0000-4000-8000-000000000004',
};

export interface TourSlotSeedData {
  id: string;
  placeId: string;
  startsAt: Date;
  capacity: number;
}

export interface BookingSeedData {
  id: string;
  slotId: string;
  userId: string;
  seats: number;
}

interface ScheduleTemplate {
  monthOffset: number; // 0 = Jan 2027, 1 = Feb 2027
  baseDay: number;
  hour: number;
  minute: number;
  capacity: number;
}

// Realistic schedule templates tailored to each destination category
const CATEGORY_SCHEDULE_TEMPLATES: Record<PlaceCategory, ScheduleTemplate[]> = {
  HISTORY: [
    { monthOffset: 0, baseDay: 15, hour: 9, minute: 30, capacity: 15 },
    { monthOffset: 0, baseDay: 23, hour: 14, minute: 0, capacity: 12 },
    { monthOffset: 1, baseDay: 6, hour: 10, minute: 30, capacity: 18 },
  ],
  FOOD: [
    { monthOffset: 0, baseDay: 17, hour: 12, minute: 30, capacity: 14 },
    { monthOffset: 0, baseDay: 25, hour: 18, minute: 30, capacity: 16 },
    { monthOffset: 1, baseDay: 9, hour: 19, minute: 0, capacity: 12 },
  ],
  NATURE: [
    { monthOffset: 0, baseDay: 18, hour: 8, minute: 30, capacity: 10 },
    { monthOffset: 0, baseDay: 27, hour: 11, minute: 0, capacity: 25 },
    { monthOffset: 1, baseDay: 12, hour: 14, minute: 30, capacity: 15 },
  ],
  CULTURE: [
    { monthOffset: 0, baseDay: 19, hour: 10, minute: 0, capacity: 16 },
    { monthOffset: 0, baseDay: 28, hour: 14, minute: 30, capacity: 18 },
    { monthOffset: 1, baseDay: 14, hour: 11, minute: 0, capacity: 15 },
  ],
  ENTERTAINMENT: [
    { monthOffset: 0, baseDay: 20, hour: 16, minute: 30, capacity: 15 },
    { monthOffset: 0, baseDay: 29, hour: 19, minute: 30, capacity: 12 },
    { monthOffset: 1, baseDay: 16, hour: 20, minute: 0, capacity: 15 },
  ],
};

/**
 * Dynamically generates multiple upcoming tour slots for every destination.
 * Uses real place records and IDs, automatically adapting to all places in the database.
 */
export function generateTourSlotsForPlaces(
  places: Array<{ id: string; category: PlaceCategory; name: string }>
): TourSlotSeedData[] {
  const slots: TourSlotSeedData[] = [];

  places.forEach((place, placeIndex) => {
    const templates = CATEGORY_SCHEDULE_TEMPLATES[place.category] || CATEGORY_SCHEDULE_TEMPLATES.HISTORY;

    templates.forEach((tmpl, slotIndex) => {
      const legacyKey = `${place.id}-${slotIndex}`;
      if (LEGACY_SLOT_DEFS[legacyKey]) {
        slots.push({
          id: LEGACY_SLOT_DEFS[legacyKey].id,
          placeId: place.id,
          startsAt: LEGACY_SLOT_DEFS[legacyKey].startsAt,
          capacity: LEGACY_SLOT_DEFS[legacyKey].capacity,
        });
        return;
      }

      // Generate deterministic slot ID
      const slotId = deterministicUuid(`wayfarer-slot-${place.id}-${slotIndex}`);

      // Stagger dates across destinations so every destination has its own unique timetable
      const dayStagger = (placeIndex * 2) % 5;
      const scheduledDay = tmpl.baseDay + dayStagger;
      const startsAt = new Date(
        Date.UTC(2027, tmpl.monthOffset, scheduledDay, tmpl.hour, tmpl.minute, 0)
      );

      // Special demonstration: for Bole Medhane Alem Boulevard Slot 2, capacity 5 will be fully booked (Sold Out)
      let capacity = tmpl.capacity;
      if (place.name.includes('Bole Medhane Alem') && slotIndex === 2) {
        capacity = 5;
      }

      slots.push({
        id: slotId,
        placeId: place.id,
        startsAt,
        capacity,
      });
    });
  });

  return slots;
}

/**
 * Dynamically generates realistic bookings for tour slots across destinations.
 * Demonstrates remaining seat calculations, full availability, and sold-out states.
 */
export function generateBookingsForSlots(slots: TourSlotSeedData[]): BookingSeedData[] {
  const bookings: BookingSeedData[] = [];

  // Group slots by placeId
  const slotsByPlace: Record<string, TourSlotSeedData[]> = {};
  for (const slot of slots) {
    if (!slotsByPlace[slot.placeId]) {
      slotsByPlace[slot.placeId] = [];
    }
    slotsByPlace[slot.placeId].push(slot);
  }

  // Pre-seed diverse booking scenarios for each destination
  Object.keys(slotsByPlace).forEach((placeId, pIdx) => {
    const placeSlots = slotsByPlace[placeId];
    if (placeSlots.length === 0) return;

    const slot0 = placeSlots[0];

    // Determine booking distribution for Slot 0 of this destination
    switch (pIdx % 6) {
      case 0:
        // Abenezer (2) & Hana (3)
        addBooking(bookings, slot0.id, USERS[0].id, 2);
        addBooking(bookings, slot0.id, USERS[1].id, 3);
        break;
      case 1:
        // Dawit (4)
        addBooking(bookings, slot0.id, USERS[2].id, 4);
        break;
      case 2:
        // Hana (3) & Dawit (3)
        addBooking(bookings, slot0.id, USERS[1].id, 3);
        addBooking(bookings, slot0.id, USERS[2].id, 3);
        break;
      case 3:
        // Abenezer (2)
        addBooking(bookings, slot0.id, USERS[0].id, 2);
        break;
      case 4:
        // Hana (4)
        addBooking(bookings, slot0.id, USERS[1].id, 4);
        break;
      case 5:
        // Dawit (3) & Abenezer (2)
        addBooking(bookings, slot0.id, USERS[2].id, 3);
        addBooking(bookings, slot0.id, USERS[0].id, 2);
        break;
    }

    // Special demonstration: fully book Slot 2 on the last destination (capacity 5 booked by Hana 2 + Dawit 3)
    if (placeSlots.length >= 3 && pIdx === Object.keys(slotsByPlace).length - 1) {
      const soldOutSlot = placeSlots[2];
      if (soldOutSlot.capacity === 5) {
        addBooking(bookings, soldOutSlot.id, USERS[1].id, 2);
        addBooking(bookings, soldOutSlot.id, USERS[2].id, 3);
      }
    }
  });

  return bookings;
}

function addBooking(
  bookings: BookingSeedData[],
  slotId: string,
  userId: string,
  seats: number
) {
  const legacyKey = `${slotId}-${userId}`;
  const id = LEGACY_BOOKING_MAP[legacyKey] || deterministicUuid(`wayfarer-booking-${slotId}-${userId}`);
  bookings.push({
    id,
    slotId,
    userId,
    seats,
  });
}

// Initial exported lists based on the 10 core destinations
export const TOUR_SLOTS = generateTourSlotsForPlaces(PLACES);
export const BOOKINGS = generateBookingsForSlots(TOUR_SLOTS);

async function main() {
  console.log('Seeding Wayfarer database (Addis Ababa, Ethiopia)...');

  // 1. Seed Users (Upsert for idempotency)
  console.log(`Seeding ${USERS.length} users...`);
  for (const user of USERS) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { name: user.name },
      create: user,
    });
  }

  // 2. Seed Places (Upsert for idempotency)
  console.log(`Seeding ${PLACES.length} places...`);
  for (const place of PLACES) {
    await prisma.place.upsert({
      where: { id: place.id },
      update: place,
      create: place,
    });
  }

  // 3. Retrieve actual destination records from database (dynamic & automatic)
  const allDbPlaces = await prisma.place.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, category: true, name: true },
  });
  console.log(`Found ${allDbPlaces.length} destination records in database.`);

  // 4. Generate & Seed Tour Slots for EVERY destination
  const allTourSlots = generateTourSlotsForPlaces(allDbPlaces);
  console.log(`Seeding ${allTourSlots.length} tour slots across ${allDbPlaces.length} destinations...`);
  for (const slot of allTourSlots) {
    await prisma.tourSlot.upsert({
      where: { id: slot.id },
      update: {
        startsAt: slot.startsAt,
        capacity: slot.capacity,
      },
      create: slot,
    });
  }

  // 5. Seed Reviews (Upsert on composite unique key [placeId, userId])
  console.log(`Seeding ${REVIEWS.length} reviews...`);
  for (const review of REVIEWS) {
    await prisma.review.upsert({
      where: {
        placeId_userId: {
          placeId: review.placeId,
          userId: review.userId,
        },
      },
      update: {
        rating: review.rating,
        body: review.body,
      },
      create: review,
    });
  }

  // 6. Generate & Seed Bookings for Tour Slots
  const allBookings = generateBookingsForSlots(allTourSlots);
  console.log(`Seeding ${allBookings.length} bookings...`);
  for (const booking of allBookings) {
    await prisma.booking.upsert({
      where: {
        slotId_userId: {
          slotId: booking.slotId,
          userId: booking.userId,
        },
      },
      update: {
        seats: booking.seats,
      },
      create: booking,
    });
  }

  console.log('Database seeding complete:');
  console.log(`- ${USERS.length} users`);
  console.log(`- ${allDbPlaces.length} places`);
  console.log(`- ${REVIEWS.length} reviews`);
  console.log(`- ${allTourSlots.length} tour slots (${allDbPlaces.length} destinations covered)`);
  console.log(`- ${allBookings.length} bookings`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('Error during database seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
