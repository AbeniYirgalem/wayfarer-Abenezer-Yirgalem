# AI Usage Record — Wayfarer

This document details the AI tooling, prompts, code generation workflows, and human architectural reviews conducted during the development of **Wayfarer — Honest Ratings, Fair Bookings**.

---

## 1. AI Tooling Employed

- **Assistant**: Antigravity (Google DeepMind Advanced Agentic Coding) powered by Gemini.
- **Workflow Scope**: Architectural design, monorepo restructuring, Express.js REST API scaffolding, Next.js client initialization, Prisma 7 database decoupling, Docker Compose configuration, schema modeling, migration authoring, idempotent seed generation, and end-to-end verification.

---

## 2. Prompts & Workflow Stages (Phase 1: Project Architecture)

### Stage 1: Requirements Ingestion & Monorepo Planning
- **Prompt**: "Codex Prompt — Phase 1: Project Architecture (Next.js + Express.js)"
- **Action**: Parsed full-stack specifications requiring strict separation into `frontend/` (Next.js App Router, Tailwind CSS) and `backend/` (Express.js, TypeScript, REST API, Prisma 7, PostgreSQL).

### Stage 2: Monorepo Restructuring & File Scaffolding
- **Generated**:
  - `frontend/`: App Router structure (`layout.tsx`, `page.tsx`, `globals.css`), centralized HTTP client (`api.ts`), type definitions, `package.json`, and Tailwind CSS v4 setup.
  - `backend/`: Express application setup (`app.ts`, `server.ts`), layered structure (`config/`, `controllers/`, `routes/`, `services/`, `middleware/`, `lib/`, `utils/`, `types/`), Prisma schema and migrations relocation.
  - Root: Updated `docker-compose.yml`, `.gitignore`, `README.md`, `DECISIONS.md`, and `AI_USAGE.md`.

### Stage 3: API & Error Handling Architecture
- **Generated**:
  - `GET /api/health` endpoint returning `{"success": true, "message": "Wayfarer API is running"}`.
  - Centralized error handler in `backend/src/middleware/errorHandler.ts` supporting `ApiError`, Zod validation errors, and Prisma relational constraints.
  - Centralized frontend client in `frontend/src/lib/api.ts` with error normalization.

---

## 3. Prompts & Workflow Stages (Phase 2: PostgreSQL, Prisma Schema, Migrations & Seed Data)

### Stage 1: Requirements Analysis & Schema Specification
- **Prompt**: "Codex Prompt — Phase 2: PostgreSQL, Prisma Schema, Migrations & Seed Data"
- **Action**: Parsed database models (`User`, `Place`, `Review`, `TourSlot`, `Booking`) with strict composite unique keys (`[placeId, userId]`, `[slotId, userId]`), category enums (`PlaceCategory`), and native PostgreSQL `CHECK` constraints.

### Stage 2: Database Migration Authoring
- **Generated / Migrated**:
  - `20261102075204_init/migration.sql`: Core relational tables and foreign keys.
  - `20261102165500_phase2_schema_and_constraints/migration.sql`: Category enums, composite unique keys, and SQL `CHECK` constraints:
    - `check_review_rating_range`: `rating >= 1 AND rating <= 5`
    - `check_review_body_not_empty`: `char_length(trim(body)) > 0 AND char_length(body) <= 500`
    - `check_tour_slot_capacity_positive`: `capacity > 0`
    - `check_booking_seats_positive`: `seats > 0`

### Stage 3: Idempotent Seed Implementation
- **Generated**:
  - Deterministic seed dataset for Addis Ababa, Ethiopia across 3 users (`Abenezer`, `Hana`, `Dawit`), 10 places across all 5 categories, 20 reviews, 6 future tour slots, and 4 bookings.
  - Upsert logic targeting primary keys and composite keys so repeat executions (`npm run db:seed`) produce zero duplicates.

