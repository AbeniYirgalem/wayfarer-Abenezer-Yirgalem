# Architectural Decisions Record (ADR) — Wayfarer

This document records architectural, structural, and design decisions made for **Wayfarer — Honest Ratings, Fair Bookings**.

---

## ADR 01: Decoupled Monorepo Architecture (Next.js Frontend + Express.js Backend)

### Context
Wayfarer is a full-stack application designed to address two distinct challenges:
1. **Misleading place rankings** (requiring robust rating integrity and business algorithms).
2. **Tour overbooking** (requiring strict concurrency control and transactional database guarantees).

Initially considered alternatives:
- **Next.js Full-Stack Monolith**: Handling both frontend rendering and backend Route Handlers inside a single Next.js project.
- **Decoupled Monorepo**: Maintaining a standalone Next.js App Router frontend and an independent Express.js REST API backend in the same repository.

### Decision
Adopt a **strictly decoupled monorepo** with two completely separate applications:
- `frontend/`: Next.js (App Router), React 19, TypeScript, Tailwind CSS. Strictly presentation layer with zero database or Prisma access.
- `backend/`: Node.js, Express.js, TypeScript REST API. Sole custodian of business logic, database operations, Prisma ORM, and concurrency management.

### Rationale
1. **Clear Architectural Boundaries**: Prevents accidental leakage of database credentials, Prisma queries, or server-side domain logic into client-side code bundles.
2. **Independent Scaling & Deployability**: The backend API can scale independently under heavy booking or review traffic without coupling to frontend SSR/prerender workloads.
3. **Robust Concurrency Control**: An Express backend allows fine-tuned control over process lifecycles, database connection pools, transactional isolation levels, and background workers necessary for overbooking prevention.
4. **Clean API Contract**: Frontend communicates exclusively via HTTP requests against `/api`, ensuring reproducible testing, contract testing, and clear client-server decoupling.

---

## ADR 02: Express.js Layered Architecture

### Context
The backend requires maintainable organization to scale across multiple development phases (place discovery, honest reviews, tour slots, and concurrency-safe bookings).

### Decision
Organize `backend/src/` into distinct architectural layers:
- **`config/`**: Centralized, typed environment configuration using `dotenv`.
- **`controllers/`**: Thin controllers parsing incoming HTTP requests and returning standardized responses.
- **`routes/`**: Express routers mapping REST endpoints to controllers.
- **`services/`**: Pure domain logic and database transactions (e.g., `PlaceService`, `BookingService`, `ReviewService`, `RankingService`).
- **`middleware/`**: Centralized error-handling and 404 middlewares.
- **`lib/`**: Reusable infrastructure instances (Prisma client singleton with connection pooling).
- **`utils/`**: Standard error classes (`ApiError`) and response formatters (`ApiResponse`).

### Consequences
- High cohesion and low coupling.
- Every layer can be unit or integration tested independently (e.g., testing `RankingService` logic without spinning up an Express server).

---

## ADR 03: Centralized Error Handling & Response Envelope

### Context
Inconsistent API error structures make frontend error handling fragile and complicate debugging across distributed services.

### Decision
1. Implement a custom `ApiError` class extending `Error` with HTTP status codes and optional machine-readable error details.
2. Implement a centralized Express error middleware (`errorHandler.ts`) intercepting all errors:
   - Formats uniform JSON responses:
     ```json
     {
       "success": false,
       "error": {
         "message": "Error description",
         "details": {}
       }
     }
     ```
   - Automatically handles Zod validation errors (HTTP 400).
   - Automatically handles Prisma database constraint errors (e.g., P2002 unique constraint violation as HTTP 409).
   - Sanitizes internal server errors in production while retaining debug traces in development.

---

## ADR 04: Centralized Frontend API Client (`src/lib/api.ts`)

### Context
Direct, scattered `fetch` calls across React components lead to duplicated headers, inconsistent error handling, and hardcoded URLs.

