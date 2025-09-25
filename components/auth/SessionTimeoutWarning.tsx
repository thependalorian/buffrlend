'use client';

import { useState, useEffect } from 'react';
import { useTokenRefresh } from '@/lib/hooks/useTokenRefresh';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, RefreshCw } from 'lucide-react';

interface SessionTimeoutWarningProps {
  /** Time in minutes before expiry to show warning (default: 5) */
  warningThreshold?: number;
  /** Whether to show the warning (default: true) */
  showWarning?: boolean;
}

export function SessionTimeoutWarning({ 
  warningThreshold = 5, 
  showWarning = true 
}: SessionTimeoutWarningProps) {
  const { getTimeUntilExpiry, refreshToken } = useTokenRefresh();
  const [timeUntilExpiry, setTimeUntilExpiry] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);

  // Update time until expiry every minute
  useEffect(() => {
    const updateTime = () => {
      const timeLeft = getTimeUntilExpiry();
      setTimeUntilExpiry(timeLeft);
      
      // Show warning if time is less than threshold
      if (showWarning && timeLeft <= warningThreshold && timeLeft > 0) {
        setShowWarningAlert(true);
      } else {
        setShowWarningAlert(false);
      }
    };

    // Update immediately
    updateTime();

    // Update every minute
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, [getTimeUntilExpiry, warningThreshold, showWarning]);

  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    try {
      const { error } = await refreshToken();
      if (error) {
        console.error('Failed to refresh session:', error);
        // Could show an error toast here
      } else {
        setShowWarningAlert(false);
        setTimeUntilExpiry(getTimeUntilExpiry());
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Don't render if not showing warning or if warning shouldn't be shown
  if (!showWarning || !showWarningAlert || timeUntilExpiry <= 0) {
    return null;
  }

  const getWarningMessage = () => {
    if (timeUntilExpiry <= 1) {
      return 'Your session will expire in less than 1 minute. Please refresh to continue.';
    } else if (timeUntilExpiry <= 2) {
      return `Your session will expire in ${timeUntilExpiry} minutes. Please refresh to continue.`;
    } else {
      return `Your session will expire in ${timeUntilExpiry} minutes.`;
    }
  };

  const getAlertVariant = () => {
    if (timeUntilExpiry <= 1) {
      return 'error' as const;
    } else if (timeUntilExpiry <= 2) {
      return 'warning' as const;
    } else {
      return 'info' as const;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert variant={getAlertVariant()}>
        <Clock className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{getWarningMessage()}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefreshSession}
            disabled={isRefreshing}
            className="ml-2"
          >
            {isRefreshing ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              'Refresh'
            )}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
