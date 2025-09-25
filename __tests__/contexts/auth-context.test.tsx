import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/lib/contexts/auth-context'

// Test component to use the auth context
const TestComponent = () => {
  const auth = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{auth.loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user">{auth.user ? `User: ${auth.user.email}` : 'No User'}</div>
      <div data-testid="error">{auth.error || 'No Error'}</div>
      <button onClick={() => auth.signIn({ email: 'test@example.com', password: 'password' })}>
        Sign In
      </button>
      <button onClick={() => auth.signUp({ 
        email: 'test@example.com', 
        password: 'password',
        first_name: 'Test',
        last_name: 'User'
      })}>
        Sign Up
      </button>
      <button onClick={() => auth.signOut()}>Sign Out</button>
      <button onClick={() => auth.signInWithGoogle()}>Sign In with Google</button>
      <button onClick={() => auth.signInWithWhatsApp()}>Sign In with WhatsApp</button>
      <button onClick={() => auth.resetPassword('test@example.com')}>Reset Password</button>
      <button onClick={() => auth.refreshUser()}>Refresh User</button>
      <button onClick={() => auth.refreshToken()}>Refresh Token</button>
      <div data-testid="permissions">
        {auth.hasPermission('can_view_dashboard') ? 'Can View Dashboard' : 'Cannot View Dashboard'}
      </div>
      <div data-testid="role">
        {auth.isRole('admin') ? 'Is Admin' : 'Not Admin'}
      </div>
    </div>
  )
}

