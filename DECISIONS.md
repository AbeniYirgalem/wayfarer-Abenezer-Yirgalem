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
