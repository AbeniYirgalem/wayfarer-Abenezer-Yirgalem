# Wayfarer — Honest Ratings, Fair Bookings

> A full-stack travel discovery and guided-tour booking application engineered to solve two fundamental problems in modern travel platforms: **misleading place rankings** and **tour overbooking**.

---

## 1. Project Overview & Value Proposition

Wayfarer offers travelers an authentic, reliable platform to:
- **Discover places** across diverse categories (History, Food, Nature, Culture, Entertainment) in Addis Ababa, Ethiopia.
- **Read & submit honest reviews** protected against review manipulation, duplicate reviews, and fraudulent rating spikes.
- **Find and book guided tour slots** with strictly enforced real-time capacity and database constraints to prevent overbooking.

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
│   │   ├── controllers/          # Express route controllers (e.g., health)
│   │   ├── routes/               # Express API routers mounted at /api
│   │   ├── services/             # Business logic layer (places, reviews, bookings, rankings)
│   │   ├── middleware/           # Centralized error handling and 404 middleware
│   │   ├── lib/                  # Prisma client singleton & connection pool
│   │   ├── utils/                # ApiError and standard response formatting helpers
│   │   ├── types/                # Backend domain and Prisma types
│   │   ├── app.ts                # Express application configuration & middleware pipeline
│   │   └── server.ts             # Server entry point (starts on port 5000)
│   ├── prisma/
│   │   ├── schema.prisma         # Prisma data models and relations
│   │   ├── prisma.config.ts      # Prisma 7 configuration file
│   │   ├── migrations/           # Version-controlled database migrations & CHECK constraints
│   │   └── seed.ts               # Idempotent database seed script (Addis Ababa dataset)
│   ├── tests/                    # Vitest test suite (health, constraints, services)
│   │   ├── health.test.ts        # API health check integration test
│   │   ├── constraints.test.ts   # Database constraints & integrity verification test
│   │   ├── booking-concurrency.test.ts
│   │   └── ranking.test.ts
│   ├── .env.example              # Backend environment configuration template
│   ├── package.json              # Backend dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration for Node.js
│   └── vitest.config.mts         # Vitest test runner configuration
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

## 4. Prerequisites

Ensure you have the following installed locally:
- **Node.js**: v20 or higher (v24 LTS recommended)
- **npm**: v10 or higher
- **Docker & Docker Compose**: For containerized PostgreSQL database

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

