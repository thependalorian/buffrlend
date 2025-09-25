import { useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';

/**
 * Hook to handle automatic token refresh and session management
 * Provides utilities for checking token expiry and refreshing tokens
 */
export function useTokenRefresh() {
  const { session, refreshToken } = useAuth();

  // Check if token is close to expiry (within 5 minutes)
  const isTokenExpiringSoon = useCallback(() => {
    if (!session?.expires_at) return false;
    
    const expiryTime = new Date(session.expires_at * 1000);
    const now = new Date();
    const timeUntilExpiry = expiryTime.getTime() - now.getTime();
    
    // Consider token expiring soon if it expires within 5 minutes
    return timeUntilExpiry <= 5 * 60 * 1000;
  }, [session]);

  // Check if token is expired
  const isTokenExpired = useCallback(() => {
    if (!session?.expires_at) return true;
    
    const expiryTime = new Date(session.expires_at * 1000);
    const now = new Date();
    
    return now >= expiryTime;
  }, [session]);

  // Get time until token expires in minutes
  const getTimeUntilExpiry = useCallback(() => {
    if (!session?.expires_at) return 0;
    
    const expiryTime = new Date(session.expires_at * 1000);
    const now = new Date();
    const timeUntilExpiry = expiryTime.getTime() - now.getTime();
    
    return Math.max(0, Math.floor(timeUntilExpiry / (1000 * 60))); // Return minutes
  }, [session]);

  // Refresh token if needed
  const refreshTokenIfNeeded = useCallback(async () => {
    if (isTokenExpiringSoon()) {
      const { error } = await refreshToken();
      if (error) {
        console.error('Failed to refresh token:', error);
        return false;
      }
      return true;
    }
    return true;
  }, [isTokenExpiringSoon, refreshToken]);

  // Set up automatic refresh when token is expiring soon
  useEffect(() => {
    if (!session) return;

    const checkAndRefresh = async () => {
      if (isTokenExpiringSoon()) {
        await refreshTokenIfNeeded();
      }
    };

    // Check every minute
    const interval = setInterval(checkAndRefresh, 60000);
    
    return () => clearInterval(interval);
  }, [session, isTokenExpiringSoon, refreshTokenIfNeeded]);

  return {
    isTokenExpiringSoon,
    isTokenExpired,
    getTimeUntilExpiry,
    refreshTokenIfNeeded,
    refreshToken,
  };
}
