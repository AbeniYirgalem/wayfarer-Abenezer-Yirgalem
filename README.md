# Wayfarer — Honest Ratings, Fair Bookings

> A full-stack travel discovery and guided-tour booking application engineered to solve two fundamental problems in modern travel platforms: **misleading place rankings** and **tour overbooking**.

---

## 1. Project Overview & Value Proposition

Wayfarer offers travelers an authentic, reliable platform to:
- **Discover places** across diverse categories (History, Food, Nature, Culture, Entertainment) in Addis Ababa, Ethiopia.
- **Experience Honest Rankings**: Powered by a backend **Bayesian weighted rating algorithm** ($WR = \frac{v}{v+m} R + \frac{m}{v+m} C$) that prevents 1-review outliers from unfairly dominating places with dozens of verified positive reviews.
- **Fair, Overbooking-Proof Bookings**: Powered by **PostgreSQL pessimistic row-level locking** (`SELECT ... FOR UPDATE`) inside atomic database transactions, guaranteeing that concurrent seat reservations never exceed capacity.
- **Read & submit verified reviews** protected by database-level composite unique keys (`[placeId, userId]`) and check constraints.
- **Switch Traveler Profiles**: Seamless traveler profile switcher simulating verified traveler personas with persistent client session state.

---

## 2. Prerequisites

| Tool | Minimum Version | Required For |
| :--- | :--- | :--- |
| **Docker Desktop** (or Docker Engine) | Docker 24.x+ / Docker Compose v2.20+ | **Mandatory** — Runs full containerized stack (Postgres, Express API, Next.js) |
| **Git** | 2.30+ | **Mandatory** — Repository cloning and version control |
| *Node.js* (Optional) | `v20.x` or higher (`v24.x` recommended) | *Optional* — Only needed if developing directly on the host machine |
| *npm* (Optional) | `v10.x` or higher | *Optional* — Only needed if executing tests or linters directly on host |

> [!NOTE]
> **Zero Host Dependencies**: You do **not** need PostgreSQL installed on your machine, nor do you need `@prisma/cli` or TypeScript installed globally. All migrations, database seeding, TypeScript builds, and services run inside isolated Docker containers.

---