### Decision
Implement a centralized HTTP client in `frontend/src/lib/api.ts` configured via `process.env.NEXT_PUBLIC_API_URL`:
- Provides strongly typed request wrappers (`get`, `post`, `put`, `patch`, `delete`).
- Enforces JSON headers and parses responses automatically.
- Translates non-2xx HTTP responses into typed `ApiClientError` instances with error messages extracted from the backend response envelope.
- Provides utility functions like `checkHealth()` to verify API connectivity.

---

## ADR 05: Prisma ORM 7 with PostgreSQL Driver Adapter

### Context
Prisma ORM 7 optimizes database interaction through driver adapters (`@prisma/adapter-pg` using Node.js `pg.Pool`), allowing native connection pooling and decoupling datasource credentials into `prisma.config.ts`.

### Decision
- Confine Prisma ORM exclusively to `backend/`.
- Use `@prisma/adapter-pg` and `pg.Pool` inside `backend/src/lib/prisma.ts`.
- Manage database migrations via `backend/prisma/migrations`.
- Run PostgreSQL 17 Alpine via Docker Compose with health checks and persistent volume storage.

---

## ADR 06: Database-Level Constraints for Rating Integrity & Overbooking Prevention

### Context
Frontend validation alone cannot prevent concurrent race conditions, malicious API payloads, or corrupted states (e.g., ratings outside 1–5, negative capacities, negative seats, empty review texts).

### Decision
Enforce data integrity at the database engine level in PostgreSQL:
1. **Composite Unique Constraints**:
   - `@@unique([placeId, userId])` on `reviews`: Enforces that a user can submit only one review per place.
   - `@@unique([slotId, userId])` on `bookings`: Enforces that a user cannot submit duplicate bookings for the same tour slot.
2. **Native SQL CHECK Constraints** (applied via Prisma migration `20261102165500_phase2_schema_and_constraints`):
   - `check_review_rating_range`: `CHECK ("rating" >= 1 AND "rating" <= 5)`
   - `check_review_body_not_empty`: `CHECK (char_length(trim("body")) > 0 AND char_length("body") <= 500)`
   - `check_tour_slot_capacity_positive`: `CHECK ("capacity" > 0)`
   - `check_booking_seats_positive`: `CHECK ("seats" > 0)`

---

## ADR 07: Dynamic Calculation of Available Seats vs. Stored Counter

### Context
Storing a mutable counter column like `seatsLeft` on `tour_slots` creates a distributed state synchronization problem and risk of race conditions during concurrent bookings.

### Decision
Do not store `seatsLeft` in the database. Instead:
- Store the immutable slot `capacity`.
- Calculate available seats dynamically as `capacity - SUM(seats)` from confirmed bookings.
- In Phase 3, atomic transactions or pessimistic locking will guard the check-and-decrement step.

---

## ADR 08: Deterministic and Idempotent Database Seeding

### Context
Re-running database seeding scripts during development or CI must not corrupt foreign key relations, create duplicate places, or exceed tour slot capacities.

### Decision
1. Assign deterministic UUIDv4 identifiers across all seeded records (users, places, tour slots, reviews, bookings).
2. Utilize Prisma `upsert` queries targeting primary keys and composite unique constraints (`[placeId, userId]`, `[slotId, userId]`).
3. Ensure seed dataset matches realistic Addis Ababa, Ethiopia cultural, historical, nature, food, and entertainment locations.


---

## ADR 09: Bayesian Weighted Rating Algorithm for Honest Rankings

### Context
Simple arithmetic average ratings create severe ranking anomalies:
- A new place with a single 5-star review ($100\%$ score) outranks an established cultural landmark with 50 reviews averaging 4.8.
- Low-volume places are easily manipulated by fraudulent 5-star or 1-star reviews.

### Decision
Implement the **Bayesian Weighted Rating formula** in `RankingService`:
$$WR = \frac{v}{v + m} R + \frac{m}{v + m} C$$

