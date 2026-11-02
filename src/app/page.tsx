export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-sky-50 to-white text-slate-800">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-100 rounded-full">
          Phase 1: Architecture &amp; Setup Complete
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Wayfarer
        </h1>
        <p className="text-lg sm:text-xl font-medium text-sky-700">
          Honest Ratings, Fair Bookings
        </p>
        <p className="text-base text-slate-600 leading-relaxed">
          A full-stack travel discovery and guided-tour booking application engineered to solve misleading place rankings and tour overbooking.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 text-sm">Prisma 7 &amp; PostgreSQL</h3>
            <p className="text-xs text-slate-500 mt-1">
              Active PostgreSQL 17 container with @prisma/adapter-pg driver adapter.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 text-sm">Modular Monolith</h3>
            <p className="text-xs text-slate-500 mt-1">
              Separated presentation, API route handlers, business services, and validation layers.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 text-sm">Testing &amp; Types</h3>
            <p className="text-xs text-slate-500 mt-1">
              Strict TypeScript configuration with Zod validation and Vitest test runner.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
