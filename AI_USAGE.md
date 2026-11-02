# AI Usage Record — Wayfarer

This document details the AI tooling, prompts, code generation workflows, and human architectural reviews conducted during the development of **Wayfarer — Honest Ratings, Fair Bookings**.

---

## 1. AI Tooling Employed

- **Assistant**: Antigravity (Google DeepMind Advanced Agentic Coding) powered by Gemini.
- **Workflow Scope**: Architectural design, monorepo restructuring, Express.js REST API scaffolding, Next.js client initialization, Prisma 7 database decoupling, Docker Compose configuration, and end-to-end verification.

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

## 3. Human & Agent Overrides / Critical Fixes

1. **Port Conflict Management**:
   - Host machine features an active local Windows PostgreSQL 13 service listening on port 5432.
   - The Docker Compose configuration was designed with port variable expansion (`${POSTGRES_PORT:-5432}:5432`) to allow local port 5433 fallback without modifying container configurations.

2. **Decoupling Data Access**:
   - Removed all direct Prisma and PostgreSQL dependencies from the frontend application to guarantee zero database queries inside Next.js components.
   - Standardized frontend communication via typed HTTP calls through `src/lib/api.ts`.

3. **Prisma 7 Configuration Migration**:
   - Maintained Prisma 7 compatibility in `backend/prisma.config.ts` using `@prisma/config` and driver adapter `@prisma/adapter-pg`.

4. **Preservation of Domain Logic**:
   - Preserved previously defined business service skeletons (`PlaceService`, `BookingService`, `ReviewService`, `RankingService`) in `backend/src/services/` for subsequent phases without prematurely exposing unfinished REST endpoints.

---

## 4. Verification Record

- **Docker PostgreSQL**: Running on PostgreSQL 17 container `wayfarer-postgres`.
- **Backend Health Check**: Verified `GET http://localhost:5000/api/health` returns HTTP 200 with `{"success": true, "message": "Wayfarer API is running"}`.
- **Frontend Page**: Verified Next.js landing page renders with live backend connectivity testing component.
- **TypeScript & Linting**: Clean compilation across both `frontend/` and `backend/`.
