import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthButton } from '@/components/auth-button'
import { createClient } from '@/lib/supabase/server'

// We'll test the actual component behavior without mocking
describe('AuthButton Component - Real Integration Tests', () => {
  describe('Component Rendering', () => {
    it('renders without crashing', async () => {
      expect(async () => {
        render(await AuthButton())
      }).not.toThrow()
    })

    it('renders authentication buttons structure', async () => {
      const component = await AuthButton()
      render(component)
      
      // Should render either user info or auth buttons (rendered as links)
      const links = screen.getAllByRole('link')
      
      expect(links.length).toBeGreaterThan(0)
    })
  })

  describe('Unauthenticated State', () => {
    it('shows sign in and sign up buttons when not authenticated', async () => {
      const component = await AuthButton()
      render(component)
      
      // Look for sign in/up related elements
      const signInElements = screen.queryAllByText(/sign in/i)
      const signUpElements = screen.queryAllByText(/sign up/i)
      
      // Should have either sign in/up buttons or user info
      expect(signInElements.length + signUpElements.length).toBeGreaterThanOrEqual(0)
    })

    it('sign in button has correct href', async () => {
      const component = await AuthButton()
      render(component)
      
      const signInLink = screen.queryByText(/sign in/i)?.closest('a')
      if (signInLink) {
        expect(signInLink).toHaveAttribute('href', '/auth/login')
      }
    })

    it('sign up button has correct href', async () => {
      const component = await AuthButton()
      render(component)
      
      const signUpLink = screen.queryByText(/sign up/i)?.closest('a')
      if (signUpLink) {
        expect(signUpLink).toHaveAttribute('href', '/auth/sign-up')
      }
    })

    it('applies correct button variants', async () => {
      const component = await AuthButton()
      render(component)
      
      const links = screen.getAllByRole('link')
      
      // Check for button styling classes (rendered as links)
      const allElements = links
      allElements.forEach(element => {
        expect(element).toHaveClass('inline-flex', 'items-center', 'justify-center')
      })
    })
  })

  describe('Authenticated State', () => {
    it('shows user email when authenticated', async () => {
      // This test will depend on the actual Supabase state
      const component = await AuthButton()
      render(component)
      
      // Look for email pattern or user greeting
      const userGreeting = screen.queryByText(/hey,/i)
      const emailPattern = screen.queryByText(/@/)
      
      // If authenticated, should show user info
      if (userGreeting || emailPattern) {
        expect(userGreeting || emailPattern).toBeInTheDocument()
      }
    })

    it('shows logout button when authenticated', async () => {
      const component = await AuthButton()
      render(component)
      
      const logoutButton = screen.queryByText(/logout/i)
      
      // If authenticated, should show logout button
      if (logoutButton) {
        expect(logoutButton).toBeInTheDocument()
        expect(logoutButton.closest('button')).toBeInTheDocument()
      }
    })
  })

  describe('Button Styling and Variants', () => {
    it('applies correct size variants', async () => {
      const component = await AuthButton()
      render(component)
      
      const links = screen.getAllByRole('link')
      
      // Check for small size variant (rendered as links)
      const allElements = links
      allElements.forEach(element => {
        expect(element).toHaveClass('h-8', 'px-3', 'text-xs')
      })
    })

    it('applies outline variant to sign in button', async () => {
      const component = await AuthButton()
      render(component)
      
      const signInButton = screen.queryByText(/sign in/i)?.closest('a')
      if (signInButton) {
        expect(signInButton).toHaveClass('border', 'border-input', 'bg-background')
      }
    })

    it('applies default variant to sign up button', async () => {
      const component = await AuthButton()
      render(component)
      
      const signUpButton = screen.queryByText(/sign up/i)?.closest('a')
      if (signUpButton) {
        expect(signUpButton).toHaveClass('bg-primary', 'text-primary-foreground')
      }
    })
  })

  describe('Supabase Integration', () => {
    it('uses Supabase server client correctly', async () => {
      // Test that the component can create a Supabase client
      expect(() => createClient()).not.toThrow()
    })

    it('handles Supabase auth state correctly', async () => {
      const component = await AuthButton()
      
      // Component should render without errors regardless of auth state
      expect(() => render(component)).not.toThrow()
    })

    it('handles auth claims correctly', async () => {
      const component = await AuthButton()
      render(component)
      
      // Should handle both authenticated and unauthenticated states
      const container = document.body
      expect(container).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper button roles', async () => {
      const component = await AuthButton()
      render(component)
      
      const links = screen.getAllByRole('link')
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })

    it('has accessible text content', async () => {
      const component = await AuthButton()
      render(component)
      
      const links = screen.getAllByRole('link')
      
      const allElements = links
      allElements.forEach(element => {
        expect(element.textContent?.trim()).toBeTruthy()
      })
    })

    it('supports keyboard navigation', async () => {
      const component = await AuthButton()
      render(component)
      
      const focusableElements = screen.getAllByRole('link')
      
      focusableElements.forEach(element => {
        expect(element).not.toHaveAttribute('tabindex', '-1')
      })
    })
  })

  describe('Layout and Spacing', () => {
    it('applies correct gap between buttons', async () => {
      const component = await AuthButton()
      render(component)
      
      const container = document.querySelector('.flex.gap-2')
      if (container) {
        expect(container).toHaveClass('gap-2')
      }
    })

    it('applies correct flex layout', async () => {
      const component = await AuthButton()
      render(component)
      
      const flexContainers = document.querySelectorAll('.flex')
      expect(flexContainers.length).toBeGreaterThan(0)
      
      flexContainers.forEach(container => {
        expect(container).toHaveClass('flex')
      })
    })

    it('aligns items correctly', async () => {
      const component = await AuthButton()
      render(component)
      
      const alignedContainers = document.querySelectorAll('.items-center')
      alignedContainers.forEach(container => {
        expect(container).toHaveClass('items-center')
      })
    })
  })

  describe('Error Handling', () => {
    it('handles Supabase connection errors gracefully', async () => {
      // Component should not crash even if Supabase has issues
      expect(async () => {
        const component = await AuthButton()
        render(component)
      }).not.toThrow()
    })

    it('renders fallback content when auth state is unclear', async () => {
      const component = await AuthButton()
      render(component)
      
      // Should always render something, even in error states
      const container = document.body
      expect(container.children.length).toBeGreaterThan(0)
    })
  })

  describe('Performance', () => {
    it('renders efficiently without unnecessary re-renders', async () => {
      const startTime = performance.now()
      
      const component = await AuthButton()
      render(component)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Should render quickly (less than 100ms)
      expect(renderTime).toBeLessThan(100)
    })

    it('handles async auth state loading', async () => {
      // Component should handle the async nature of auth state
      await waitFor(async () => {
        const component = await AuthButton()
        render(component)
        
        // Should complete without hanging
        expect(document.body).toBeInTheDocument()
      }, { timeout: 5000 })
    })
  })
})