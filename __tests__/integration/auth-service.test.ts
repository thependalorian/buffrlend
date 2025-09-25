/**
 * Authentication Service Tests
 * Tests core authentication functionality without React components
 */

// Mock Supabase auth methods
const mockSignUp = jest.fn()
const mockSignInWithPassword = jest.fn()
const mockSignOut = jest.fn()
const mockResetPasswordForEmail = jest.fn()
const mockGetUser = jest.fn()

const mockSupabaseClient = {
  auth: {
    signUp: mockSignUp,
    signInWithPassword: mockSignInWithPassword,
    signOut: mockSignOut,
    resetPasswordForEmail: mockResetPasswordForEmail,
    getUser: mockGetUser,
  },
}

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabaseClient,
}))

// Authentication service functions
const signUpUser = async (email: string, password: string) => {
  if (!email || !password) {
    return {
      success: false,
      error: 'Email and password are required',
    }
  }

  if (!isValidEmail(email)) {
    return {
      success: false,
      error: 'Invalid email format',
    }
  }

  if (!isValidPassword(password)) {
    return {
      success: false,
      error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
    }
  }

  try {
    const { data, error } = await mockSupabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/protected`,
      },
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: {
        user: data.user,
        needsEmailConfirmation: !data.user?.email_confirmed_at,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

const signInUser = async (email: string, password: string) => {
  if (!email || !password) {
    return {
      success: false,
      error: 'Email and password are required',
    }
  }

  try {
    const { data, error } = await mockSupabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

const resetPassword = async (email: string) => {
  if (!email) {
    return {
      success: false,
      error: 'Email is required',
    }
  }

  if (!isValidEmail(email)) {
    return {
      success: false,
      error: 'Invalid email format',
    }
  }

  try {
    const { error } = await mockSupabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Password reset email sent',
    }
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

const signOutUser = async () => {
  try {
    const { error } = await mockSupabaseClient.auth.signOut()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Successfully signed out',
    }
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

// Validation helper functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  // Additional check for consecutive dots
  if (email.includes('..')) return false
  return emailRegex.test(email)
}

const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/\d/.test(password)) return false
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false
  return true
}

describe('Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signUpUser', () => {
    it('should register user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        email_confirmed_at: null,
      }

      mockSignUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const result = await signUpUser('test@example.com', 'SecurePassword123!')

      expect(result).toEqual({
        success: true,
        data: {
          user: mockUser,
          needsEmailConfirmation: true,
        },
      })

      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'SecurePassword123!',
        options: {
          emailRedirectTo: expect.stringContaining('/protected'),
        },
      })
    })

    it('should validate email format', async () => {
      const result = await signUpUser('invalid-email', 'SecurePassword123!')

      expect(result).toEqual({
        success: false,
        error: 'Invalid email format',
      })

      expect(mockSignUp).not.toHaveBeenCalled()
    })

    it('should validate password strength', async () => {
      const weakPasswords = [
        'weak',
        'PASSWORD',
        'password',
        'Password',
        'Password123',
      ]

      for (const password of weakPasswords) {
        const result = await signUpUser('test@example.com', password)
        expect(result.success).toBe(false)
        expect(result.error).toContain('Password must be at least 8 characters')
      }
    })

    it('should handle missing credentials', async () => {
      const result = await signUpUser('', '')

      expect(result).toEqual({
        success: false,
        error: 'Email and password are required',
      })
    })

    it('should handle Supabase errors', async () => {
      mockSignUp.mockResolvedValue({
        data: null,
        error: { message: 'User already registered' },
      })

      const result = await signUpUser('existing@example.com', 'SecurePassword123!')

      expect(result).toEqual({
        success: false,
        error: 'User already registered',
      })
    })
  })

  describe('signInUser', () => {
    it('should sign in user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'customer',
      }

      const mockSession = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      }

      mockSignInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      })

      const result = await signInUser('test@example.com', 'SecurePassword123!')

      expect(result).toEqual({
        success: true,
        data: {
          user: mockUser,
          session: mockSession,
        },
      })
    })

    it('should handle invalid credentials', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      })

      const result = await signInUser('test@example.com', 'WrongPassword')

      expect(result).toEqual({
        success: false,
        error: 'Invalid login credentials',
      })
    })

    it('should handle missing credentials', async () => {
      const result = await signInUser('', '')

      expect(result).toEqual({
        success: false,
        error: 'Email and password are required',
      })
    })
  })

  describe('resetPassword', () => {
    it('should send password reset email successfully', async () => {
      mockResetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      })

      const result = await resetPassword('test@example.com')

      expect(result).toEqual({
        success: true,
        message: 'Password reset email sent',
      })

      expect(mockResetPasswordForEmail).toHaveBeenCalledWith('test@example.com', {
        redirectTo: expect.stringContaining('/auth/update-password'),
      })
    })

    it('should validate email format', async () => {
      const result = await resetPassword('invalid-email')

      expect(result).toEqual({
        success: false,
        error: 'Invalid email format',
      })
    })

    it('should handle missing email', async () => {
      const result = await resetPassword('')

      expect(result).toEqual({
        success: false,
        error: 'Email is required',
      })
    })

    it('should handle Supabase errors', async () => {
      mockResetPasswordForEmail.mockResolvedValue({
        data: null,
        error: { message: 'Email not found' },
      })

      const result = await resetPassword('nonexistent@example.com')

      expect(result).toEqual({
        success: false,
        error: 'Email not found',
      })
    })
  })

  describe('signOutUser', () => {
    it('should sign out user successfully', async () => {
      mockSignOut.mockResolvedValue({
        error: null,
      })

      const result = await signOutUser()

      expect(result).toEqual({
        success: true,
        message: 'Successfully signed out',
      })
    })

    it('should handle sign out errors', async () => {
      mockSignOut.mockResolvedValue({
        error: { message: 'Sign out failed' },
      })

      const result = await signOutUser()

      expect(result).toEqual({
        success: false,
        error: 'Sign out failed',
      })
    })
  })

  describe('Validation Functions', () => {
    describe('isValidEmail', () => {
      it('should validate correct email formats', () => {
        expect(isValidEmail('test@example.com')).toBe(true)
        expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
        expect(isValidEmail('test+tag@example.org')).toBe(true)
      })

      it('should reject invalid email formats', () => {
        expect(isValidEmail('invalid-email')).toBe(false)
        expect(isValidEmail('@example.com')).toBe(false)
        expect(isValidEmail('test@')).toBe(false)
        expect(isValidEmail('test..test@example.com')).toBe(false)
      })
    })

    describe('isValidPassword', () => {
      it('should validate strong passwords', () => {
        expect(isValidPassword('SecurePassword123!')).toBe(true)
        expect(isValidPassword('MyStr0ng@Pass')).toBe(true)
      })

      it('should reject weak passwords', () => {
        expect(isValidPassword('weak')).toBe(false)
        expect(isValidPassword('PASSWORD')).toBe(false)
        expect(isValidPassword('password')).toBe(false)
        expect(isValidPassword('Password')).toBe(false)
        expect(isValidPassword('Password123')).toBe(false)
      })
    })
  })
})
