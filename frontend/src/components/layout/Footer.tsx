export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
        <p className="font-medium text-slate-700">
          Wayfarer — Honest Ratings, Fair Bookings
        </p>
        <p>
          Full-Stack Take-Home Project &bull; Decoupled Next.js Frontend &amp; Express REST API Backend
        </p>
        <p className="text-slate-400">
          &copy; {new Date().getFullYear()} Wayfarer. Built for reliability, data integrity, and fairness.
        </p>
      </div>
    </footer>
  );
}

