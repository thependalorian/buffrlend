import { createClient } from '@/lib/supabase/server'

export interface AuthUser {
  id: string
  email?: string
  role?: string
  isAdmin?: boolean
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Get user profile with role information
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_admin')
      .eq('id', user.id)
      .single()

    return {
      id: user.id,
      email: user.email,
      role: profile?.role || 'user',
      isAdmin: profile?.is_admin || false
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth()
  
  if (!user.isAdmin) {
    throw new Error('Admin access required')
  }
  
  return user
}

export function createAuthResponse(message: string, status: number = 401) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