### Stage 4: Automated Constraints Test Suite
- **Generated**:
  - `backend/tests/constraints.test.ts` exercising database rejection of invalid ratings (0, 6), empty review bodies, negative/zero capacities, zero booking seats, and duplicate submissions.

---

## 4. Human & Agent Overrides / Critical Fixes

1. **Port Conflict Management**:
   - Host machine features an active local Windows PostgreSQL 13 service listening on port 5432.
   - The Docker Compose configuration was designed with port variable expansion (`${POSTGRES_PORT:-5432}:5432`) to allow local port 5433 fallback without modifying container configurations.

2. **WSL2 Daemon Persistence**:
   - WSL2 shut down idle background containers after non-interactive CLI calls. Maintained a persistent background daemon (`wsl sleep infinity`) to guarantee uninterrupted database access.

3. **Prisma 7 Driver Adapter Configuration**:
   - Configured `backend/prisma.config.ts` using `@prisma/config` with dynamic datasource resolution, and connected Prisma Client in `backend/src/lib/prisma.ts` via `@prisma/adapter-pg` and `pg.Pool`.

4. **Dynamic Capacity Calculation**:
   - Explicitly excluded mutable `seatsLeft` column from `TourSlot` model, calculating available seats as `capacity - bookedSeats` to avoid race conditions.

---

## 5. Verification Record

- **Docker PostgreSQL 17**: Running `wayfarer-postgres` container.
- **Database Migrations**: Verified 2 applied migrations via `npx prisma migrate status`.
- **Database Seeding**: Verified `npm run db:seed` executes idempotently (3 users, 10 places, 20 reviews, 6 tour slots, 4 bookings). Repeat run generated 0 duplicate records.
- **Vitest Test Suite**: 11 passing tests across 4 test files (`constraints.test.ts`, `health.test.ts`, `ranking.test.ts`, `booking-concurrency.test.ts`).
- **TypeScript Compilation**: `npm run typecheck` passed with 0 errors in both `backend/` and `frontend/`.
- **ESLint & Next.js Build**: `npm run lint` and `npm run build` succeeded with 0 errors.


---

## 5. Prompts & Workflow Stages (Phase 3: Express.js REST API Development & Business Logic)

### Stage 1: Requirements Analysis & Architecture Verification
- **Prompt**: "Codex Prompt — Phase 3: Express.js REST API Development & Business Logic"
- **Action**: Parsed core requirements strictly scoped to `backend/`:
  - `GET /api/health`: Health status.
  - `GET /api/places`: Category, search, and Bayesian ranking filters.
  - `GET /api/places/:id`: Place metadata, attributed reviews, dynamically calculated tour availability.
  - `POST /api/places/:id/reviews`: Upsert logic with `X-User-Id` header and Zod validation.
  - `GET /api/users`: Seeded user list for user switcher.
  - `GET /api/tours/:id/bookings`: Tour slot availability calculation.
  - `POST /api/tours/:id/bookings`: Concurrency-safe seat reservation using PostgreSQL row-level locks (`SELECT ... FOR UPDATE`).

### Stage 2: Service & Controller Implementation
- **Generated**:
  - `RankingService`: Bayesian weighted rating algorithm ($WR = \frac{v}{v+m} R + \frac{m}{v+m} C$, $m=5$).
  - `PlaceService`: Category filtering, search query handling, top-rated Bayesian sorting, and slot availability aggregation.
  - `ReviewService`: Prisma upsert on `[placeId, userId]`, existence checks, and dynamic place stats recalculation.
  - `BookingService`: Pessimistic locking inside `$transaction` via parameterized `SELECT ... FOR UPDATE`, past slot rejection, duplicate check, and capacity check.
  - `UserService`: User listing for client switcher.
  - Controllers and routes in `backend/src/controllers/` and `backend/src/routes/`.
  - Zod schemas in `backend/src/validations/`.

