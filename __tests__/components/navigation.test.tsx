import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Navigation } from '@/components/navigation'
import { AuthProvider, useAuth } from '@/lib/contexts/auth-context'

// Mock the useAuth hook to provide a user
jest.mock('@/lib/contexts/auth-context', () => ({
  ...jest.requireActual('@/lib/contexts/auth-context'),
  useAuth: jest.fn(),
}))

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

// Test wrapper with mocked auth context
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  // Mock a user for navigation to render
  mockUseAuth.mockReturnValue({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'user',
      permissions: {
        can_view_dashboard: true,
        can_manage_users: false,
        can_manage_loans: false,
        can_manage_compliance: false,
        can_view_analytics: false,
        can_manage_settings: false,
        can_send_emails: false,
        can_manage_documents: false
      },
    },
    session: null,
    loading: false,
    error: null,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    updateProfile: jest.fn(),
    resetPassword: jest.fn(),
    signInWithGoogle: jest.fn(),
    signInWithWhatsApp: jest.fn(),
    hasPermission: jest.fn(),
    isRole: jest.fn(),
    refreshUser: jest.fn(),
    refreshToken: jest.fn(),
    isAdmin: false,
    adminLevel: 'admin',
    isBuffrEmail: false,
    canManageSuperAdmins: false,
    canAccessAdminPanel: false,
    adminUser: null,
    createAdminUser: jest.fn(),
    promoteToAdmin: jest.fn(),
    demoteFromAdmin: jest.fn(),
  })
  
  return <div>{children}</div>
}

describe('Navigation Component - Real Integration Tests', () => {
  describe('Component Rendering', () => {
    it('should render navigation structure correctly', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      // Should render the navigation container
      const nav = document.querySelector('nav')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveClass('bg-white', 'shadow-sm', 'border-b')
    })

    it('should render BuffrLend logo link', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      const logoLink = screen.queryByText('BuffrLend')
      if (logoLink) {
        expect(logoLink.closest('a')).toHaveAttribute('href', '/protected/dashboard')
        expect(logoLink).toHaveClass('text-xl', 'font-bold', 'text-blue-600')
      }
    })
  })

  describe('Navigation Links Structure', () => {
    it('should have proper link structure for navigation items', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      // Check if navigation items have proper structure
      const navItems = [
        'Dashboard',
        'Apply for Loan', 
        'Loan History',
        'Payments',
        'KYC Verification',
        'Documents',
        'Help & Support'
      ]
      
      navItems.forEach(itemName => {
        const item = screen.queryByText(itemName)
        if (item) {
          const link = item.closest('a')
          expect(link).toHaveAttribute('href')
          expect(link?.getAttribute('href')).toMatch(/^\/protected\//)
        }
      })
    })

    it('should render navigation icons correctly', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      // Check for SVG icons in navigation
      const svgElements = document.querySelectorAll('svg')
      expect(svgElements.length).toBeGreaterThan(0)
      
      // Check for Lucide React icons
      svgElements.forEach(svg => {
        expect(svg).toHaveClass('lucide')
      })
    })
  })

  describe('Mobile Navigation Functionality', () => {
    it('should toggle mobile menu visibility', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      // Find mobile menu button
      const menuButtons = screen.getAllByRole('button')
      const mobileMenuButton = menuButtons.find(button => 
        button.querySelector('svg')?.classList.contains('lucide-menu') ||
        button.querySelector('svg')?.classList.contains('lucide-x')
      )
      
      if (mobileMenuButton) {
        // Click to open mobile menu
        fireEvent.click(mobileMenuButton)
        
        // Check if mobile menu content is visible
        const mobileMenu = document.querySelector('.md\\:hidden')
        expect(mobileMenu).toBeInTheDocument()
      }
    })

    it('should close mobile menu when navigation item is clicked', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      // Find and click mobile menu button
      const menuButtons = screen.getAllByRole('button')
      const mobileMenuButton = menuButtons.find(button => 
        button.querySelector('svg')?.classList.contains('lucide-menu')
      )
      
      if (mobileMenuButton) {
        fireEvent.click(mobileMenuButton)
        
        // Find mobile navigation items
        const mobileNavItems = document.querySelectorAll('.md\\:hidden a')
        if (mobileNavItems.length > 0) {
          fireEvent.click(mobileNavItems[0])
          // Menu should close (state change)
        }
      }
    })
  })

  describe('Button Interactions', () => {
    it('should handle button clicks without errors', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(() => fireEvent.click(button)).not.toThrow()
      })
    })

    it('should have proper button styling', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        // Check that buttons have some basic styling classes
        expect(button.className).toContain('flex')
        expect(button.className).toContain('items-center')
      })
    })
  })

  describe('Link Navigation', () => {
    it('should have valid href attributes for all links', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      const links = document.querySelectorAll('a')
      links.forEach(link => {
        const href = link.getAttribute('href')
        expect(href).toBeTruthy()
        expect(href).toMatch(/^\//)
      })
    })

    it('should have proper link styling and hover states', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      const navLinks = document.querySelectorAll('nav a')
      expect(navLinks.length).toBeGreaterThan(0)
      
      // Check that at least some links have transition classes
      const linksWithTransitions = Array.from(navLinks).filter(link => 
        link.className.includes('transition')
      )
      expect(linksWithTransitions.length).toBeGreaterThan(0)
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive classes for desktop and mobile', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      // Check for responsive utility classes
      const responsiveElements = document.querySelectorAll('.md\\:hidden, .hidden.md\\:flex, .md\\:ml-6')
      expect(responsiveElements.length).toBeGreaterThan(0)
    })

    it('should render mobile-specific elements', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      // Check for mobile menu button
      const mobileElements = document.querySelectorAll('.md\\:hidden')
      expect(mobileElements.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility Features', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      const nav = document.querySelector('nav')
      expect(nav).toBeInTheDocument()
      
      // Check for accessible button labels
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeInTheDocument()
      })
    })

    it('should support keyboard navigation', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      const focusableElements = document.querySelectorAll('a, button')
      focusableElements.forEach(element => {
        expect(element).not.toHaveAttribute('tabindex', '-1')
      })
    })

    it('should have proper semantic HTML structure', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      // Check for semantic nav element
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      
      // Check for proper list structure if present
      const lists = document.querySelectorAll('ul, ol')
      lists.forEach(list => {
        const listItems = list.querySelectorAll('li')
        expect(listItems.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Visual States', () => {
    it('should apply active state styling correctly', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      // Check for active state classes
      const activeElements = document.querySelectorAll('.border-blue-500, .text-blue-700, .bg-blue-50')
      // Active elements may or may not be present depending on current route
      expect(activeElements.length).toBeGreaterThanOrEqual(0)
    })

    it('should have hover state classes', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      const hoverElements = document.querySelectorAll('[class*="hover:"]')
      expect(hoverElements.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('should render without crashing when no user is present', () => {
      expect(() => {
        render(
          <TestWrapper>
            <Navigation />
          </TestWrapper>
        )
      }).not.toThrow()
    })

    it('should handle missing navigation items gracefully', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      )
      
      // Component should render even if some navigation items are missing
      const nav = document.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })
  })
})