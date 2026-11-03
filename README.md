# Wayfarer — Honest Ratings, Fair Bookings

> A full-stack travel discovery and guided-tour booking application engineered to solve two fundamental problems in modern travel platforms: **misleading place rankings** and **tour overbooking**.

---

## 1. Project Overview & Value Proposition

Wayfarer offers travelers an authentic, reliable platform to:
- **Discover places** across diverse categories (History, Food, Nature, Culture, Entertainment) in Addis Ababa, Ethiopia.
- **Experience Honest Rankings**: Powered by a **Bayesian weighted rating algorithm** ($WR = \frac{v}{v+m} R + \frac{m}{v+m} C$) that prevents 1-review outliers from unfairly dominating places with dozens of verified positive reviews.
- **Fair, Overbooking-Proof Bookings**: Powered by **PostgreSQL pessimistic row-level locking** (`SELECT ... FOR UPDATE`) inside atomic database transactions, guaranteeing that concurrent seat reservations never exceed capacity.
- **Read & submit verified reviews** protected by database-level composite unique keys (`[placeId, userId]`) and check constraints.

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
│   │   ├── app/                  # Next.js App Router (layout, page, globals.css)
│   │   ├── components/           # Reusable UI & layout components (Navbar, Footer, ApiHealthStatus)
│   │   ├── lib/
│   │   │   └── api.ts            # Centralized API client (HTTP fetcher to Express API)
│   │   └── types/                # Pure TypeScript domain & response interfaces
│   ├── public/                   # Static assets & icons
│   ├── .env.example              # NEXT_PUBLIC_API_URL=http://localhost:5000/api
│   ├── package.json              # Frontend dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration for Next.js
│   ├── eslint.config.mjs         # ESLint configuration
│   └── next.config.ts            # Next.js configuration
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
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| **Backend** | Node.js, Express.js 4/5, TypeScript, REST API |
| **Database & ORM** | PostgreSQL 17 Alpine, Prisma ORM 7 (`@prisma/adapter-pg`, `pg.Pool`) |
| **Validation** | Zod |
| **Testing** | Vitest, Supertest |
| **Containerization** | Docker, Docker Compose |

---

## 4. REST API Specification

All backend endpoints are mounted under `/api` and return standardized JSON envelopes.

### Standard Response Envelope

**Success (2xx):**
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

**Error (4xx / 5xx):**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "errors": [ ... ]
  }
}
```

### Endpoints Overview

| Method | Endpoint | Description | Auth / Headers | Key Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check | None | `200` |
| `GET` | `/api/users` | List seeded users for switcher | None | `200` |
| `GET` | `/api/places` | List & filter places with Bayesian rating | Query: `category`, `search`, `sort` | `200`, `400` |
| `GET` | `/api/places/:id` | Get place details, reviews, tour availability | None | `200`, `400`, `404` |
| `POST` | `/api/places/:id/reviews` | Submit or update review (upsert) | `X-User-Id: <UUID>` | `201`, `200`, `400`, `404`, `409` |
| `GET` | `/api/tours/:id/bookings` | Get tour slot capacity & availability | None | `200`, `400`, `404` |
| `POST` | `/api/tours/:id/bookings` | Concurrency-safe tour seat reservation | `X-User-Id: <UUID>` | `201`, `400`, `404`, `409` |

---

### Endpoint Details & Curl Examples

#### 1. `GET /api/places`
Retrieve a list of places with optional filtering, search, and Bayesian ranking:
- `category`: Filter by `HISTORY`, `FOOD`, `NATURE`, `CULTURE`, or `ENTERTAINMENT`.
- `search`: Case-insensitive substring search matching place name.
- `sort`: `top-rated` orders places by Bayesian weighted score descending.

```bash
# Get top-rated places
curl -X GET "http://localhost:5000/api/places?sort=top-rated"

# Filter by category and search
curl -X GET "http://localhost:5000/api/places?category=HISTORY&search=National"
```

#### 2. `GET /api/places/:id`
Retrieve full place details including:
- Dynamic rating stats (`averageRating`, `reviewCount`, `weightedRating`).
- Chronological list of user reviews with author names.
- Future tour slots with calculated `availableSeats = capacity - totalBookedSeats`.

```bash
curl -X GET "http://localhost:5000/api/places/a0000001-0000-4000-8000-000000000001"
```

#### 3. `POST /api/places/:id/reviews`
Submit a review acting as a user:
- Header: `X-User-Id: <UUID>`
- Body: `{ "rating": 5, "body": "Incredible imperial exhibits!" }`
- First submission returns `201 Created` (`isNew: true`).
- Repeat submission by same user updates the review and returns `200 OK` (`isNew: false`).

```bash
curl -X POST "http://localhost:5000/api/places/a0000001-0000-4000-8000-000000000001/reviews" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 11111111-1111-4111-8111-111111111111" \
  -d '{"rating": 5, "body": "Incredible collection of historical crowns and artifacts!"}'
```

#### 4. `GET /api/tours/:id/bookings`
Check real-time tour slot capacity and available seats.

```bash
curl -X GET "http://localhost:5000/api/tours/b0000001-0000-4000-8000-000000000001/bookings"
```

#### 5. `POST /api/tours/:id/bookings`
Book tour seats with PostgreSQL pessimistic row-level locking:
- Header: `X-User-Id: <UUID>`
- Body: `{ "seats": 2 }`
- Returns `201 Created` on success.
- Returns `409 Conflict` if the tour is full or requested seats exceed availability.
- Returns `409 Conflict` if the user has already booked this tour slot.

```bash
curl -X POST "http://localhost:5000/api/tours/b0000001-0000-4000-8000-000000000001/bookings" \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 22222222-2222-4222-8222-222222222222" \
  -d '{"seats": 2}'
```

#### 6. `GET /api/users`
List seeded users for the client-side acting user switcher:

```bash
curl -X GET "http://localhost:5000/api/users"
```

---

## 5. Local Setup Instructions

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
# 1. Start PostgreSQL 17 in background
docker compose up -d

# 2. Install backend dependencies
cd backend
npm install

# 3. Generate Prisma client & apply migrations
npm run db:generate
npm run db:migrate

# 4. Seed database idempotently
npm run db:seed

# 5. Start backend development server
npm run dev
# Running on http://localhost:5000
```

### Step 3: Run Automated Tests

Execute all 40 automated backend tests (concurrency, Bayesian ranking, reviews, bookings, places, users, constraints, and health):

```bash
# From repository root
npm run test:backend

# Or from backend/
cd backend
npm test
```

---

## 6. Available Scripts

### Root Monorepo Scripts
```bash
npm run dev:frontend       # Run Next.js frontend (port 3000)
npm run dev:backend        # Run Express.js backend (port 5000)
npm run build:frontend     # Build Next.js frontend
npm run build:backend      # Build Express backend
npm run typecheck:frontend # Run TypeScript checks on frontend
npm run typecheck:backend  # Run TypeScript checks on backend
npm run test:backend       # Run all Vitest backend test suites
npm run lint:frontend      # Run ESLint on frontend
```
