# Architectural Decisions Record (ADR) — Wayfarer

This document records the architectural and design decisions made during the development of **Wayfarer — Honest Ratings, Fair Bookings**.

---

## ADR 01: Layered Modular Monolithic Architecture

### Context
Wayfarer requires a maintainable, clean architecture capable of scaling across multiple phases (place discovery, review integrity, tour bookings, and concurrency control) without introducing premature microservice complexity.

### Decision
Adopt a modular monolithic architecture separated into clear layers:
- **Presentation Layer**: Next.js App Router pages and reusable React components (`src/app/`, `src/components/`).
- **API Layer**: Next.js Route Handlers (`src/app/api/`) acting as thin controllers.
- **Business Logic Layer**: Domain service modules (`src/services/`) encapsulating calculation, business rules, and transactions.
- **Data Access Layer**: Prisma Client singleton with connection pooling (`src/lib/prisma.ts`).
- **Validation Layer**: Zod schemas (`src/lib/validations/`) ensuring end-to-end type safety and request validation.

### Consequences
- Strong boundaries and testability: Services can be tested independently of Next.js routing.
- Predictable evolution: Phase 2 and Phase 3 features build onto pre-established architectural interfaces without refactoring the foundational layout.

---

## ADR 02: Prisma 7 with PostgreSQL Driver Adapter

### Context
Prisma ORM 7 introduces architectural improvements over Prisma 6, including driver adapters (`@prisma/adapter-pg` using the `pg` connection pool) and centralized configuration via `prisma.config.ts`. In Prisma 7, datasource URLs are moved from `schema.prisma` to `prisma.config.ts` for migration tooling and passed via driver adapter to `PrismaClient`.

### Decision
- Standardize on Prisma 7 (`7.10.1`) with `@prisma/adapter-pg` and `pg.Pool`.
- Configure `prisma.config.ts` with `dotenv/config` to manage migrations, schema path, and database connections.
- Implement a global singleton in `src/lib/prisma.ts` to manage connection pooling during Next.js hot module replacement.

### Consequences
- Native Node.js `pg` pooling provides lower overhead and better control over database connections.
- Clean separation between schema modeling in `schema.prisma` and environment-specific database connection parameters.

---

## ADR 03: Database Constraints for Rating Integrity and Overbooking Prevention

### Context
Wayfarer specifically targets two core problems:
1. **Misleading place rankings** (review bombing or duplicate reviews distorting place scores).
2. **Tour overbooking** (multiple users concurrently claiming the same seat capacity).

### Decision
Enforce data integrity at the database schema level through relational constraints and composite unique keys:
- **One review per user per place**: `@@unique([userId, placeId])` in the `Review` model.
- **One booking per user per tour slot**: `@@unique([userId, tourSlotId])` in the `Booking` model.
- **UUID Primary Keys**: High-entropy UUID identifiers for all primary entities (`User`, `Place`, `Review`, `TourSlot`, `Booking`) to prevent enumeration attacks and simplify distributed operations.
- **Strict Integer Bounds**: Positive integers for tour capacity, booking seats, and review ratings (1–5) verified through database types and Zod schemas.

### Consequences
- Prevents invalid or duplicate review/booking states at the storage engine level, regardless of application concurrency spikes.

---

## ADR 04: Next.js 16 App Router and Partial Prerendering Compatibility

### Context
Next.js 16 includes breaking changes from prior versions, including asynchronous `params` and `searchParams` (`Promise<{ id: string }>`), Turbopack caching with Cache Components, and Partial Prerendering. Legacy segment configurations (such as `dynamic = 'force-dynamic'`) conflict with `cacheComponents`.

### Decision
- All Route Handlers and Page components use asynchronous `params: Promise<{ id: string }>`.
- Dynamic routes with client-facing runtime parameter access specify `export const instant = false;` or use `<Suspense>` boundaries per Next.js 16 specifications.

### Consequences
- Eliminates build warnings and prerender errors while enabling Turbopack build optimization and full Next.js 16 compatibility.

---

## ADR 05: Configurable Host Port Binding in Docker Compose

### Context
Developer host machines frequently have existing local PostgreSQL services running on the default port `5432`. Binding `5432:5432` unconditionally can lead to host port collision.

### Decision
Configure `docker-compose.yml` with dynamic port expansion: `"${POSTGRES_PORT:-5432}:5432"`. Provide `5432` as the default in `.env.example`, while allowing environment override (`POSTGRES_PORT=5433`) in `.env` if port `5432` is occupied on the developer machine.

### Consequences
- Works out-of-the-box on clean environments while providing transparent conflict resolution without changing container-internal port configurations.


---

## ADR 06: Database-Level CHECK Constraints for Data Integrity

### Context
Phase 2 mandates strict data integrity:
- Review ratings must strictly be between 1 and 5.
- Tour slot capacity must strictly be greater than zero.
- Booking seats must strictly be greater than zero.
- Review body must not be empty.

Application-level or Zod-only validation can be bypassed by direct database queries, script executions, or concurrent transactions.

### Decision
Augment Prisma schema constraints with native PostgreSQL `CHECK` constraints applied via migration SQL:
- `ALTER TABLE "reviews" ADD CONSTRAINT "check_review_rating_range" CHECK ("rating" >= 1 AND "rating" <= 5);`
- `ALTER TABLE "reviews" ADD CONSTRAINT "check_review_body_not_empty" CHECK (char_length(trim("body")) > 0 AND char_length("body") <= 500);`
- `ALTER TABLE "tour_slots" ADD CONSTRAINT "check_tour_slot_capacity_positive" CHECK ("capacity" > 0);`
- `ALTER TABLE "bookings" ADD CONSTRAINT "check_booking_seats_positive" CHECK ("seats" > 0);`

### Consequences
- True multi-layered defense: The database engine refuses any malformed row regardless of whether the insertion came from an API handler, seed script, or background job.

---

## ADR 07: Deterministic Idempotent Seeding Architecture

### Context
Development environments frequently re-run `prisma db seed`. Non-idempotent scripts cause primary key or composite unique key conflicts on subsequent executions or produce unwanted duplicate entities.

### Decision
- Assign stable, deterministic UUIDs to all seeded users, places, tour slots, reviews, and bookings.
- Use Prisma `upsert` across all entities:
  - `User`: keyed on `id`.
  - `Place`: keyed on `id`.
  - `TourSlot`: keyed on `id`.
  - `Review`: keyed on composite unique constraint `placeId_userId`.
  - `Booking`: keyed on composite unique constraint `slotId_userId`.

### Consequences
- The seed script is 100% idempotent and can run indefinitely against fresh or populated databases without errors or state degradation.
