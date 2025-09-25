/**
 * Unified Authentication Types for Buffr Applications
 * 
 * This module defines the core types used across all Buffr applications
 * for consistent authentication and authorization.
 */

import { Session } from '@supabase/supabase-js';

// ========== Core Types ==========

export type UserRole = 'user' | 'admin' | 'super_admin';

export type UserTheme = 'light' | 'dark' | 'system';

export type UserLanguage = 'en' | 'af' | 'de' | 'pt'; // English, Afrikaans, German, Portuguese for SADC

export type UserTimezone = 'Africa/Windhoek' | 'Africa/Johannesburg' | 'Africa/Lagos' | 'UTC';

// ========== User Profile Interface ==========

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  company_name?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  national_id?: string;
  city?: string;
  country?: string;
  employment_status?: 'employed' | 'self_employed' | 'unemployed' | 'student' | 'retired';
  monthly_income?: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  preferences: UserPreferences;
  permissions: UserPermissions;
}

// ========== User Preferences ==========

export interface UserPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  two_factor_enabled: boolean;
  language: UserLanguage;
  timezone: UserTimezone;
  theme: UserTheme;
}

// ========== User Permissions ==========

export interface UserPermissions {
  can_view_dashboard: boolean;
  can_manage_users: boolean;
  can_manage_loans: boolean;
  can_manage_compliance: boolean;
  can_view_analytics: boolean;
  can_manage_settings: boolean;
  can_access_admin_panel: boolean;
  can_manage_super_admins: boolean;
}

// ========== Authentication State ==========

export interface AuthState {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

// ========== Authentication Credentials ==========

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  phone?: string;
  role?: UserRole;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdate {
  current_password: string;
  new_password: string;
}

// ========== Two-Factor Authentication ==========

export interface TwoFactorSetup {
  method: 'authenticator' | 'sms' | 'email';
  secret?: string;
  backup_codes?: string[];
}

export interface TwoFactorVerification {
  method: 'authenticator' | 'sms' | 'email';
  code: string;
}

// ========== Admin Authentication ==========

export interface AdminUser extends UserProfile {
  is_admin: boolean;
  admin_level: 'admin' | 'super_admin';
  buffr_email: boolean;
}

export interface AdminAuthResult {
  is_admin: boolean;
  admin_level?: 'admin' | 'super_admin';
  user?: AdminUser;
  error?: string;
}

// ========== Authentication Context ==========

export interface AuthContextType extends AuthState {
  // Basic auth methods
  signIn: (credentials: LoginCredentials) => Promise<{ error: unknown }>;
  signUp: (credentials: SignUpCredentials) => Promise<{ error: unknown }>;
  signOut: () => Promise<{ error: unknown }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: unknown }>;
  resetPassword: (email: string) => Promise<{ error: unknown }>;
  signInWithGoogle: () => Promise<{ error: unknown }>;
  signInWithWhatsApp: () => Promise<{ error: unknown }>;
  
  // Enhanced methods
  hasPermission: (permission: keyof UserPermissions) => boolean;
  isRole: (role: UserRole) => boolean;
  refreshUser: () => Promise<void>;
  refreshToken: () => Promise<{ error: unknown }>;
  
  // Admin-specific methods
  isAdmin: boolean;
  adminLevel: 'admin' | 'super_admin' | undefined;
  isBuffrEmail: boolean;
  canManageSuperAdmins: boolean;
  canAccessAdminPanel: boolean;
  adminUser: AdminUser | null;
  
  // Enhanced user management
  createAdminUser: (email: string, firstName: string, lastName: string, role?: UserRole) => Promise<{ error: unknown }>;
  promoteToAdmin: (userId: string) => Promise<{ error: unknown }>;
  demoteFromAdmin: (userId: string) => Promise<{ error: unknown }>;
}

// ========== API Response Types ==========

export interface AuthResponse {
  user: UserProfile | null;
  session: Session | null;
  error: string | null;
}

export interface AdminResponse {
  is_admin: boolean;
  admin_level?: 'admin' | 'super_admin';
  user?: AdminUser;
  error?: string;
}

// ========== Database Types ==========

export interface DatabaseUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

// ========== Utility Types ==========

export type PermissionKey = keyof UserPermissions;
export type RoleKey = UserRole;
export type AdminLevel = 'admin' | 'super_admin';

// ========== Configuration Types ==========

export interface AuthConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey?: string;
  adminDomain: string;
  superAdminEmails: string[];
  defaultPermissions: UserPermissions;
  defaultPreferences: UserPreferences;
}

// ========== Error Types ==========

export interface AuthError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ========== Event Types ==========

export interface AuthEvent {
  type: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'ADMIN_PROMOTED' | 'ADMIN_DEMOTED';
  user?: UserProfile;
  adminUser?: AdminUser;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
