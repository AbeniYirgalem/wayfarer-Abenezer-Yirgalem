'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircleIcon, RefreshCwIcon } from '../components/ui/Icons';
import { Button } from '../components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Unhandled frontend application error:', error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full p-8 md:p-12 bg-white rounded-3xl border border-[#EDE9DF] shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-6">
          <AlertCircleIcon className="w-8 h-8" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2 block">
          Application Error
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#252A27] mb-3">
          Something went wrong
        </h1>
        <p className="text-sm text-[#777D78] leading-relaxed mb-8">
          We encountered an unexpected issue while rendering this page. You can attempt to reload or return home.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push('/')}
            className="flex-1"
          >
            Go to Home
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => reset()}
            className="flex-1"
          >
            <RefreshCwIcon className="w-4 h-4 mr-1.5" />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
