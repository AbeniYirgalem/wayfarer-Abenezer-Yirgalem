import React from 'react';
import Link from 'next/link';
import { CompassIcon, ArrowRightIcon } from '../components/ui/Icons';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full p-8 md:p-12 bg-white rounded-3xl border border-[#EDE9DF] shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#F8F7F3] border border-[#EDE9DF] text-[#163D32] flex items-center justify-center mx-auto mb-6">
          <CompassIcon className="w-8 h-8 opacity-60" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#163D32] mb-2 block">
          404 Error
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#252A27] mb-3">
          Destination Uncharted
        </h1>
        <p className="text-sm text-[#777D78] leading-relaxed mb-8">
          The page or landmark you are attempting to visit could not be found. Let&apos;s guide you back to familiar trails.
        </p>
        <Link href="/">
          <Button variant="primary" size="md" className="w-full">
            <span>Explore All Places</span>
            <ArrowRightIcon className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
