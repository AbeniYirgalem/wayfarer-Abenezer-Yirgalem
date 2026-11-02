import { ApiHealthStatus } from '../components/ApiHealthStatus';

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-100 rounded-full">
          Phase 1: Architecture &amp; Monorepo Setup
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
          Wayfarer
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-sky-700">
          Honest Ratings, Fair Bookings
        </p>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
          A full-stack travel discovery and guided-tour booking platform built with an isolated Next.js App Router frontend and Express.js REST API backend, backed by PostgreSQL and Prisma ORM.
        </p>
      </section>

      {/* Backend API Live Connection Checker */}
      <section className="max-w-2xl mx-auto">
        <ApiHealthStatus />
      </section>

      {/* Architecture Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
            FE
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            Frontend (Next.js)
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Next.js App Router with React 19, TypeScript, and Tailwind CSS. Strictly decoupled with no direct database access, communicating through a centralized HTTP API client.
          </p>
          <div className="text-xs font-mono text-slate-400">
            port: 3000 &bull; frontend/
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
            BE
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            Backend (Express REST)
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Independent Express.js application with TypeScript, CORS, JSON parsing, centralized error handling, and standard health check endpoints.
          </p>
          <div className="text-xs font-mono text-slate-400">
            port: 5000 &bull; backend/
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
            DB
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            PostgreSQL &amp; Prisma
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            PostgreSQL 17 container orchestrated via Docker Compose. Data access exclusively isolated inside the Express backend using Prisma ORM.
          </p>
          <div className="text-xs font-mono text-slate-400">
            port: 5432 &bull; docker-compose.yml
          </div>
        </div>
      </section>

      {/* Verification Instructions */}
      <section className="p-6 bg-slate-100 rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-base font-semibold text-slate-800">
          Verification Endpoints &amp; Commands
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-400 block mb-1">Express API Health:</span>
            <span className="text-sky-700 font-bold">GET http://localhost:5000/api/health</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-400 block mb-1">Next.js Frontend:</span>
            <span className="text-indigo-700 font-bold">http://localhost:3000</span>
          </div>
        </div>
      </section>
    </main>
  );
}

