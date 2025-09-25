/**
 * Alert Component for BuffrLend
 * Provides consistent alert notifications across the application
 * Uses DaisyUI styling for consistency
 */

import React from 'react';
// Icons will be imported when needed
import { cn } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, children, ...props }, ref) => {
    const variantClasses = {
      info: 'alert-info',
      success: 'alert-success',
      warning: 'alert-warning',
      error: 'alert-error',
    };

    return (
      <div
        ref={ref}
        className={cn('alert', variantClasses[variant], className)}
        {...props}
      >
        <div className="flex flex-col">
          {title && (
            <div className="font-semibold text-sm mb-1">
              {title}
            </div>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

// Export additional components for compatibility
export const AlertDescription = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('text-sm', className)} {...props}>
    {children}
  </div>
);

export { Alert };
