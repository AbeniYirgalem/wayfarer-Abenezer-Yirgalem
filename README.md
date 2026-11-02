# Wayfarer — Honest Ratings, Fair Bookings

> A full-stack travel discovery and guided-tour booking application engineered to solve two fundamental problems in modern travel platforms: **misleading place rankings** and **tour overbooking**.

---

## 1. Project Overview & Value Proposition

Wayfarer offers travelers an authentic, reliable platform to:
- **Discover places** across diverse categories (History, Food, Nature, Culture, Entertainment) in an urban landscape.
- **Read & submit honest reviews** protected against review manipulation, duplicate reviews, and fraudulent rating spikes.
- **Find and book guided tour slots** with strictly enforced real-time capacity and concurrency control to completely eliminate overbooking.

---

## 2. Architecture & Monorepo Structure

Wayfarer is engineered as a **strictly decoupled monorepo** consisting of two independent applications:
1. **Frontend (`frontend/`)**: Next.js (App Router), React 19, TypeScript, and Tailwind CSS. Acts strictly as the client presentation layer with no direct database access.
2. **Backend (`backend/`)**: Node.js, Express.js, TypeScript REST API. Contains all domain business logic, data access, database constraints, and validation.
3. **Database**: PostgreSQL 17 managed via Docker Compose (`docker-compose.yml`) and accessed exclusively by the Express backend using Prisma ORM 7.

```text
wayfarer/
│
├── frontend/                     # Next.js App Router presentation layer
│   ├── src/
│   │   ├── app/                  # Next.js App Router (layout, page, globals.css)
│   │   ├── components/           # Reusable UI & layout components (Navbar, Footer, etc.)
│   │   ├── lib/
│   │   │   └── api.ts            # Centralized API client (HTTP fetcher to Express API)
│   │   └── types/                # Pure TypeScript domain & response interfaces
│   ├── public/                   # Static assets & icons
│   ├── .env.example              # Environment configuration template
│   ├── package.json              # Frontend dependencies and scripts
│   └── tsconfig.json             # TypeScript configuration for Next.js
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
│   │   ├── migrations/           # Version-controlled database migrations
│   │   └── seed.ts               # Database seed scripts
│   ├── tests/                    # Vitest unit and integration test suite
│   ├── .env.example              # Backend environment configuration template
│   ├── package.json              # Backend dependencies and scripts
│   └── tsconfig.json             # TypeScript configuration for Node.js
│
├── docker-compose.yml            # PostgreSQL 17 Alpine database container configuration
├── .gitignore                    # Monorepo-wide Git ignore rules
├── README.md                     # Comprehensive project documentation
├── DECISIONS.md                  # Architectural Decision Records (ADRs)
└── AI_USAGE.md                   # Transparent log of AI tooling & human modifications
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

### Step 2: Start PostgreSQL with Docker Compose

Run the database container from the root directory:

```bash
docker compose up -d
```

Verify that the container is healthy:
```bash
docker compose ps
```

The database container runs on `postgres:17-alpine`, with data volume `wayfarer_pgdata` and internal health checks.

---

### Step 3: Setup & Run Backend

In a dedicated terminal:

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client & apply migrations
npm run prisma:generate
npm run prisma:migrate

# Start development server (runs tsx on port 5000)
npm run dev
```

Verify the API health check endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Wayfarer API is running"
}
```

---

### Step 4: Setup & Run Frontend

In a separate terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the Wayfarer landing page and live backend health check indicator.

---

## 6. Available Scripts

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
- `npm run typecheck`: Runs `tsc --noEmit`.
- `npm test`: Runs Vitest test suite (`backend/tests/`).
- `npm run prisma:generate`: Generates Prisma Client.
- `npm run prisma:migrate`: Runs Prisma migration pipeline in development.
- `npm run prisma:deploy`: Deploys Prisma migrations in production.
- `npm run prisma:seed`: Seeds database.

### Frontend Scripts (`frontend/`)
- `npm run dev`: Starts Next.js development server on port 3000.
- `npm run build`: Builds Next.js for production.
- `npm start`: Runs Next.js production server.
- `npm run lint`: Runs ESLint checks.
- `npm run typecheck`: Runs `tsc --noEmit`.

---

## 7. API Health Check Verification

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
- **Error Format** (Centralized Error Middleware):
  ```json
  {
    "success": false,
    "error": {
      "message": "Error description",
      "details": {}
    }
  }
  ```
