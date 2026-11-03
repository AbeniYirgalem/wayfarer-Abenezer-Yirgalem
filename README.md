# Wayfarer — Honest Ratings, Fair Bookings

> A full-stack travel discovery and guided-tour booking application engineered to solve two fundamental problems in modern travel platforms: **misleading place rankings** and **tour overbooking**.

---

## 1. Project Overview & Value Proposition

Wayfarer offers travelers an authentic, reliable platform to:
- **Discover places** across diverse categories (History, Food, Nature, Culture, Entertainment) in Addis Ababa, Ethiopia.
- **Experience Honest Rankings**: Powered by a **Bayesian weighted rating algorithm** ($WR = \frac{v}{v+m} R + \frac{m}{v+m} C$) that prevents 1-review outliers from unfairly dominating places with dozens of verified positive reviews.
- **Fair, Overbooking-Proof Bookings**: Powered by **PostgreSQL pessimistic row-level locking** (`SELECT ... FOR UPDATE`) inside atomic database transactions, guaranteeing that concurrent seat reservations never exceed capacity.
- **Read & submit verified reviews** protected by database-level composite unique keys (`[placeId, userId]`) and check constraints.
- **Switch Traveler Identities**: Integrated acting-as user switcher simulating verified traveler personas with persistent client session state.

---

## 2. Architecture & Monorepo Structure

Wayfarer is engineered as a **strictly decoupled monorepo** consisting of two independent applications:
1. **Frontend (`frontend/`)**: Next.js (App Router), React 19, TypeScript, and Tailwind CSS. Acts strictly as the client presentation layer with no direct database access.
2. **Backend (`backend/`)**: Node.js, Express.js, TypeScript REST API. Contains all domain business logic, data access, database constraints, migrations, and seed data.
3. **Database**: PostgreSQL 17 managed via Docker Compose (`docker-compose.yml`) and accessed exclusively by the Express backend using Prisma ORM 7 (`@prisma/adapter-pg`).

```text
wayfarer/
│
├── frontend/                     # Next.js App Router presentation layer
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── layout.tsx        # Global layout with UserProvider, Navbar, Footer
│   │   │   ├── page.tsx          # Homepage with Hero, Category tabs, PlaceGrid
│   │   │   ├── globals.css       # Design tokens & Tailwind theme configuration
│   │   │   ├── loading.tsx       # Global skeleton loader
│   │   │   ├── error.tsx         # Global error boundary with retry
│   │   │   ├── not-found.tsx     # 404 destination uncharted view
│   │   │   └── places/
│   │   │       └── [id]/
│   │   │           └── page.tsx  # Dynamic destination detail, reviews & tour booking
│   │   │
│   │   ├── components/
│   │   │   ├── layout/           # Navbar, Footer, UserSwitcher
│   │   │   ├── home/             # HeroSection, CategoryFilter, FeaturedPlaces
│   │   │   ├── places/           # PlaceCard, PlaceGrid, PlaceRating, PlaceDetailsHeader
│   │   │   ├── reviews/          # ReviewCard, ReviewList, ReviewForm
│   │   │   ├── tours/            # TourSlotCard, TourSlotList, BookingModal
│   │   │   └── ui/               # Icons, Button, Input, Skeleton, EmptyState, Toast
│   │   │
│   │   ├── context/
│   │   │   └── UserContext.tsx   # Acting traveler identity state & localStorage sync
│   │   ├── lib/
│   │   │   ├── api.ts            # Centralized typed HTTP API client
│   │   │   └── utils.ts          # Category metadata, date formatters, cn helper
│   │   └── types/                # Domain types matching Express backend payloads
│   ├── public/                   # Static assets & icons
│   ├── .env.example              # NEXT_PUBLIC_API_URL=http://localhost:5000/api
│   ├── package.json              # Frontend dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration for Next.js
│   ├── eslint.config.mjs         # ESLint configuration
│   └── next.config.ts            # Next.js configuration (remote Unsplash images)
│
├── backend/                      # Express.js REST API service layer
│   ├── src/
│   │   ├── config/               # Environment variable loading and typed config
│   │   ├── controllers/          # Express route controllers (places, reviews, bookings, users, health)
│   │   ├── routes/               # Express API routers mounted at /api
│   │   ├── services/             # Business logic layer (places, reviews, bookings, rankings, users)
│   │   ├── middleware/           # Centralized error handler, 404 handler, and Zod validator
│   │   ├── validations/          # Zod request validation schemas
│   │   ├── lib/                  # Prisma client singleton & connection pool
│   │   ├── utils/                # AppError and standard response formatting helpers
│   │   ├── types/                # Backend domain and Prisma types
│   │   ├── app.ts                # Express application configuration & middleware pipeline
│   │   └── server.ts             # Server entry point (starts on port 5000)
│   ├── prisma/
│   │   ├── schema.prisma         # Prisma data models and relations
│   │   ├── prisma.config.ts      # Prisma 7 configuration file
│   │   ├── migrations/           # Version-controlled database migrations & CHECK constraints
│   │   └── seed.ts               # Idempotent database seed script (Addis Ababa dataset)
│   ├── tests/                    # Vitest test suite (40 passing tests across 8 suites)
│   │   ├── ranking.test.ts       # Bayesian weighted ranking verification
│   │   ├── review.test.ts        # Review upsert and validation verification
│   │   ├── booking.test.ts       # Booking availability calculation and limits
│   │   ├── booking-concurrency.test.ts # Parallel concurrency stress test (FOR UPDATE)
│   │   ├── place.test.ts         # Places listing, filtering, search, and details
│   │   ├── user.test.ts          # Seeded users retrieval
│   │   ├── constraints.test.ts   # Database constraints & integrity verification test
│   │   └── health.test.ts        # API health check integration test
│   ├── .env.example              # Backend environment configuration template
│   ├── package.json              # Backend dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration for Node.js
│   └── vitest.config.ts          # Vitest test runner configuration
│
├── docker-compose.yml            # PostgreSQL 17 Alpine database container configuration
├── .gitignore                    # Monorepo-wide Git ignore rules
├── package.json                  # Root monorepo convenience scripts
├── README.md                     # Comprehensive project documentation
├── DECISIONS.md                  # Architectural Decision Records (ADRs)
└── AI_USAGE.md                   # Transparent log of AI tooling & manual modifications
```

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide-style SVG icons |
| **Backend** | Node.js, Express.js 4/5, TypeScript, REST API |
| **Database & ORM** | PostgreSQL 17 Alpine, Prisma ORM 7 (`@prisma/adapter-pg`, `pg.Pool`) |
| **Validation** | Zod |
| **Testing** | Vitest, Supertest |
| **Containerization** | Docker, Docker Compose |