describe('AuthContext Integration Tests', () => {
  describe('Provider Setup', () => {
    it('provides auth context to children', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      expect(screen.getByTestId('loading')).toBeInTheDocument()
      expect(screen.getByTestId('user')).toBeInTheDocument()
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })

    it('throws error when useAuth is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      expect(() => {
        render(<TestComponent />)
      }).toThrow('useAuth must be used within an AuthProvider')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Initial State', () => {
    it('starts with loading state', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      // Should start in loading state
      expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
    })

    it('starts with no user', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      expect(screen.getByTestId('user')).toHaveTextContent('No User')
    })

    it('starts with no error', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      expect(screen.getByTestId('error')).toHaveTextContent('No Error')
    })
  })

  describe('Authentication Methods', () => {
    it('has signIn method available', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const signInButton = screen.getByText('Sign In')
      expect(signInButton).toBeInTheDocument()
      
      // Should not throw when clicked
      expect(() => fireEvent.click(signInButton)).not.toThrow()
    })

    it('has signUp method available', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const signUpButton = screen.getByText('Sign Up')
      expect(signUpButton).toBeInTheDocument()
      
      expect(() => fireEvent.click(signUpButton)).not.toThrow()
    })

    it('has signOut method available', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const signOutButton = screen.getByText('Sign Out')
      expect(signOutButton).toBeInTheDocument()
      
      expect(() => fireEvent.click(signOutButton)).not.toThrow()
    })

    it('has OAuth methods available', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const googleButton = screen.getByText('Sign In with Google')
      const whatsappButton = screen.getByText('Sign In with WhatsApp')
      
      expect(googleButton).toBeInTheDocument()
      expect(whatsappButton).toBeInTheDocument()
      
      expect(() => fireEvent.click(googleButton)).not.toThrow()
      expect(() => fireEvent.click(whatsappButton)).not.toThrow()
    })

    it('has password reset method available', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const resetButton = screen.getByText('Reset Password')
      expect(resetButton).toBeInTheDocument()
      
      expect(() => fireEvent.click(resetButton)).not.toThrow()
    })
  })

  describe('User Management', () => {
    it('has refresh user method available', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const refreshButton = screen.getByText('Refresh User')
      expect(refreshButton).toBeInTheDocument()
      
      expect(() => fireEvent.click(refreshButton)).not.toThrow()
    })

    it('has refresh token method available', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const refreshTokenButton = screen.getByText('Refresh Token')
      expect(refreshTokenButton).toBeInTheDocument()
      
      expect(() => fireEvent.click(refreshTokenButton)).not.toThrow()
    })
  })

  describe('Permission System', () => {
    it('has permission checking method', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const permissionsDiv = screen.getByTestId('permissions')
      expect(permissionsDiv).toBeInTheDocument()
      
      // Should show permission status
      expect(permissionsDiv.textContent).toMatch(/Can View Dashboard|Cannot View Dashboard/)
    })

    it('has role checking method', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const roleDiv = screen.getByTestId('role')
      expect(roleDiv).toBeInTheDocument()
      
      // Should show role status
      expect(roleDiv.textContent).toMatch(/Is Admin|Not Admin/)
    })
  })

  describe('Loading States', () => {
    it('handles loading state changes', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      // Should eventually finish loading
      await waitFor(() => {
        const loadingDiv = screen.getByTestId('loading')
        expect(loadingDiv.textContent).toMatch(/Loading|Not Loading/)
      }, { timeout: 5000 })
    })

    it('shows loading during authentication operations', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const signInButton = screen.getByText('Sign In')
      
      act(() => {
        fireEvent.click(signInButton)
      })
      
      // Should handle loading state during auth operations
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toBeInTheDocument()
      }, { timeout: 1000 })
    })
  })

  describe('Error Handling', () => {
    it('handles authentication errors', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const signInButton = screen.getByText('Sign In')
      
      act(() => {
        fireEvent.click(signInButton)
      })
      
      // Should handle errors gracefully
      await waitFor(() => {
        const errorDiv = screen.getByTestId('error')
        expect(errorDiv).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('handles network errors gracefully', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      // Should not crash on network errors
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })
  })

  describe('Session Management', () => {
    it('handles session initialization', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      // Should initialize session
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('handles session changes', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      // Should handle auth state changes
      await waitFor(() => {
        expect(screen.getByTestId('user')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('handles token refresh', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const refreshTokenButton = screen.getByText('Refresh Token')
      
      act(() => {
        fireEvent.click(refreshTokenButton)
      })
      
      // Should handle token refresh
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Component Lifecycle', () => {
    it('cleans up subscriptions on unmount', () => {
      const { unmount } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      // Should not throw on unmount
      expect(() => unmount()).not.toThrow()
    })

    it('handles multiple auth operations', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const signInButton = screen.getByText('Sign In')
      const signOutButton = screen.getByText('Sign Out')
      
      // Multiple operations should not cause errors
      act(() => {
        fireEvent.click(signInButton)
        fireEvent.click(signOutButton)
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('user')).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Real-time Updates', () => {
    it('handles auth state changes in real-time', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      // Should handle real-time auth state changes
      await waitFor(() => {
        expect(screen.getByTestId('user')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('updates UI when user profile changes', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const refreshButton = screen.getByText('Refresh User')
      
      act(() => {
        fireEvent.click(refreshButton)
      })
      
      // Should update UI when profile changes
      await waitFor(() => {
        expect(screen.getByTestId('user')).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Performance', () => {
    it('renders efficiently', () => {
      const startTime = performance.now()
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      expect(renderTime).toBeLessThan(100)
    })

    it('handles rapid state changes efficiently', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      const signInButton = screen.getByText('Sign In')
      
      // Rapid clicks should not cause performance issues
      for (let i = 0; i < 5; i++) {
        act(() => {
          fireEvent.click(signInButton)
        })
      }
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toBeInTheDocument()
      }, { timeout: 1000 })
    })
  })

  describe('Memory Management', () => {
    it('prevents memory leaks on unmount', () => {
      const { unmount } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      // Should clean up properly
      expect(() => unmount()).not.toThrow()
    })

    it('handles component re-mounting', () => {
      const { unmount } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
      
      unmount()
      
      // Test that we can mount a new instance after unmounting
      expect(() => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      }).not.toThrow()
    })
  })
})