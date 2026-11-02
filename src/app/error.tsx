'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-red-600">Something went wrong</h2>
      <p className="mt-4 text-base text-gray-600">
        An unexpected error occurred while processing your request.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
      >
        Try again
      </button>
    </div>
  );
}

