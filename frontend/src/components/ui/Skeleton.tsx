import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-[#EDE9DF]/80', className)}
      {...props}
    />
  );
}

export function PlaceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#EDE9DF] overflow-hidden shadow-sm flex flex-col h-full">
      <Skeleton className="w-full h-56 rounded-none" />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="pt-3 border-t border-[#EDE9DF]/60 mt-auto flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
