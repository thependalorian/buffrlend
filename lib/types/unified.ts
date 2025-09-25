// Unified Database Types for Buffr Products Ecosystem
// Generated from shared SQL migrations - matches unified schema across all products
// Auto-generated on: January 30, 2025

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Unified User Role Enum (matches shared_sql_migrations/001_create_unified_users_and_profiles.sql)
export type UserRoleEnum = 
  | 'individual'
  | 'sme_user'
  | 'enterprise_user'
  | 'admin'
  | 'hospitality_staff'
  | 'customer'
  | 'corporate_customer'

// Unified User Status Enum
export type UserStatusEnum = 
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'pending_verification'
  | 'archived'

// Unified Subscription Plan Enum
export type SubscriptionPlanEnum = 
  | 'free'
  | 'basic'
  | 'premium'
  | 'enterprise'
  | 'custom'

// Cross-Product User Management Types
export interface CrossProductUser {
  id: string
  email: string
  full_name: string | null
  phone_number: string | null
  company_name: string | null
  user_role: UserRoleEnum
  plan_type: string
  status: string
  is_verified: boolean
  last_login_at: string | null
  created_at: string | null
  updated_at: string | null
  
  // Product-specific data
  buffrlend_data?: {
    first_name: string | null
    last_name: string | null
    monthly_income: number | null
    national_id: string | null
  }
  
  buffrsign_data?: {
    preferences: Json | null
    biometric_data: Json | null
    behavioral_metrics: Json | null
    subscription_expires_at: string | null
  }
  
  buffrhost_data?: {
    property_id: number | null
    user_type_id: number | null
    permissions: string[] | null
  }
  
  buffrpayment_data?: {
    kyc_status: string | null
    consent_given: boolean | null
    legal_basis: string | null
    retention_period: number | null
  }
  
  // Unified KYC data
  kyc_data?: {
    country_code: string | null
    national_id_number: string | null
    national_id_type: string | null
    id_document_url: string | null
    kyc_status: string | null
  }
}

// Unified Authentication Types
export interface UnifiedAuthResponse {
  success: boolean
  user?: CrossProductUser
  session?: any
  access_token?: string
  refresh_token?: string
  expires_at?: string
  message?: string
  error?: string
}

// Cross-Product API Response Types
export interface CrossProductApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp: string
  product?: 'buffrlend' | 'buffrsign' | 'buffrhost' | 'buffrpayment'
  user_id?: string
}

// Unified Error Types
export interface UnifiedError {
  code: string
  message: string
  details?: Json
  product?: 'buffrlend' | 'buffrsign' | 'buffrhost' | 'buffrpayment'
  timestamp: string
}

// Constants for unified enums
export const UNIFIED_CONSTANTS = {
  USER_ROLES: {
    INDIVIDUAL: 'individual' as const,
    SME_USER: 'sme_user' as const,
    ENTERPRISE_USER: 'enterprise_user' as const,
    ADMIN: 'admin' as const,
    HOSPITALITY_STAFF: 'hospitality_staff' as const,
    CUSTOMER: 'customer' as const,
    CORPORATE_CUSTOMER: 'corporate_customer' as const,
  },
  USER_STATUS: {
    ACTIVE: 'active' as const,
    INACTIVE: 'inactive' as const,
    SUSPENDED: 'suspended' as const,
    PENDING_VERIFICATION: 'pending_verification' as const,
    ARCHIVED: 'archived' as const,
  },
  SUBSCRIPTION_PLANS: {
    FREE: 'free' as const,
    BASIC: 'basic' as const,
    PREMIUM: 'premium' as const,
    ENTERPRISE: 'enterprise' as const,
    CUSTOM: 'custom' as const,
  },
  PRODUCTS: {
    BUFFRLEND: 'buffrlend' as const,
    BUFFRSIGN: 'buffrsign' as const,
    BUFFRHOST: 'buffrhost' as const,
    BUFFRPAYMENT: 'buffrpayment' as const,
  }
} as const
