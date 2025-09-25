/**
 * Select Component for BuffrLend
 * Provides consistent select dropdown inputs across the application
 * Uses DaisyUI styling for consistency
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'select select-bordered w-full',
            error && 'select-error',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
        {helperText && !error && (
          <label className="label">
            <span className="label-text-alt">{helperText}</span>
          </label>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Export additional components for compatibility with shadcn/ui
export const SelectTrigger = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('select select-bordered w-full', className)} {...props}>
    {children}
  </div>
);

export const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <span className="text-gray-500">{placeholder || 'Select an option'}</span>
);

export const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <div className="dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
    {children}
  </div>
);

export const SelectItem = ({ children, ...props }: { value: string; children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className="cursor-pointer rounded-lg px-3 py-2 hover:bg-base-200" {...props}>
    {children}
  </div>
);

export { Select };
