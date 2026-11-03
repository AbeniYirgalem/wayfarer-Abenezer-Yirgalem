import React from 'react';
import { CompassIcon } from './Icons';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-2xl border border-[#EDE9DF] shadow-sm max-w-lg mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-[#F8F7F3] border border-[#EDE9DF] flex items-center justify-center text-[#163D32] mb-4">
        {icon || <CompassIcon className="w-7 h-7 stroke-[1.5]" />}
      </div>
      <h3 className="text-lg font-semibold text-[#252A27] mb-2">{title}</h3>
      <p className="text-sm text-[#777D78] leading-relaxed max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