---

## 4. Frontend Features & User Experience (Phase 4)

### 1. Acting-as User Switcher (`UserSwitcher.tsx`)
- Located directly in the top navigation bar.
- Fetches real seeded users from `GET /api/users` (`Abenezer`, `Hana`, `Dawit`).
- Persists selected user ID in `localStorage` across page navigations and browser refreshes.
- Attaches the selected user ID as the `X-User-Id` header on all review submissions and tour bookings.
- Clearly flags unauthenticated actions with warning banners if no user is chosen.

### 2. Editorial Discovery Homepage (`page.tsx`)
- **Hero Section**: Large travel photography, search input, explore CTA, quick quality badges.
- **Category Filter Tabs**: All Places, History, Food, Nature, Culture, and Entertainment with active states.
- **Top-Rated Toggle**: Directly queries `GET /api/places?sort=top-rated` to order places by Bayesian weighted score.
- **Search Integration**: Debounced search querying `GET /api/places?search=...` against destination titles and descriptions.
- **Interactive Destination Grid**: Responsive cards with hover image zoom, opening hours, location badges, star visualizations, and honest rank badges.

### 3. Place Details Experience (`/places/[id]`)
- **Editorial Header**: Image banner, category tags, location metadata, opening hours, and honest rating explainer.
- **Real-Time Tour Slots & Booking**:
  - Displays all upcoming departure slots, start time, total capacity, and available seats.
  - "Reserve Seats" modal with interactive seat counter ($1 \le seats \le available$).
  - Full capacity protection and clear `409 Conflict` messaging: *"Sorry, those seats are no longer available. Please choose another time or a smaller group."*
  - Instant background refresh upon successful booking.
- **Verified Reviews & Form**:
  - Chronological list of traveler reviews with author names and dates.
  - Interactive review submission form with 1–5 star selector and 500-character counter.
  - Transparent upsert behavior: automatically switches between "Publish Review" (for first-time reviewers) and "Update Review" (for repeat reviewers), preventing duplicate records and updating place stats in real time.

---

## 5. REST API Specification

All backend endpoints are mounted under `/api` and return standardized JSON envelopes.

| Method | Endpoint | Description | Auth / Headers | Key Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check | None | `200 OK` |
| `GET` | `/api/users` | List seeded users for switcher | None | `200 OK` |
| `GET` | `/api/places` | List & filter places with Bayesian rating | Query: `category`, `search`, `sort` | `200 OK`, `400 Bad Request` |
| `GET` | `/api/places/:id` | Get place details, reviews, tour availability | None | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/api/places/:id/reviews` | Submit or update review (upsert) | `X-User-Id: <UUID>` | `201 Created`, `200 OK`, `400`, `404`, `409` |
| `GET` | `/api/tours/:id/bookings` | Get tour slot capacity & availability | None | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/api/tours/:id/bookings` | Concurrency-safe tour seat reservation | `X-User-Id: <UUID>` | `201 Created`, `400`, `404`, `409 Conflict` |

---

## 6. Local Setup & Execution Instructions

### Step 1: Clone Repository & Configure Environment

```bash
# Clone the repository
git clone https://github.com/AbeniYirgalem/wayfarer-Abenezer-Yirgalem.git
cd wayfarer

# Configure Backend Environment
cp backend/.env.example backend/.env

# Configure Frontend Environment
cp frontend/.env.example frontend/.env.local
```

### Step 2: Database Setup & Operations

```bash
# 1. Start PostgreSQL 17 in background via Docker
docker compose up -d

# 2. Run backend migrations and seed data
npm run db:migrate --prefix backend
npm run db:seed --prefix backend
```

### Step 3: Run Applications

In two separate terminals:

```bash
# Terminal 1: Start Express.js Backend (port 5000)
npm run dev:backend

# Terminal 2: Start Next.js Frontend (port 3000)
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000) to view the Wayfarer application.

### Step 4: Verification Commands

```bash
# Verify backend unit & concurrency tests
npm run test:backend

# Verify TypeScript compilation
npm run typecheck:backend
npm run typecheck:frontend

# Verify ESLint on frontend
npm run lint:frontend

# Verify production builds
npm run build:backend
npm run build:frontend
```
