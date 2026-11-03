import React from 'react';
import { CheckIcon, AlertCircleIcon, XIcon } from './Icons';
import { cn } from '../../lib/utils';

export interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  description?: string;
  onClose?: () => void;
}

export function Toast({ type, message, description, onClose }: ToastProps) {
  const styles = {
    success: 'bg-[#163D32] text-white border-[#1D4D40]',
    error: 'bg-rose-900 text-white border-rose-800',
    info: 'bg-[#EDE9DF] text-[#252A27] border-[#D6D2C4]',
  };

  const icon = {
    success: <CheckIcon className="w-5 h-5 text-emerald-300" />,
    error: <AlertCircleIcon className="w-5 h-5 text-rose-300" />,
    info: <AlertCircleIcon className="w-5 h-5 text-[#163D32]" />,
  };

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-md w-full transition-all duration-300',
        styles[type]
      )}
    >
      <div className="shrink-0 mt-0.5">{icon[type]}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{message}</h4>
        {description && <p className="text-xs mt-1 opacity-90 leading-relaxed">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
