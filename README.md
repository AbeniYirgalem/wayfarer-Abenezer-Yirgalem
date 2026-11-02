# Wayfarer — Honest Ratings, Fair Bookings

Wayfarer is a full-stack travel discovery and guided-tour booking application designed to provide travelers with transparent, authentic place rankings and guaranteed fair tour bookings without overbooking.

This project is part of the Full-Stack Engineer internship take-home assignment for **Rago Software Solutions**.

---

## Technology Stack

- **Frontend:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **Backend:** Next.js Route Handlers
- **Database:** PostgreSQL 17 (via Docker Compose)
- **ORM:** Prisma ORM 7 with PostgreSQL driver adapter (`@prisma/adapter-pg` and `pg`)
- **Validation:** Zod
- **Testing:** Vitest
- **Package Manager:** npm
- **Version Control:** Git and GitHub

---

## Architecture Overview

Wayfarer follows a **modular monolithic architecture** organized into separate, decoupled layers:

```text
wayfarer/
├── prisma/
│   ├── schema.prisma           # Prisma 7 database schema (User, Place, Review, TourSlot, Booking)
│   ├── seed.ts                 # Idempotent database seed script (Addis Ababa, Ethiopia)
│   └── migrations/             # Applied database migrations & SQL check constraints
│
├── public/
│   └── images/                 # Static assets and placeholders
│
├── src/
│   ├── app/                    # Next.js App Router presentation layer
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Application entry page
│   │   ├── globals.css         # Tailwind CSS entry
│   │   ├── places/
│   │   │   └── [id]/page.tsx   # Place detail page placeholder
│   │   ├── api/                # API Route Handlers
│   │   │   ├── places/
│   │   │   ├── tours/
│   │   │   └── users/
│   │   ├── not-found.tsx       # 404 handler
│   │   └── error.tsx           # Error boundary
│   │
│   ├── components/             # Reusable UI components by domain
│   │   ├── layout/
│   │   ├── places/
│   │   ├── reviews/
│   │   ├── tours/
│   │   └── ui/
│   │
│   ├── lib/                    # Shared infrastructure modules
│   │   ├── prisma.ts           # Reusable PrismaClient instance with pg connection pool
│   │   ├── utils.ts            # Utility functions
│   │   └── validations/        # Zod validation schemas
│   │
│   ├── services/               # Business logic layer
│   │   ├── place.service.ts
│   │   ├── review.service.ts
│   │   ├── ranking.service.ts  # Honest ranking algorithm logic
│   │   └── booking.service.ts  # Concurrency-safe booking logic
│   │
│   └── types/                  # Shared TypeScript interfaces & types
│       └── index.ts
│
├── tests/                      # Automated test suites (Vitest)
│   ├── ranking.test.ts
│   └── booking-concurrency.test.ts
│
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore rules
├── docker-compose.yml          # PostgreSQL 17 service configuration
├── prisma.config.ts            # Prisma 7 configuration file
├── DECISIONS.md                # Architectural Decision Records (ADRs)
├── AI_USAGE.md                 # AI usage disclosure and engineering log
└── package.json
```

---

## Prerequisites

Ensure the following tools are installed on your machine:

- **Node.js**: v20 or v24+
- **npm**: v10+
- **Docker & Docker Compose**: Docker Desktop or Docker engine with Compose v2+
- **Git**

---

## Installation & Setup

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/AbeniYirgalem/wayfarer-Abenezer-Yirgalem.git
cd wayfarer-Abenezer-Yirgalem
npm install
```

### 2. Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Review `.env` to verify your database credentials:

```env
POSTGRES_USER=wayfarer
POSTGRES_PASSWORD=wayfarer_password
POSTGRES_DB=wayfarer
POSTGRES_PORT=5432

