/**
 * Unified Authentication Context for All Buffr Applications
 * 
 * This context provides comprehensive authentication functionality including
 * admin management, role-based permissions, and enhanced security features
 * for BuffrLend, BuffrSign, and The Shandi applications.
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  UserProfile, 
  UserRole, 
  AuthState, 
  LoginCredentials, 
  SignUpCredentials,
  AuthContextType,
  AdminUser
} from '@/lib/auth/types';
import { 
  validateAdminAccess, 
  useAdminAuth
} from '@/lib/auth/admin-auth';
import { authService } from '@/lib/auth/service';

// Use the AuthContextType from types
type EnhancedAuthContextType = AuthContextType;

const AuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const supabase = createClient();

  // Simple toast function for now
  const toast = ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    console.log(`${variant === 'destructive' ? 'ERROR' : 'INFO'}: ${title} - ${description}`);
  };

  // Admin auth state
  const adminAuth = useAdminAuth(state.user);

  // Define functions before using them in useEffect
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error: unknown) {
      return { error };
    }
  }, [supabase]);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile) {
        const { data: sessionData } = await supabase.auth.getSession();
        setState(prev => ({
          ...prev,
          user: profile,
          session: sessionData?.session || null,
          loading: false,
        }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setState(prev => ({ ...prev, error: 'Failed to fetch user profile', loading: false }));
    }
  }, [supabase]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState(prev => ({ ...prev, error: 'Failed to initialize authentication' }));
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            session: null,
            loading: false,
            error: null,
          });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Update session when token is refreshed
          setState(prev => ({
            ...prev,
            session: session,
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserProfile, supabase.auth]);

  // Set up automatic token refresh
  useEffect(() => {
    if (!state.session) return;

    const refreshToken = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.refreshSession();
        if (error) {
          console.error('Token refresh error:', error);
          // If refresh fails, sign out the user
          await signOut();
        } else if (session) {
          setState(prev => ({
            ...prev,
            session: session,
          }));
        }
      } catch (error) {
        console.error('Token refresh error:', error);
        await signOut();
      }
    };

    // Set up interval to refresh token before it expires
    const tokenExpiry = state.session?.expires_at;
    if (tokenExpiry && typeof tokenExpiry === 'number') {
      const expiryTime = new Date(tokenExpiry * 1000);
      const now = new Date();
      const timeUntilExpiry = expiryTime.getTime() - now.getTime();
      
      // Refresh token 5 minutes before expiry
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60000); // At least 1 minute
      
      const refreshTimer = setTimeout(refreshToken, refreshTime);
      
      return () => clearTimeout(refreshTimer);
    }
  }, [state.session, signOut, supabase.auth]);


  const signIn = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await authService.signIn(credentials);

      if (result.error) {
        setState(prev => ({ ...prev, error: result.error }));
        toast({
          title: "Sign in failed",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      // Update state with user and session
      setState(prev => ({
        ...prev,
        user: result.user,
        session: result.session,
        loading: false,
        error: null
      }));

      // Check if user is admin and set admin user state
      if (result.user) {
        const adminResult = validateAdminAccess(result.user);
        if (adminResult.is_admin && adminResult.user) {
          setAdminUser(adminResult.user);
        } else {
          setAdminUser(null);
        }
      }

      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });

      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await authService.signUp(credentials);

      if (result.error) {
        setState(prev => ({ ...prev, error: result.error }));
        toast({
          title: "Sign up failed",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });

      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!state.user) throw new Error('No user logged in');

      const result = await authService.updateProfile(state.user.id, updates);

      if (result.error) {
        toast({
          title: "Update failed",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      // Refresh user profile
      await refreshUser();

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await authService.resetPassword(email);
      
      if (result.error) {
        toast({
          title: "Reset failed",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }
      
      toast({
        title: "Reset email sent",
        description: "Please check your email for password reset instructions.",
      });
      
      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      toast({
        title: "Reset failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await authService.signInWithGoogle();

      if (result.error) {
        setState(prev => ({ ...prev, error: result.error }));
        toast({
          title: "Google sign in failed",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: "Google sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signInWithWhatsApp = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // WhatsApp Business API integration
      const phoneNumber = prompt('Please enter your WhatsApp phone number (with country code):');
      
      if (!phoneNumber) {
        setState(prev => ({ ...prev, loading: false }));
        return { error: null };
      }

      // Validate phone number format
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error('Please enter a valid phone number with country code (e.g., +1234567890)');
      }

      const result = await authService.signInWithWhatsApp(phoneNumber);

      if (result.error) {
        setState(prev => ({ ...prev, error: result.error }));
        toast({
          title: "WhatsApp sign in failed",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      // Store phone number for verification
      sessionStorage.setItem('whatsapp_phone', phoneNumber);
      
      // Redirect to OTP verification page
      window.location.href = `/auth/verify-otp?phone=${encodeURIComponent(phoneNumber)}`;

      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: "WhatsApp sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const hasPermission = useCallback((permission: keyof UserProfile['permissions']) => {
    return state.user?.permissions?.[permission] || false;
  }, [state.user]);

  const isRole = useCallback((role: UserRole) => {
    return state.user?.role === role;
  }, [state.user]);

  const refreshUser = async () => {
    if (state.user) {
      await fetchUserProfile(state.user.id);
    }
  };

  const refreshToken = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Manual token refresh error:', error);
        return { error };
      } else if (session) {
        setState(prev => ({
          ...prev,
          session: session,
        }));
        return { error: null };
      }
      return { error: null };
    } catch (error: unknown) {
      console.error('Manual token refresh error:', error);
      return { error };
    }
  };

  // Admin-specific methods
  const createAdminUser = async (email: string, firstName: string, lastName: string, role: UserRole = 'admin') => {
    try {
      if (!adminAuth.is_admin || !state.user?.permissions.can_manage_super_admins) {
        throw new Error('Insufficient permissions to create admin users');
      }

      const result = await authService.createAdminUser(email, firstName, lastName, role);

      if (result.error) {
        toast({
          title: "Failed to create admin user",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      toast({
        title: "Admin user created",
        description: `Admin user ${email} has been created successfully.`,
      });

      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      toast({
        title: "Failed to create admin user",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error };
    }
  };

  const promoteToAdmin = async (userId: string) => {
    try {
      if (!adminAuth.is_admin || !state.user?.permissions.can_manage_users) {
        throw new Error('Insufficient permissions to promote users');
      }

      const result = await authService.promoteToAdmin(userId);

      if (result.error) {
        toast({
          title: "Promotion failed",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      toast({
        title: "User promoted",
        description: "User has been promoted to admin successfully.",
      });

      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      toast({
        title: "Promotion failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error };
    }
  };

  const demoteFromAdmin = async (userId: string) => {
    try {
      if (!adminAuth.is_admin || !state.user?.permissions.can_manage_users) {
        throw new Error('Insufficient permissions to demote users');
      }

      const result = await authService.demoteFromAdmin(userId);

      if (result.error) {
        toast({
          title: "Demotion failed",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      toast({
        title: "User demoted",
        description: "User has been demoted from admin successfully.",
      });

      return { error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      toast({
        title: "Demotion failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error };
    }
  };

  const value: EnhancedAuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    signInWithGoogle,
    signInWithWhatsApp,
    hasPermission,
    isRole,
    refreshUser,
    refreshToken,
    // Admin-specific methods
    isAdmin: adminAuth.is_admin,
    adminLevel: adminAuth.admin_level,
    isBuffrEmail: adminAuth.buffr_email,
    canManageSuperAdmins: adminAuth.canManageSuperAdmins,
    canAccessAdminPanel: adminAuth.canAccessAdminPanel,
    adminUser,
    createAdminUser,
    promoteToAdmin,
    demoteFromAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
