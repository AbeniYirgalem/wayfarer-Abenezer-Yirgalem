import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h2 className="text-4xl font-bold tracking-tight text-gray-900">404 - Page Not Found</h2>
      <p className="mt-4 text-base text-gray-600">
        Sorry, we couldn&apos;t find the page you are looking for.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
      >
        Go back home
      </Link>
    </div>
  );
}