## 3. Architecture & Monorepo Structure

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
│   ├── Dockerfile                # Production containerization for Next.js 16
│   ├── .dockerignore             # Docker build context exclusions
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
│   ├── Dockerfile                # Production containerization (migrations + seed + Express)
│   ├── .dockerignore             # Docker build context exclusions
│   ├── .env.example              # Backend environment configuration template
│   ├── package.json              # Backend dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration for Node.js
│   └── vitest.config.ts          # Vitest test runner configuration
│
├── docker-compose.yml            # Multi-service orchestration (Postgres, Backend, Frontend)
├── .gitignore                    # Monorepo-wide Git ignore rules
├── .env.example                  # Root environment configuration template
├── package.json                  # Root monorepo convenience scripts (install:all, dev, test)
├── README.md                     # Comprehensive project documentation
├── DECISIONS.md                  # Architectural Decision Records (ADRs)
└── AI_USAGE.md                   # Transparent log of AI tooling & manual modifications
```

---

## 4. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Custom SVG icon library |
| **Backend** | Node.js, Express.js 4/5, TypeScript, REST API |
| **Database & ORM** | PostgreSQL 17 Alpine, Prisma ORM 7 (`@prisma/adapter-pg`, `pg.Pool`) |
| **Validation** | Zod |
| **Testing** | Vitest, Supertest |
| **Containerization** | Docker, Docker Compose |

---

## 5. Frontend Features & User Experience

### 1. Traveler Profile Switcher (`UserSwitcher.tsx`)
- Located directly in the top navigation bar.
- Fetches real seeded users from `GET /api/users` (`Abenezer`, `Hana`, `Dawit`).
- Persists active profile in browser `localStorage` across page navigations and refreshes.
- Automatically injects the selected user ID as the `X-User-Id` header on all review submissions and tour bookings.
- Clearly flags unselected states with helpful prompts to guide traveler actions.

### 2. Editorial Discovery Homepage (`page.tsx`)
- **Hero Section**: Curated photography, search bar, explore call-to-action, quality assurance badges.
- **Category Filter Tabs**: All Destinations, History & Heritage, Food & Dining, Nature & Parks, Art & Culture, and Entertainment with real-time active states.
- **Top-Rated Toggle**: Directly queries `GET /api/places?sort=top-rated` to order places by Bayesian weighted score.
- **Search Integration**: Debounced search querying `GET /api/places?search=...` against destination titles and descriptions.
- **Interactive Destination Grid**: Responsive cards with hover image zoom, opening hours, location badges, star visualizations, review counts, and Top Rated badges.

### 3. Place Details Experience (`/places/[id]`)
- **Editorial Header**: Image banner, category tags, location metadata, opening hours, and verified traveler community assurance.
- **Real-Time Tour Slots & Booking**:
  - Displays all upcoming departure slots, start time, total capacity, and available seats.
  - "Reserve Seats" modal with interactive seat counter ($1 \le seats \le available$).
  - Full capacity protection and clear `409 Conflict` messaging: *"Sorry, this tour is fully booked or does not have enough available seats."*
  - Instant background refresh upon successful booking.
- **Verified Reviews & Form**:
  - Chronological list of traveler reviews with author names and dates.
  - Interactive review submission form with 1–5 star selector and 500-character counter.
  - Transparent upsert behavior: automatically switches between "Publish Review" (for first-time reviewers) and "Update Review" (for repeat reviewers), preventing duplicate records and updating place stats in real time.

---

## 6. REST API Specification

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

## 7. Local Setup & Execution Instructions

Wayfarer is engineered for **100% portable and reproducible execution**. A developer cloning this repository on a fresh computer needs only **Docker Desktop** and **Git** — no local PostgreSQL server, Node.js runtime, Prisma CLI, or globally installed tools are required.

---

### 7.1. Prerequisites

Ensure the following tools are installed on your machine:

| Tool | Minimum Version | Required For |
| :--- | :--- | :--- |
| **Docker Desktop** (or Docker Engine) | Docker 24.x+ / Docker Compose v2.20+ | Running full containerized stack (Postgres, Express API, Next.js) |
| **Git** | 2.30+ | Repository cloning and version control |
| *Node.js* (Optional) | `v20.x` or higher (`v24.x` recommended) | Only required if you choose host-based local development |
| *npm* (Optional) | `v10.x` or higher | Only required if running tests or linters directly on host |

> [!NOTE]
> **Zero Host Dependencies**: You do **not** need PostgreSQL installed on your machine, nor do you need `@prisma/cli` or TypeScript installed globally. All migrations, database seeding, TypeScript builds, and services run inside isolated Docker containers.

---

### 7.2. Clone Repository

Clone the repository and navigate into the project root directory:

**Linux / macOS (bash):**
```bash
git clone https://github.com/AbeniYirgalem/wayfarer-Abenezer-Yirgalem.git
cd wayfarer-Abenezer-Yirgalem
```

**Windows (PowerShell):**
```powershell
git clone https://github.com/AbeniYirgalem/wayfarer-Abenezer-Yirgalem.git
cd wayfarer-Abenezer-Yirgalem
```

---

### 7.3. Configure Environment Variables

Create your root environment configuration file by copying `.env.example`:

**Linux / macOS (bash):**
```bash
cp .env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

