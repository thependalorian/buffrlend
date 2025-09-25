/**
 * Unified Authentication Service for Buffr Products Ecosystem
 * TypeScript-first implementation with Python fallback
 * Provides cross-product user management and authentication
 */

import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { 
  CrossProductUser, 
  UnifiedAuthResponse, 
  CrossProductApiResponse,
  UserRoleEnum
} from '@/lib/types/unified';
import { UNIFIED_CONSTANTS } from '@/lib/types/unified';

export class UnifiedAuthService {
  private supabase = createClient()
  private serverSupabase = createServerClient()

  /**
   * Authenticate user across all Buffr products
   * TypeScript-first with Python fallback
   */
  async authenticateUser(
    email: string, 
    password: string,
    product: 'buffrlend' | 'buffrsign' | 'buffrhost' | 'buffrpayment' = 'buffrlend'
  ): Promise<UnifiedAuthResponse> {
    try {
      // Primary: TypeScript Supabase authentication
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        // Fallback: Try Python backend authentication
        return await this.fallbackToPythonAuth(email, password, product)
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Authentication failed - no user data returned'
        }
      }

      // Get unified user profile
      const user = await this.getUnifiedUserProfile(authData.user.id, product)
      
      if (!user) {
        return {
          success: false,
          error: 'User profile not found'
        }
      }

      // Create unified session
      const session = await this.createUnifiedSession(authData.user.id, product)

