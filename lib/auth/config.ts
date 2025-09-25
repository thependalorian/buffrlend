/**
 * Authentication Configuration for Buffr Applications
 * 
 * This module provides centralized configuration for authentication
 * across all Buffr applications.
 */

import { AuthConfig, UserPermissions, UserPreferences } from './types';

// ========== Environment Configuration ==========

export const getAuthConfig = (): AuthConfig => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing required Supabase configuration. Please check your environment variables.');
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey,
    adminDomain: '@buffr.ai',
    superAdminEmails: [
      'admin@buffr.ai',
      'superadmin@buffr.ai',
      'ceo@buffr.ai',
      'cto@buffr.ai',
      'founder@buffr.ai',
      'julius@buffr.ai',
      'george@buffr.ai'
    ],
    defaultPermissions: getDefaultPermissions(),
    defaultPreferences: getDefaultPreferences()
  };
};

// ========== Default Permissions ==========

export const getDefaultPermissions = (): UserPermissions => {
  return {
    can_view_dashboard: true,
    can_manage_users: false,
    can_manage_loans: false,
    can_manage_compliance: false,
    can_view_analytics: false,
    can_manage_settings: false,
    can_access_admin_panel: false,
    can_manage_super_admins: false
  };
};

export const getAdminPermissions = (): UserPermissions => {
  return {
    can_view_dashboard: true,
    can_manage_users: true,
    can_manage_loans: true,
    can_manage_compliance: true,
    can_view_analytics: true,
    can_manage_settings: true,
    can_access_admin_panel: true,
    can_manage_super_admins: false
  };
};

export const getSuperAdminPermissions = (): UserPermissions => {
  return {
    can_view_dashboard: true,
    can_manage_users: true,
    can_manage_loans: true,
    can_manage_compliance: true,
    can_view_analytics: true,
    can_manage_settings: true,
    can_access_admin_panel: true,
    can_manage_super_admins: true
  };
};

// ========== Default Preferences ==========

export const getDefaultPreferences = (): UserPreferences => {
  return {
    email_notifications: true,
    sms_notifications: true,
    two_factor_enabled: false,
    language: 'en',
    timezone: 'Africa/Windhoek',
    theme: 'system'
  };
};

// ========== Role-Based Configuration ==========

export const getRolePermissions = (role: string): UserPermissions => {
  switch (role) {
    case 'super_admin':
      return getSuperAdminPermissions();
    case 'admin':
      return getAdminPermissions();
    case 'user':
    default:
      return getDefaultPermissions();
  }
};

export const getRolePreferences = (role: string): UserPreferences => {
  const basePreferences = getDefaultPreferences();
  
  // Super admins and admins get enhanced security by default
  if (role === 'super_admin' || role === 'admin') {
    return {
      ...basePreferences,
      two_factor_enabled: true,
      email_notifications: true,
      sms_notifications: true
    };
  }
  
  return basePreferences;
};

// ========== Validation Rules ==========

export const getValidationRules = () => {
  return {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
    },
    phone: {
      pattern: /^\+[1-9]\d{1,14}$/,
      message: 'Please enter a valid phone number with country code'
    },
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/,
      message: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes'
    }
  };
};

// ========== Security Configuration ==========

export const getSecurityConfig = () => {
  return {
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes in milliseconds
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    passwordResetExpiry: 60 * 60 * 1000, // 1 hour in milliseconds
    twoFactorCodeExpiry: 5 * 60 * 1000, // 5 minutes in milliseconds
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes in milliseconds
    rateLimitMax: 100 // requests per window
  };
};

// ========== Feature Flags ==========

export const getFeatureFlags = () => {
  return {
    enableGoogleAuth: true,
    enableWhatsAppAuth: true,
    enableTwoFactor: true,
    enableAdminPanel: true,
    enableUserManagement: true,
    enableAuditLogging: true,
    enableRateLimiting: true,
    enableSessionManagement: true
  };
};

// ========== Localization ==========

export const getLocalizationConfig = () => {
  return {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'af', 'de', 'pt'],
    defaultTimezone: 'Africa/Windhoek',
    supportedTimezones: [
      'Africa/Windhoek',
      'Africa/Johannesburg',
      'Africa/Lagos',
      'UTC'
    ]
  };
};

// ========== Export Configuration ==========

// Lazy-loaded configuration to avoid module-level errors
let _authConfig: AuthConfig | null = null;
let _securityConfig: Record<string, unknown> | null = null;
let _featureFlags: Record<string, boolean> | null = null;
let _localizationConfig: Record<string, any> | null = null;
let _validationRules: Record<string, unknown> | null = null;

export const authConfig = (): AuthConfig => {
  if (!_authConfig) {
    _authConfig = getAuthConfig();
  }
  return _authConfig;
};

export const securityConfig = () => {
  if (!_securityConfig) {
    _securityConfig = getSecurityConfig();
  }
  return _securityConfig;
};

export const featureFlags = () => {
  if (!_featureFlags) {
    _featureFlags = getFeatureFlags();
  }
  return _featureFlags;
};

export const localizationConfig = () => {
  if (!_localizationConfig) {
    _localizationConfig = getLocalizationConfig();
  }
  return _localizationConfig;
};

export const validationRules = () => {
  if (!_validationRules) {
    _validationRules = getValidationRules();
  }
  return _validationRules;
};