#### Environment Variables Reference & Defaults

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `POSTGRES_USER` | `wayfarer` | PostgreSQL superuser username |
| `POSTGRES_PASSWORD` | `wayfarer_dev` | PostgreSQL development password |
| `POSTGRES_DB` | `wayfarer` | Primary database name |
| `POSTGRES_PORT` | `5432` | Host port mapped to Postgres container (change to `5433` if 5432 is occupied) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | Public REST API base URL consumed by browser client components |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed frontend origin for backend CORS header policies |
| `DATABASE_URL` | `postgresql://wayfarer:wayfarer_dev@localhost:5432/wayfarer?schema=public` | Connection URL for host-based development |
| `SHADOW_DATABASE_URL` | `postgresql://wayfarer:wayfarer_dev@localhost:5432/wayfarer_shadow?schema=public` | Shadow database URL for host-based `prisma migrate dev` |

> [!TIP]
> The provided `.env.example` defaults work out of the box with zero modifications for Docker Compose.

---

### 7.4. Start Complete Application

Build and start all three services (**PostgreSQL 17**, **Express.js API**, and **Next.js Frontend**) in detached background mode:

```bash
docker compose up --build -d
```

#### Automatic Orchestration Order:
1. **`wayfarer-postgres`**: Initializes PostgreSQL 17 Alpine and performs periodic healthchecks (`pg_isready`).
2. **`wayfarer-backend`**: Waits for PostgreSQL to become healthy, automatically applies Prisma database migrations (`prisma migrate deploy`), seeds the complete Addis Ababa dataset (`prisma db seed`), and starts the Express REST API on port `5000`.
3. **`wayfarer-frontend`**: Waits for the backend to become healthy, starts the optimized Next.js App Router server, and listens on port `3000`.

---

### 7.5. Database Migration Instructions

Database migrations are **automatically executed on container startup** via `prisma migrate deploy` inside `wayfarer-backend`.

If you ever want to re-run or inspect migrations manually without installing host tools:

**Via Docker Compose (Recommended):**
```bash
docker compose exec backend npx prisma migrate deploy
```

**Via Host Node.js (Optional):**
```bash
npm run db:migrate --prefix backend
```

---

### 7.6. Database Seeding Instructions

Database seeding is **automatically executed on container startup** via `prisma db seed` inside `wayfarer-backend`. The seed script (`prisma/seed.ts`) is strictly **idempotent** (using upsert operations) and populates:
- **3 Seeded Users**: `Abenezer`, `Hana`, `Dawit` (for the profile switcher)
- **10 Addis Ababa Destinations**: National Museum, Holy Trinity Cathedral, 2000 Habesha, Tomoca Coffee, Entoto Natural Park, Unity Park, Ethnological Museum, Red Terror Museum, Fendika Cultural Centre, Bole Medhane Alem Boulevard
- **20 Real Traveler Reviews**: Ranging from 1 to 5 stars
- **6 Tour Slots**: Diverse times and capacities
- **4 Seeded Bookings**: Active reservations for tour slots

If you ever wish to re-seed or reset data manually:

**Via Docker Compose (Recommended):**
```bash
docker compose exec backend npx prisma db seed
```

**Via Host Node.js (Optional):**
```bash
npm run db:seed --prefix backend
```

---

### 7.7. Application URLs

Once the containers are running, access the following endpoints in your browser:

| Service / View | URL | Purpose |
| :--- | :--- | :--- |
| **Frontend Web App** | [http://localhost:3000](http://localhost:3000) | Main traveler discovery, filtering, and tour booking interface |
| **Destination Detail Example** | [http://localhost:3000/places/a0000001-0000-4000-8000-000000000001](http://localhost:3000/places/a0000001-0000-4000-8000-000000000001) | Place detail page with reviews and real-time tour booking |
| **Backend REST API** | [http://localhost:5000](http://localhost:5000) | Express.js API root service information |
| **API Health Check** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | API healthcheck endpoint (`{"success": true, "message": "Wayfarer API is running"}`) |
| **Seeded Users API** | [http://localhost:5000/api/users](http://localhost:5000/api/users) | List of seeded traveler profiles |
| **Destinations API** | [http://localhost:5000/api/places](http://localhost:5000/api/places) | Filtered place list with Bayesian weighted rating calculation |

---

### 7.8. How to View Logs

Monitor real-time output from all services or a specific container:

```bash
# View combined live logs from all services
docker compose logs -f

# View logs from Express backend only
docker compose logs -f backend

# View logs from Next.js frontend only
docker compose logs -f frontend

# View logs from PostgreSQL database only
docker compose logs -f postgres
```

---

### 7.9. How to Stop the Application

To gracefully stop all running containers:

```bash
# Stop containers while preserving database volume
docker compose down

# Stop containers and wipe database volumes (clean reset)
docker compose down -v
```

---

### 7.10. How to Restart the Application

To restart running containers:

```bash
# Quick restart without rebuilding images
docker compose restart

# Full restart with fresh build and clean container recreation
docker compose down
docker compose up --build -d
```

---

### 7.11. Troubleshooting Common Issues

#### 1. Port 5432 is already occupied by a local PostgreSQL service
If your host computer already runs a local PostgreSQL instance on port `5432`, the container will fail to bind port `5432`.
- **Solution**: Edit `.env` and set `POSTGRES_PORT=5433` (or any available port). Docker Compose maps `${POSTGRES_PORT:-5432}:5432` automatically, while the backend container communicates internally on port 5432 over Docker's bridge network without conflict.

#### 2. Port 3000 or 5000 is already in use
- **Linux/macOS**: Find and terminate the process holding the port:
  ```bash
  lsof -i :3000 && kill -9 <PID>
  lsof -i :5000 && kill -9 <PID>
  ```
- **Windows (PowerShell)**: Find and terminate the process holding the port:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  ```

#### 3. Docker daemon is not running
If running `docker compose up` gives `Cannot connect to the Docker daemon`:
- Ensure **Docker Desktop** is launched and the whale icon indicates "Engine running".
- Verify connectivity in your terminal with `docker info`.

#### 4. Host-Based Development Fallback (Running without full containers)
If you prefer running the Next.js frontend and Express backend directly on your host machine with Node.js:
```bash
# 1. Install all dependencies across monorepo
npm run install:all

# 2. Start only PostgreSQL via Docker
docker compose up -d postgres

# 3. Configure local environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 4. Run database migrations & seed on host
npm run db:migrate --prefix backend
npm run db:seed --prefix backend

# 5. Start dev servers in separate terminals
npm run dev:backend    # Terminal 1: http://localhost:5000
npm run dev:frontend   # Terminal 2: http://localhost:3000
```

---

## 8. Reviewer & Evaluation Guide

### 1. Zero Authentication / Traveler Switcher
- The project intentionally avoids passwords, login walls, or JWT sessions as specified by the take-home prompt.
- To test interactions as different users, select a traveler persona (`Abenezer`, `Hana`, or `Dawit`) from the dropdown menu in the top navigation bar.
- The active identity is persisted in `localStorage` and injected via the `X-User-Id` HTTP header on review and booking requests.

### 2. Bayesian Weighted Rating Verification
- Backend ranking is computed via:
  $$WR = \frac{v}{v + m} R + \frac{m}{v + m} C$$
  where $m = 5$, $v$ is review count, $R$ is place arithmetic mean, and $C$ is system-wide average rating ($3.50$ prior).
- Places with many positive reviews (e.g. 50 reviews at 4.8, $WR \approx 4.68$) decisively outrank single 5-star outlier reviews ($WR = 3.75$).
- Toggling "Top Rated" on the homepage directly queries `GET /api/places?sort=top-rated` to demonstrate deterministic ranking.

### 3. Concurrency Protection & Overbooking Prevention
- Tour seat reservations use PostgreSQL pessimistic row-level locking (`SELECT ... FOR UPDATE`) within atomic database transactions (`prisma.$transaction`).
- When a slot is full or requested seats exceed availability, the API returns `HTTP 409 Conflict` with a user-friendly message.
- True PostgreSQL parallel concurrency is validated via `backend/tests/booking-concurrency.test.ts` (20 simultaneous competing requests for 2 remaining seats yield exactly 2 successes and 18 conflict rejections, with zero overbooking).