### Stage 3: Automated Test Suites
- **Generated**:
  - `backend/tests/ranking.test.ts`: Verified Bayesian formula, 5-star outlier dampening, low rating penalty, and tie-breaking.
  - `backend/tests/review.test.ts`: Verified first submission (201), update on re-submission (200), review count preservation, rating range validation (1–5), empty body rejection, >500 char rejection, and non-existent user/place rejection.
  - `backend/tests/booking.test.ts`: Verified initial availability, seat reservation decrement, capacity exhaustion (409), past slot rejection (400), invalid seats (400), and duplicate booking rejection (409).
  - `backend/tests/booking-concurrency.test.ts`: Verified true PostgreSQL concurrency using 20 simultaneous requests competing for 2 remaining seats (exactly 2 succeed with 201, 18 reject with 409, final booked = 10, remaining = 0).
  - `backend/tests/place.test.ts`: Category filters, substring search, top-rated sorting, details, 404, and UUID validation.
  - `backend/tests/user.test.ts`: Seeded users list retrieval.

---

## 6. Phase 3 Verification Record

- **Automated Vitest Tests**: 40 passing tests across 8 test suites (`tests/ranking.test.ts`, `tests/review.test.ts`, `tests/booking.test.ts`, `tests/booking-concurrency.test.ts`, `tests/place.test.ts`, `tests/user.test.ts`, `tests/constraints.test.ts`, `tests/health.test.ts`).
- **TypeScript Typecheck**:
  - `npm run typecheck:backend` passed with 0 errors.
  - `npm run typecheck:frontend` passed with 0 errors.
- **ESLint**:
  - `npm run lint:frontend` passed with 0 warnings / errors.
- **Frontend Isolation**: Zero modifications made to `frontend/`. All changes strictly contained in `backend/` and root documentation.


---

## 7. Prompts & Workflow Stages (Phase 4: Modern Next.js Frontend Development & API Integration)

### Stage 1: Design Direction & Architectural Planning
- **Prompt**: "Codex Prompt — Phase 4: Modern Next.js Frontend Development & API Integration"
- **Action**: Formulated editorial travel magazine aesthetic adhering to brand palette:
  - Deep forest green: `#163D32` (Primary)
  - Warm off-white: `#F8F7F3` (Backgrounds)
  - Soft beige: `#EDE9DF` (Card borders and subtle backgrounds)
  - Charcoal: `#252A27` (Text headings)
  - Muted gray: `#777D78` (Metadata and subtext)
- **Constraint Compliance**:
  - All changes strictly isolated in `frontend/`.
  - Zero backend code modifications.
  - No direct PostgreSQL access or duplicated Next.js API routes.
  - Zero external icon runtime dependencies (implemented clean Lucide-styled SVG library in `frontend/src/components/ui/Icons.tsx`).

### Stage 2: Component & Layout Implementation
- **Generated**:
  - `UserContext.tsx`: Manages acting traveler identity fetched from `GET /api/users` with `localStorage` persistence and automatic `X-User-Id` injection.
  - `Navbar.tsx` & `Footer.tsx`: Modern navigation with integrated `UserSwitcher` and mobile dropdown.
  - `HeroSection.tsx`: Editorial photography, headline, and integrated search input.
  - `CategoryFilter.tsx`: Category selector for all 5 categories with active states.
  - `FeaturedPlaces.tsx` & `PlaceGrid.tsx`: Integrated search, Bayesian top-rated sort toggle, and responsive cards.
  - `PlaceCard.tsx` & `PlaceRating.tsx`: Image container with fallback, star ratings, review counts, and honest score badges.
  - `PlaceDetailsHeader.tsx`: Editorial photography, address, opening hours, and description.
  - `ReviewList.tsx` & `ReviewForm.tsx`: Interactive review submission and update with 1-5 star selector, 500-char count, and upsert handling.
  - `TourSlotList.tsx`, `TourSlotCard.tsx` & `BookingModal.tsx`: Real-time tour seat availability, seat quantity picker, overbooking protection, and 409 Conflict handling.
  - `loading.tsx`, `error.tsx`, `not-found.tsx`: Global states for error resilience.