Backend `.env` default configuration:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://wayfarer:wayfarer_dev@localhost:5432/wayfarer?schema=public
FRONTEND_URL=http://localhost:3000
```

Frontend `.env.local` default configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### Step 2: Database Setup & Operations

All database management commands should be executed from within the `backend/` directory (or using root convenience scripts), with PostgreSQL running via Docker:

#### 1. Starting PostgreSQL
From the repository root:
```bash
docker compose up -d
```
Verify the container is healthy:
```bash
docker compose ps
```

#### 2. Installing Backend Dependencies
```bash
cd backend
npm install
```

#### 3. Generating Prisma Client
```bash
npm run db:generate
# (or: npx prisma generate)
```

#### 4. Applying Database Migrations
Applies all version-controlled SQL migrations, relational indexes, and native PostgreSQL `CHECK` constraints:
```bash
npm run db:migrate
# (or: npx prisma migrate dev)
```

#### 5. Running the Seed Script
Populates the database idempotently with Addis Ababa destinations, users, reviews, tour slots, and sample bookings:
```bash
npm run db:seed
# (or: npx prisma db seed)
```
*Note: Running `npm run db:seed` multiple times is safe and will not produce duplicate records.*

#### 6. Opening Prisma Studio
To inspect and manage records visually:
```bash
npm run db:studio
# (or: npx prisma studio)
```

#### 7. Running the Backend Server
```bash
npm run dev
# Server starts on http://localhost:5000
# Health check available at: http://localhost:5000/api/health
```

---

### Step 3: Frontend Setup & Verification

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
# Starts on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) to view the Wayfarer application and verify live communication with the backend.

---

## 6. Database Schema & Integrity

The database schema is defined in [backend/prisma/schema.prisma](file:///C:/Users/ABENI/Desktop/Wayfarer/backend/prisma/schema.prisma) across five core models:

1. **User (`users`)**:
   - `id`: UUID primary key
   - `name`: String
   - `createdAt`: DateTime
   - Relations: One user has many reviews and many bookings.

2. **Place (`places`)**:
   - `id`: UUID primary key
   - `name`: String
   - `category`: Enum (`HISTORY`, `FOOD`, `NATURE`, `CULTURE`, `ENTERTAINMENT`)
   - `description`: Text
   - `openingHours`: String
   - `imageUrl`: Optional String
   - `address`: String
   - `createdAt`: DateTime, `updatedAt`: DateTime
   - Relations: One place has many reviews and many tour slots.

3. **Review (`reviews`)**:
   - `id`: UUID primary key
   - `placeId`: Foreign key -> `Place.id` (Cascade delete)
   - `userId`: Foreign key -> `User.id` (Cascade delete)
   - `rating`: Integer (1 to 5)
   - `body`: VarChar(500)
   - `createdAt`: DateTime, `updatedAt`: DateTime
   - Constraints:
     - `@@unique([placeId, userId])` prevents duplicate user reviews for the same place.
     - PostgreSQL CHECK constraint: `rating >= 1 AND rating <= 5`.
     - PostgreSQL CHECK constraint: `char_length(trim(body)) > 0 AND char_length(body) <= 500`.

4. **TourSlot (`tour_slots`)**:
   - `id`: UUID primary key
   - `placeId`: Foreign key -> `Place.id` (Cascade delete)
   - `startsAt`: DateTime (future slot timestamp)
   - `capacity`: Integer (positive number of total seats)
   - `createdAt`: DateTime
   - Constraints:
     - PostgreSQL CHECK constraint: `capacity > 0`.
     - *No redundant `seatsLeft` field is stored; available seats are dynamically computed from `capacity - bookedSeats`.*

5. **Booking (`bookings`)**:
   - `id`: UUID primary key
   - `slotId`: Foreign key -> `TourSlot.id` (Cascade delete)
   - `userId`: Foreign key -> `User.id` (Cascade delete)
   - `seats`: Integer (positive seats booked)
   - `createdAt`: DateTime
   - Constraints:
     - `@@unique([slotId, userId])` prevents duplicate user bookings for the same tour slot.
     - PostgreSQL CHECK constraint: `seats > 0`.

---

## 7. Available Scripts

### Root Monorepo Scripts
```bash
npm run dev:frontend       # Run Next.js frontend
npm run dev:backend        # Run Express.js backend
npm run build:frontend     # Build Next.js frontend
npm run build:backend      # Build Express backend
npm run typecheck:frontend # Run TypeScript checks on frontend
npm run typecheck:backend  # Run TypeScript checks on backend
npm run test:backend       # Run Vitest test suite on backend
```

### Backend Scripts (`backend/`)
- `npm run dev`: Starts Express development server with hot-reloading via `tsx watch`.
- `npm run build`: Compiles TypeScript to `dist/`.
- `npm start`: Runs compiled server from `dist/server.js`.
- `npm run lint`: Runs type/linter checks.
- `npm run typecheck`: Runs `tsc --noEmit`.
- `npm test`: Runs Vitest test suite (`backend/tests/`).
- `npm run db:generate`: Generates Prisma Client.
- `npm run db:migrate`: Applies Prisma migrations.
- `npm run db:deploy`: Deploys migrations for production.
- `npm run db:seed`: Seeds database idempotently.
- `npm run db:studio`: Opens Prisma Studio GUI.

### Frontend Scripts (`frontend/`)
- `npm run dev`: Starts Next.js dev server on port 3000.
- `npm run build`: Builds Next.js for production.
- `npm start`: Runs Next.js production server.
- `npm run lint`: Runs ESLint checks.
- `npm run typecheck`: Runs `tsc --noEmit`.

---

## 8. API Health Check Verification

The Express backend provides a standardized health check endpoint:

- **Endpoint**: `GET http://localhost:5000/api/health`
- **Status**: `200 OK`
- **Response Format**:
  ```json
  {
    "success": true,
    "message": "Wayfarer API is running"
  }
  ```
