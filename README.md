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
│   ├── seed.ts                 # Database seed script (scheduled for Phase 2)
│   └── migrations/             # Applied database migrations
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
- **Docker & Docker Compose**: Docker Desktop with Compose v2+
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

> **Note**: If your local machine already runs another PostgreSQL service on port `5432`, you can set `POSTGRES_PORT=5433` and update the port in `DATABASE_URL` accordingly (`localhost:5433`).

---

## Database Management

### 1. Start PostgreSQL with Docker Compose

Start the PostgreSQL 17 database container with persistent storage and health check:

```bash
docker compose up -d
```

Check the health status of the database:

```bash
docker compose ps
```

### 2. Run Database Migrations

Apply the Prisma migrations to generate the schema:

```bash
npx prisma migrate dev
```

### 3. Generate Prisma Client

Generate the type-safe Prisma Client:

```bash
npx prisma generate
```

### 4. (Optional) Launch Prisma Studio

Inspect database records interactively via Prisma Studio:

```bash
npx prisma studio
```

---

## Running the Application

### Development Mode

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port indicated in your console) to view the application.

### Running Automated Tests

Run the test suite using Vitest:

```bash
npm test
```

### Type Checking & Linting

```bash
# Type check
npx tsc --noEmit

# Lint check
npm run lint

# Production build
npm run build
```

---

## Implementation Status (Phase 1)

- [x] Next.js App Router with TypeScript & Tailwind CSS initialized
- [x] PostgreSQL 17 configured in Docker Compose with health check and persistent volumes
- [x] Prisma 7 configured with `@prisma/adapter-pg` and `prisma.config.ts`
- [x] Core schema with 5 entities: `User`, `Place`, `Review`, `TourSlot`, `Booking`
- [x] Database-level integrity: UUID primary keys, composite unique constraints (`[userId, placeId]`, `[userId, tourSlotId]`), indexes
- [x] Layered architecture scaffolded (`presentation`, `api`, `services`, `data access`, `validation`)
- [x] Vitest test runner configured and passing
- [x] Strict TypeScript and ESLint verification passing
- [ ] Phase 2: Place discovery, categories, reviews, acting-as user switcher, seed data *(Upcoming)*
- [ ] Phase 3: Tour booking and concurrency control *(Upcoming)*