### Stage 3: Verification & Build
- **Typecheck**: `npm run typecheck:frontend` passed with 0 errors.
- **ESLint**: `npm run lint:frontend` passed with 0 errors / warnings (resolved React 19 `set-state-in-effect` and Next.js navigation rules).
- **Production Build**: `npm run build:frontend` compiled all static and dynamic pages with 0 errors.
- **End-to-End Live Verification**: Verified live HTTP interaction between Express backend (port 5000) and Next.js frontend (port 3000).

---

## 8. Prompts & Workflow Stages (Phase 5: End-to-End Testing, Integration & Quality Assurance)

### Stage 1: Quality Assurance & Codebase Inspection
- **Prompt**: "Codex Prompt — Phase 5: Wayfarer End-to-End Testing, Integration & Quality Assurance"
- **Action**: Performed complete audit across backend API routes, services, middleware, Prisma migrations, seed scripts, frontend components, hooks, API client, and documentation.

### Stage 2: Bugs Discovered & Resolved
1. **Search Query Scope Expansion**:
   - *Discovery*: `PlaceService.getPlaces` search query only filtered against `where.name`. If a user searched for keywords present in the place description (e.g., "volcanic", "monument"), results were omitted.
   - *Fix*: Updated `where.OR` in `backend/src/services/place.service.ts` to perform case-insensitive containment checks across both `name` and `description`.
2. **Production Server Startup Script**:
   - *Discovery*: `backend/package.json` specified `"start": "node dist/server.js"`, but `tsconfig.json` compiled output to `dist/src/server.js`. Running `npm start --prefix backend` failed with `MODULE_NOT_FOUND`.
   - *Fix*: Updated `backend/package.json` to `"main": "dist/src/server.js"` and `"start": "node dist/src/server.js"`.
3. **Prisma Transaction Timeout under High Concurrency**:
   - *Discovery*: Under 20-worker parallel stress testing in Vitest, default Prisma interactive transaction timeout (`maxWait: 2000`) caused tail transactions to abort before acquiring the row lock.
   - *Fix*: Added `{ maxWait: 10000, timeout: 10000 }` to `prisma.$transaction` in `backend/src/services/booking.service.ts`.
4. **PostCSS Anonymous Default Export Warning**:
   - *Discovery*: ESLint flagged an anonymous default export in `frontend/postcss.config.mjs`.
   - *Fix*: Assigned to named constant before exporting: `const postcssConfig = { ... }; export default postcssConfig;`.

### Stage 3: Verification & Sign-Off
- **Automated Tests**: 40 of 40 tests passing across 8 Vitest suites (`ranking.test.ts`, `review.test.ts`, `booking.test.ts`, `booking-concurrency.test.ts`, `place.test.ts`, `user.test.ts`, `constraints.test.ts`, `health.test.ts`).
- **PostgreSQL Concurrency Test**: Verified 20 simultaneous requests competing for 2 seats yields exactly 2 successes (`201`), 18 rejections (`409 Conflict`), and final booked seats equal to capacity (10/10).
- **TypeScript Typecheck**: Backend (`npm run typecheck:backend`) and Frontend (`npm run typecheck:frontend`) passed with 0 errors.
- **Frontend Linting**: `npm run lint:frontend` passed with 0 warnings / errors.
- **Production Builds**: Backend (`npm run build:backend`) and Next.js frontend (`npm run build:frontend`) compiled cleanly.
- **Prisma Schema & Seed**: Migrations verified (`npx prisma migrate status`), idempotent seed executed (`npm run db:seed`).
- **Live HTTP Endpoints**: Verified all 7 REST endpoints against running backend service.
