# AI Usage Record — Wayfarer

This document outlines the tools, workflows, validation processes, and manual engineering decisions made in collaboration with AI coding assistants for **Wayfarer — Honest Ratings, Fair Bookings** (Phase 1).

---

## 1. AI Tooling Employed
- **Assistant**: Antigravity (Google DeepMind Advanced Agentic Coding) powered by Gemini.
- **Scope of Assistance**: Initial project scaffolding, dependency alignment, Prisma 7 configuration, Next.js 16 App Router routing patterns, and automated verification suites.

---

## 2. Key Prompts and Workflow Stages
1. **Requirements Analysis**: Parsed take-home engineering requirements from Rago Software Solutions, identifying specific architectural constraints (modular monolith, Prisma 7 pg adapter, UUID keys, composite unique constraints, acting-as user switcher pattern).
2. **Scaffolding and Setup**: Created the project structure with Next.js App Router, TypeScript strict mode, and Tailwind CSS.
3. **Database Architecture**: Designed the 5 core Prisma models (`User`, `Place`, `Review`, `TourSlot`, `Booking`) with strict foreign keys, indexes, and unique constraints.
4. **Prisma 7 Driver Adapter Integration**: Configured `@prisma/adapter-pg` with `pg.Pool` in `src/lib/prisma.ts` and dynamic database connection resolution in `prisma.config.ts`.
5. **Quality Verification**: Executed Vitest test runner, TypeScript compiler (`tsc --noEmit`), ESLint, and Next.js production builds.

---

## 3. Human & Agent Overrides / Critical Fixes
- **npm Naming Restrictions**: Project directory capitalized as `Wayfarer`. Correctly resolved by initializing package name `wayfarer` in lowercase.
- **Port Conflict Management**: Detected existing local PostgreSQL 13 service on host port 5432. Implemented dynamic port expansion (`${POSTGRES_PORT:-5432}:5432`) in `docker-compose.yml` and `.env` override to ensure conflict-free database connectivity.
- **Prisma 7 Schema Breaking Changes**: Handled the Prisma 7 deprecation where `url` is no longer supported in `schema.prisma` datasource blocks. Moved datasource configuration to `prisma.config.ts` with `dotenv/config` and connected via `@prisma/adapter-pg` in the client.
- **Next.js 16 Partial Prerendering Compatibility**: Turbopack with `cacheComponents: true` flagged static prerendering of dynamic routes lacking parameters. Resolved by adopting Next.js 16's `export const instant = false;` pattern for dynamic place detail routes pending Phase 2 data fetching.
- **Node & Vitest Peer Dependency Alignment**: Resolved Vitest 5 peer dependency requirements by updating `@types/node` to version 24 matching the local Node v24 runtime.

---

## 4. Verification and Integrity
All generated code was directly compiled, migrated, and verified against a live PostgreSQL 17 database instance:
- `npx prisma migrate dev --name init`: Success
- `npx prisma generate`: Success
- `npx tsc --noEmit`: 0 errors
- `npm run lint`: 0 errors
- `npm test`: 3 passing tests across 2 test files
- `npm run build`: Production build verified with Turbopack
