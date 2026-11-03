import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#777D78] mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'w-full h-11 px-3.5 py-2 text-sm bg-white border rounded-xl text-[#252A27] placeholder:text-[#777D78]/60 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[#163D32]/20 focus:border-[#163D32]',
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
              : 'border-[#D6D2C4] hover:border-[#B5B0A1]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-[#777D78]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