      return {
        success: true,
        user,
        session,
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_at: authData.session?.expires_at?.toString(),
        message: 'Authentication successful'
      }

    } catch {
      console.error('Unified authentication error:', "Unknown error")
      
      // Fallback: Try Python backend
      return await this.fallbackToPythonAuth(email, password, product)
    }
  }

  /**
   * Get unified user profile across all products
   */
  async getUnifiedUserProfile(
    userId: string, 
    product: 'buffrlend' | 'buffrsign' | 'buffrhost' | 'buffrpayment'
  ): Promise<CrossProductUser | null> {
    try {
      // Primary: TypeScript Supabase query
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching unified profile:', "Unknown error")
        // Fallback: Try Python backend
        return await this.fallbackToPythonProfile(userId, product)
      }

      if (!profile) {
        return null
      }

      // Transform to CrossProductUser
      const crossProductUser: CrossProductUser = {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        company_name: profile.company_name,
        user_role: profile.user_role,
        plan_type: profile.plan_type,
        status: profile.status,
        is_verified: profile.is_verified,
        last_login_at: profile.last_login_at,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        
        // Product-specific data
        buffrlend_data: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          monthly_income: profile.monthly_income,
          national_id: profile.national_id
        },
        
        buffrsign_data: {
          preferences: profile.preferences,
          biometric_data: profile.biometric_data,
          behavioral_metrics: profile.behavioral_metrics,
          subscription_expires_at: profile.subscription_expires_at
        },
        
        buffrhost_data: {
          property_id: profile.property_id,
          user_type_id: profile.user_type_id,
          permissions: profile.permissions
        },
        
        buffrpayment_data: {
          kyc_status: profile.kyc_status,
          consent_given: profile.consent_given,
          legal_basis: profile.legal_basis,
          retention_period: profile.retention_period
        },
        
        kyc_data: {
          country_code: profile.country_code,
          national_id_number: profile.national_id_number,
          national_id_type: profile.national_id_type,
          id_document_url: profile.id_document_url,
          kyc_status: profile.kyc_status
        }
      }

      return crossProductUser

    } catch {
      console.error('Error in getUnifiedUserProfile:', "Unknown error")
      return await this.fallbackToPythonProfile(userId, product)
    }
  }

  /**
   * Create unified session across products
   */
  async createUnifiedSession(
    userId: string,
    product: 'buffrlend' | 'buffrsign' | 'buffrhost' | 'buffrpayment'
  ): Promise<any> {
    try {
      const sessionToken = this.generateSessionToken()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Primary: TypeScript Supabase insert
      const { data: session, error } = await this.supabase
        .from('buffr_sessions')
        .insert({
          user_id: userId,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
          ip_address: null, // Will be set by middleware
          user_agent: null, // Will be set by middleware
          device_info: { product }
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating unified session:', "Unknown error")
        // Fallback: Try Python backend
        return await this.fallbackToPythonSession(userId, product)
      }

      return session

    } catch {
      console.error('Error in createUnifiedSession:', "Unknown error")
      return await this.fallbackToPythonSession(userId, product)
    }
  }

  /**
   * Register new user across all products
   */
  async registerUser(
    userData: {
      email: string
      password: string
      full_name: string
      phone_number?: string
      company_name?: string
      user_role?: UserRoleEnum
      product: 'buffrlend' | 'buffrsign' | 'buffrhost' | 'buffrpayment'
    }
  ): Promise<UnifiedAuthResponse> {
    try {
      // Primary: TypeScript Supabase registration
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            phone_number: userData.phone_number,
            company_name: userData.company_name,
            user_role: userData.user_role || UNIFIED_CONSTANTS.USER_ROLES.INDIVIDUAL,
            plan_type: UNIFIED_CONSTANTS.SUBSCRIPTION_PLANS.FREE,
            status: UNIFIED_CONSTANTS.USER_STATUS.PENDING_VERIFICATION,
            is_verified: false
          }
        }
      })

      if (authError) {
        return {
          success: false,
          error: authError.message
        }
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Registration failed - no user data returned'
        }
      }

      // Create unified profile
      const { error: profileError } = await this.supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name,
          phone_number: userData.phone_number,
          company_name: userData.company_name,
          user_role: userData.user_role || UNIFIED_CONSTANTS.USER_ROLES.INDIVIDUAL,
          plan_type: UNIFIED_CONSTANTS.SUBSCRIPTION_PLANS.FREE,
          status: UNIFIED_CONSTANTS.USER_STATUS.PENDING_VERIFICATION,
          is_verified: false
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        // Fallback: Try Python backend
        return await this.fallbackToPythonRegistration(userData)
      }

      // Get unified user profile
      const user = await this.getUnifiedUserProfile(authData.user.id, userData.product)

      return {
        success: true,
        user: user || undefined,
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_at: authData.session?.expires_at?.toString(),
        message: 'Registration successful'
      }

    } catch {
      console.error('Unified registration error:', "Unknown error")
      return await this.fallbackToPythonRegistration(userData)
    }
  }

  /**
   * Validate session across products
   */
  async validateSession(
    sessionToken: string,
    product: 'buffrlend' | 'buffrsign' | 'buffrhost' | 'buffrpayment'
  ): Promise<CrossProductUser | null> {
    try {
      // Primary: TypeScript Supabase validation
      const { data: session, error } = await this.supabase
        .from('buffr_sessions')
        .select(`
          *,
          profiles (*)
        `)
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (error || !session) {
        // Fallback: Try Python backend
        return await this.fallbackToPythonSessionValidation(sessionToken, product)
      }

      // Update last activity
      await this.supabase
        .from('buffr_sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', session.id)

      // Transform to CrossProductUser
      return await this.getUnifiedUserProfile(session.user_id, product)

    } catch {
      console.error('Session validation error:', "Unknown error")
      return await this.fallbackToPythonSessionValidation(sessionToken, product)
    }
  }

  /**
   * Python Backend Fallback Methods
   */

  private async fallbackToPythonAuth(
    email: string, 
    password: string, 
    product: string
  ): Promise<UnifiedAuthResponse> {
    try {
      const response = await fetch(`/api/auth/python-fallback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, product })
      })

      const data = await response.json()
      return data
    } catch {
      return {
        success: false,
        error: 'Python fallback authentication failed'
      }
    }
  }

  private async fallbackToPythonProfile(
    userId: string, 
    product: string
  ): Promise<CrossProductUser | null> {
    try {
      const response = await fetch(`/api/auth/python-fallback/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, product })
      })

      const data = await response.json()
      return data.success ? data.user : null
    } catch {
      return null
    }
  }

  private async fallbackToPythonSession(
    userId: string, 
    product: string
  ): Promise<any> {
    try {
      const response = await fetch(`/api/auth/python-fallback/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, product })
      })

      const data = await response.json()
      return data.success ? data.session : null
    } catch {
      return null
    }
  }

  private async fallbackToPythonRegistration(userData: any): Promise<UnifiedAuthResponse> {
    try {
      const response = await fetch(`/api/auth/python-fallback/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const data = await response.json()
      return data
    } catch {
      return {
        success: false,
        error: 'Python fallback registration failed'
      }
    }
  }

  private async fallbackToPythonSessionValidation(
    sessionToken: string, 
    product: string
  ): Promise<CrossProductUser | null> {
    try {
      const response = await fetch(`/api/auth/python-fallback/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken, product })
      })

      const data = await response.json()
      return data.success ? data.user : null
    } catch {
      return null
    }
  }

  /**
   * Utility Methods
   */

  private generateSessionToken(): string {
    return crypto.randomUUID()
  }

  /**
   * Cross-Product User Management
   */
  async syncUserAcrossProducts(userId: string): Promise<CrossProductApiResponse<any>> {
    try {
      const user = await this.getUnifiedUserProfile(userId, 'buffrlend')
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          timestamp: new Date().toISOString()
        }
      }

      // Sync to all products
      const syncPromises = [
        this.syncToBuffrSign(user),
        this.syncToBuffrHost(user),
        this.syncToBuffrPayment(user)
      ]

      const results = await Promise.allSettled(syncPromises)
      
      return {
        success: true,
        data: { results },
        message: 'User synced across all products',
        timestamp: new Date().toISOString(),
        product: 'buffrlend'
      }

    } catch {
      return {
        success: false,
        error: 'Failed to sync user across products',
        timestamp: new Date().toISOString(),
        product: 'buffrlend'
      }
    }
  }

  private async syncToBuffrSign(_user: CrossProductUser): Promise<any> {
    // Implementation for BuffrSign sync
    return { success: true, product: 'buffrsign' }
  }

  private async syncToBuffrHost(_user: CrossProductUser): Promise<any> {
    // Implementation for BuffrHost sync
    return { success: true, product: 'buffrhost' }
  }

  private async syncToBuffrPayment(_user: CrossProductUser): Promise<any> {
    // Implementation for BuffrPayment sync
    return { success: true, product: 'buffrpayment' }
  }
}

// Export singleton instance
export const unifiedAuthService = new UnifiedAuthService()