Where:
- $WR$: Weighted Rating
- $R$: Arithmetic mean rating of the place
- $v$: Number of reviews for the place
- $m$: Minimum review count threshold (default: $m = 5$)
- $C$: Global average rating across all reviewed places in the database (or default prior $3.5$ if empty)

### Consequences
1. Places with very few reviews are anchored towards the global mean $C$, preventing 1-review anomalies from claiming the top spot.
2. As review count $v$ increases, the weight $\frac{v}{v+m}$ approaches $1$, allowing verified community consensus to govern the score.
3. Places with many positive reviews (e.g., 50 reviews of 4.8, $WR \approx 4.68$) decisively outrank places with a single 5-star review (1 review of 5.0, $WR \approx 3.75$).

---

## ADR 10: PostgreSQL Pessimistic Row-Level Locking (`SELECT ... FOR UPDATE`) for Overbooking Prevention

### Context
When multiple travelers simultaneously book seats for a tour slot with limited remaining capacity, optimistic concurrency control or in-memory availability checks lead to race conditions:
- User A and User B simultaneously read 2 remaining seats.
- User A reserves 2 seats; User B reserves 2 seats.
- Without serializable locking, total seats booked becomes 12 out of 10 (overbooked by 2).

### Decision
Implement pessimistic row-level locking directly at the database engine level in `BookingService.createBooking`:
1. Execute within an atomic Prisma transaction (`prisma.$transaction`).
2. Lock the specific `tour_slots` row exclusively using `SELECT id, "placeId", "startsAt", capacity FROM tour_slots WHERE id = $1 FOR UPDATE`.
3. Within the locked critical section:
   - Check if the tour slot date is in the past (reject if past).
   - Enforce single booking per user per slot (`[slotId, userId]`).
   - Dynamically aggregate confirmed seats: `SELECT SUM(seats) FROM bookings WHERE "slotId" = $1`.
   - Compute available seats: `capacity - totalBookedSeats`.
   - Reject with `409 Conflict` if `requestedSeats > availableSeats`.
   - Insert new booking record.
4. Release the row lock on transaction commit.

### Verification
Verified through an automated stress test in `backend/tests/booking-concurrency.test.ts`:
- 20 simultaneous parallel requests competed for 2 remaining seats.
- Exactly 2 requests succeeded with `201 Created`.
- Exactly 18 requests were rejected with `409 Conflict`.
- Final database state: exactly 10 booked seats out of 10 capacity, 0 seats overbooked.

---

## ADR 11: Idempotent Review Upsert via Composite Unique Key `[placeId, userId]`

### Context
A traveler should be able to refine or update their review after a follow-up visit. However, duplicate review submissions from the same user must never distort place review counts or arithmetic ratings.

### Decision
Utilize Prisma `upsert` targeting the composite unique constraint `@@unique([placeId, userId])`:
- If no review exists for the `(placeId, userId)` pair: create a new review record and return HTTP `201 Created` (`isNew: true`).
- If a review already exists: update `rating` and `body` in place, preserve original ID and creation timestamp, and return HTTP `200 OK` (`isNew: false`).
- Review count remains unchanged upon updates; place statistics are dynamically recomputed.

---

## ADR 12: Declarative Zod Validation Pipeline Across All Request Contexts

### Context
Validating HTTP inputs manually inside route handlers leads to repetitive parsing, unhandled edge cases, and scattered error responses.

### Decision
Implement a reusable middleware `validate` in `backend/src/middleware/validate.middleware.ts`:
- Accepts independent Zod schemas for `params`, `query`, `body`, and `headers`.
- Replaces incoming `req` properties with parsed and sanitized values (e.g., trimming whitespace, transforming strings to integers/enums).
- Automatically converts Zod validation failures into uniform HTTP `400 Bad Request` responses before controllers are executed.