DATABASE_URL="postgresql://wayfarer:wayfarer_password@localhost:5432/wayfarer?schema=public"
```

> **Note**: If your local machine already runs another PostgreSQL service on port `5432`, set `POSTGRES_PORT=5433` and update the port in `DATABASE_URL` accordingly (`localhost:5433`).

---

## Dedicated Database Setup & Management

Follow these exact steps to initialize, migrate, and seed the database:

### 1. Start PostgreSQL with Docker Compose

Start the PostgreSQL 17 database container with persistent storage and health check:

```bash
docker compose up -d
```

Verify that the container is healthy:

```bash
docker compose ps
```

### 2. Apply Prisma Migrations

Apply the database migrations (including relational indexes, composite unique keys, and PostgreSQL check constraints):

```bash
npm run prisma:deploy
```

*For local interactive migration creation during active development:*
```bash
npm run prisma:migrate
```

### 3. Generate Prisma Client

Generate the type-safe Prisma Client:

```bash
npm run prisma:generate
```

### 4. Seed the Database

Seed the database with sample data for **Addis Ababa, Ethiopia**:

```bash
npm run prisma:seed
```

> **Idempotency Guarantee**: The seed script uses deterministic UUIDs and `upsert` operations. Running `npm run prisma:seed` multiple times will never create duplicate records or violate database constraints.

### 5. Launch Prisma Studio

Inspect and verify database records interactively via Prisma Studio:

```bash
npm run prisma:studio
```

Prisma Studio will open at [http://localhost:5555](http://localhost:5555).

### 6. Verify Database Sample Records

You can verify that all sample records are populated and constraints are intact by running:

```bash
npx tsx --env-file=.env -e "
import prisma from './src/lib/prisma';
async function check() {
  const [users, places, reviews, slots, bookings] = await Promise.all([
    prisma.user.count(),
    prisma.place.count(),
    prisma.review.count(),
    prisma.tourSlot.count(),
    prisma.booking.count(),
  ]);
  console.log('Database Status:');
  console.log({ users, places, reviews, slots, bookings });
}
check().then(() => process.exit(0));
"
```

Expected output:
```json
{ "users": 3, "places": 10, "reviews": 20, "slots": 6, "bookings": 4 }
```

---

## Seed Data Summary (Addis Ababa, Ethiopia)

### Users (3 Sample Users for Acting-As Switcher)
1. **Abenezer** (`11111111-1111-4111-8111-111111111111`)
2. **Hana** (`22222222-2222-4222-8222-222222222222`)
3. **Dawit** (`33333333-3333-4333-8333-333333333333`)

### Places (10 Places Across All 5 Categories)
- **HISTORY**: National Museum of Ethiopia, Holy Trinity Cathedral (Kidist Selassie)
- **FOOD**: 2000 Habesha Cultural Restaurant, Tomoca Coffee (Piazza)
- **NATURE**: Entoto Natural Park, Unity Park (Grand Palace Complex)
- **CULTURE**: Ethnological Museum, Red Terror Martyrs' Memorial Museum
- **ENTERTAINMENT**: Fendika Cultural Centre, Bole Medhane Alem Boulevard

### Reviews (20 Reviews)
- Every place has at least one review.
- Most places have 2–3 reviews from multiple seeded users.
- Places 9 and 10 have 1 review each (satisfying the requirement of places with 1–2 reviews).
- All ratings are integers between 1 and 5.
- Composite unique constraint `@@unique([placeId, userId])` prevents duplicate reviews.

### Tour Slots & Bookings (6 Slots, 4 Bookings)
- All slots have valid future start times (`2027`) and realistic positive capacities (10–25 seats).
- Sample bookings reference valid users and slots with positive seats.
- Total booked seats never exceed slot capacities.
- Composite unique constraint `@@unique([slotId, userId])` prevents duplicate bookings for the same slot.

---

## Database Integrity & Check Constraints

In addition to Prisma foreign key cascades and composite unique constraints, the database enforces PostgreSQL-level `CHECK` constraints:
- `check_review_rating_range`: `rating >= 1 AND rating <= 5`
- `check_review_body_not_empty`: `char_length(trim(body)) > 0 AND char_length(body) <= 500`
- `check_tour_slot_capacity_positive`: `capacity > 0`
- `check_booking_seats_positive`: `seats > 0`

---

## Running the Application

### Development Mode

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port displayed in your terminal).

### Running Automated Tests

Run the test suite using Vitest:

```bash
npm test
```

### Type Checking & Linting

```bash
# Type check
npm run typecheck

# Lint check
npm run lint

# Production build
npm run build
```

---

## Implementation Status

- [x] **Phase 1: Project Setup & Architecture**
  - Next.js App Router with TypeScript & Tailwind CSS
  - PostgreSQL 17 configured in Docker Compose with health check
  - Prisma 7 configured with `@prisma/adapter-pg` and `prisma.config.ts`
  - Vitest test runner, strict TypeScript, and ESLint configured
- [x] **Phase 2: Database Implementation & Seed Data**
  - 5 core models (`User`, `Place`, `Review`, `TourSlot`, `Booking`) with `PlaceCategory` enum
  - Composite unique constraints (`[placeId, userId]`, `[slotId, userId]`) and relational indexes
  - Database-level PostgreSQL `CHECK` constraints
  - Idempotent seed script (`prisma/seed.ts`) with 3 users, 10 places in Addis Ababa, 20 reviews, 6 future tour slots, and 4 bookings
  - Database management npm scripts configured
- [ ] **Phase 3: Core Features & User Workflows** *(Upcoming)*
  - Places discovery and category browsing
  - Reviews submission and honest ranking calculations
  - Tour slot booking and concurrency control against overbooking
  - Acting-as user switcher UI
