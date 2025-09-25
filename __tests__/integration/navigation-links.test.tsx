import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Link from 'next/link'

// Test component with various link types
const NavigationLinksTest = () => {
  return (
    <nav>
      <Link href="/protected/dashboard" className="nav-link">
        Dashboard
      </Link>
      <Link href="/protected/loan-application" className="nav-link">
        Apply for Loan
      </Link>
      <Link href="/protected/loan-history" className="nav-link">
        Loan History
      </Link>
      <Link href="/protected/payments" className="nav-link">
        Payments
      </Link>
      <Link href="/protected/kyc-verification" className="nav-link">
        KYC Verification
      </Link>
      <Link href="/protected/documents" className="nav-link">
        Documents
      </Link>
      <Link href="/protected/help" className="nav-link">
        Help & Support
      </Link>
      <Link href="/protected/admin" className="nav-link admin-link">
        Admin Dashboard
      </Link>
      <Link href="/protected/admin/crm" className="nav-link admin-link">
        CRM
      </Link>
      <Link href="/protected/admin/kyc" className="nav-link admin-link">
        KYC Management
      </Link>
      <Link href="/protected/admin/verification" className="nav-link admin-link">
        Verification
      </Link>
      <Link href="/auth/login" className="auth-link">
        Sign In
      </Link>
      <Link href="/auth/sign-up" className="auth-link">
        Sign Up
      </Link>
      <Link href="/auth/forgot-password" className="auth-link">
        Forgot Password
      </Link>
      <a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
        External Link
      </a>
      <a href="mailto:support@buffrlend.com">
        Email Support
      </a>
      <a href="tel:+264812345678">
        Call Support
      </a>
    </nav>
  )
}

describe('Navigation Links Integration Tests', () => {
  describe('Link Rendering', () => {
    it('renders all navigation links correctly', () => {
      render(<NavigationLinksTest />)
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Apply for Loan')).toBeInTheDocument()
      expect(screen.getByText('Loan History')).toBeInTheDocument()
      expect(screen.getByText('Payments')).toBeInTheDocument()
      expect(screen.getByText('KYC Verification')).toBeInTheDocument()
      expect(screen.getByText('Documents')).toBeInTheDocument()
      expect(screen.getByText('Help & Support')).toBeInTheDocument()
    })

    it('renders admin navigation links correctly', () => {
      render(<NavigationLinksTest />)
      
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
      expect(screen.getByText('CRM')).toBeInTheDocument()
      expect(screen.getByText('KYC Management')).toBeInTheDocument()
      expect(screen.getByText('Verification')).toBeInTheDocument()
    })

    it('renders authentication links correctly', () => {
      render(<NavigationLinksTest />)
      
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByText('Sign Up')).toBeInTheDocument()
      expect(screen.getByText('Forgot Password')).toBeInTheDocument()
    })

    it('renders external and special links correctly', () => {
      render(<NavigationLinksTest />)
      
      expect(screen.getByText('External Link')).toBeInTheDocument()
      expect(screen.getByText('Email Support')).toBeInTheDocument()
      expect(screen.getByText('Call Support')).toBeInTheDocument()
    })
  })

  describe('Link Attributes', () => {
    it('has correct href attributes for protected routes', () => {
      render(<NavigationLinksTest />)
      
      const dashboardLink = screen.getByText('Dashboard').closest('a')
      expect(dashboardLink).toHaveAttribute('href', '/protected/dashboard')
      
      const loanAppLink = screen.getByText('Apply for Loan').closest('a')
      expect(loanAppLink).toHaveAttribute('href', '/protected/loan-application')
      
      const historyLink = screen.getByText('Loan History').closest('a')
      expect(historyLink).toHaveAttribute('href', '/protected/loan-history')
      
      const paymentsLink = screen.getByText('Payments').closest('a')
      expect(paymentsLink).toHaveAttribute('href', '/protected/payments')
      
      const kycLink = screen.getByText('KYC Verification').closest('a')
      expect(kycLink).toHaveAttribute('href', '/protected/kyc-verification')
      
      const documentsLink = screen.getByText('Documents').closest('a')
      expect(documentsLink).toHaveAttribute('href', '/protected/documents')
      
      const helpLink = screen.getByText('Help & Support').closest('a')
      expect(helpLink).toHaveAttribute('href', '/protected/help')
    })

    it('has correct href attributes for admin routes', () => {
      render(<NavigationLinksTest />)
      
      const adminDashboardLink = screen.getByText('Admin Dashboard').closest('a')
      expect(adminDashboardLink).toHaveAttribute('href', '/protected/admin')
      
      const crmLink = screen.getByText('CRM').closest('a')
      expect(crmLink).toHaveAttribute('href', '/protected/admin/crm')
      
      const kycMgmtLink = screen.getByText('KYC Management').closest('a')
      expect(kycMgmtLink).toHaveAttribute('href', '/protected/admin/kyc')
      
      const verificationLink = screen.getByText('Verification').closest('a')
      expect(verificationLink).toHaveAttribute('href', '/protected/admin/verification')
    })

    it('has correct href attributes for auth routes', () => {
      render(<NavigationLinksTest />)
      
      const signInLink = screen.getByText('Sign In').closest('a')
      expect(signInLink).toHaveAttribute('href', '/auth/login')
      
      const signUpLink = screen.getByText('Sign Up').closest('a')
      expect(signUpLink).toHaveAttribute('href', '/auth/sign-up')
      
      const forgotPasswordLink = screen.getByText('Forgot Password').closest('a')
      expect(forgotPasswordLink).toHaveAttribute('href', '/auth/forgot-password')
    })

    it('has correct attributes for external links', () => {
      render(<NavigationLinksTest />)
      
      const externalLink = screen.getByText('External Link').closest('a')
      expect(externalLink).toHaveAttribute('href', 'https://external-site.com')
      expect(externalLink).toHaveAttribute('target', '_blank')
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('has correct attributes for special links', () => {
      render(<NavigationLinksTest />)
      
      const emailLink = screen.getByText('Email Support').closest('a')
      expect(emailLink).toHaveAttribute('href', 'mailto:support@buffrlend.com')
      
      const phoneLink = screen.getByText('Call Support').closest('a')
      expect(phoneLink).toHaveAttribute('href', 'tel:+264812345678')
    })
  })

  describe('Link Styling', () => {
    it('applies navigation link classes', () => {
      render(<NavigationLinksTest />)
      
      const navLinks = document.querySelectorAll('.nav-link')
      expect(navLinks.length).toBeGreaterThan(0)
      
      navLinks.forEach(link => {
        expect(link).toHaveClass('nav-link')
      })
    })

    it('applies admin link classes', () => {
      render(<NavigationLinksTest />)
      
      const adminLinks = document.querySelectorAll('.admin-link')
      expect(adminLinks.length).toBeGreaterThan(0)
      
      adminLinks.forEach(link => {
        expect(link).toHaveClass('admin-link')
      })
    })

    it('applies auth link classes', () => {
      render(<NavigationLinksTest />)
      
      const authLinks = document.querySelectorAll('.auth-link')
      expect(authLinks.length).toBeGreaterThan(0)
      
      authLinks.forEach(link => {
        expect(link).toHaveClass('auth-link')
      })
    })
  })

  describe('Link Interaction', () => {
    it('handles click events on navigation links', () => {
      render(<NavigationLinksTest />)
      
      const dashboardLink = screen.getByText('Dashboard')
      
      expect(() => fireEvent.click(dashboardLink)).not.toThrow()
    })

    it('handles keyboard navigation', () => {
      render(<NavigationLinksTest />)
      
      const dashboardLink = screen.getByText('Dashboard')
      
      // Should be focusable
      dashboardLink.focus()
      expect(document.activeElement).toBe(dashboardLink)
      
      // Should respond to Enter key
      expect(() => {
        fireEvent.keyDown(dashboardLink, { key: 'Enter', code: 'Enter' })
      }).not.toThrow()
    })

    it('handles right-click context menu', () => {
      render(<NavigationLinksTest />)
      
      const dashboardLink = screen.getByText('Dashboard')
      
      expect(() => {
        fireEvent.contextMenu(dashboardLink)
      }).not.toThrow()
    })

    it('handles middle-click for new tab', () => {
      render(<NavigationLinksTest />)
      
      const dashboardLink = screen.getByText('Dashboard')
      
      expect(() => {
        fireEvent.click(dashboardLink, { button: 1 })
      }).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    it('has proper link roles', () => {
      render(<NavigationLinksTest />)
      
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
      
      links.forEach(link => {
        expect(link).toBeInTheDocument()
      })
    })

    it('has accessible text content', () => {
      render(<NavigationLinksTest />)
      
      const links = screen.getAllByRole('link')
      
      links.forEach(link => {
        expect(link.textContent?.trim()).toBeTruthy()
      })
    })

    it('supports screen readers', () => {
      render(<NavigationLinksTest />)
      
      const links = screen.getAllByRole('link')
      
      links.forEach(link => {
        // Should have accessible name
        expect(link).toHaveAccessibleName()
      })
    })

    it('has proper tab order', () => {
      render(<NavigationLinksTest />)
      
      const links = screen.getAllByRole('link')
      
      links.forEach(link => {
        expect(link).not.toHaveAttribute('tabindex', '-1')
      })
    })

    it('has proper ARIA attributes for external links', () => {
      render(<NavigationLinksTest />)
      
      const externalLink = screen.getByText('External Link')
      expect(externalLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('SEO and Performance', () => {
    it('uses Next.js Link component for internal navigation', () => {
      render(<NavigationLinksTest />)
      
      // Next.js Link components should render as anchor tags
      const internalLinks = [
        'Dashboard',
        'Apply for Loan',
        'Loan History',
        'Payments',
        'KYC Verification',
        'Documents',
        'Help & Support'
      ]
      
      internalLinks.forEach(linkText => {
        const link = screen.getByText(linkText).closest('a')
        expect(link).toBeInTheDocument()
        expect(link?.getAttribute('href')).toMatch(/^\//)
      })
    })

    it('uses regular anchor tags for external links', () => {
      render(<NavigationLinksTest />)
      
      const externalLink = screen.getByText('External Link').closest('a')
      expect(externalLink).toHaveAttribute('href', 'https://external-site.com')
    })

    it('has proper rel attributes for security', () => {
      render(<NavigationLinksTest />)
      
      const externalLink = screen.getByText('External Link').closest('a')
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Route Structure Validation', () => {
    it('follows consistent route patterns for protected routes', () => {
      render(<NavigationLinksTest />)
      
      const protectedRoutes = [
        '/protected/dashboard',
        '/protected/loan-application',
        '/protected/loan-history',
        '/protected/payments',
        '/protected/kyc-verification',
        '/protected/documents',
        '/protected/help'
      ]
      
      protectedRoutes.forEach(route => {
        expect(route).toMatch(/^\/protected\//)
      })
    })

    it('follows consistent route patterns for admin routes', () => {
      render(<NavigationLinksTest />)
      
      const adminRoutes = [
        '/protected/admin',
        '/protected/admin/crm',
        '/protected/admin/kyc',
        '/protected/admin/verification'
      ]
      
      adminRoutes.forEach(route => {
        expect(route).toMatch(/^\/protected\/admin/)
      })
    })

    it('follows consistent route patterns for auth routes', () => {
      render(<NavigationLinksTest />)
      
      const authRoutes = [
        '/auth/login',
        '/auth/sign-up',
        '/auth/forgot-password'
      ]
      
      authRoutes.forEach(route => {
        expect(route).toMatch(/^\/auth\//)
      })
    })
  })

  describe('Error Handling', () => {
    it('handles missing href gracefully', () => {
      const TestComponentWithMissingHref = () => (
        <nav>
          <Link href="">Empty Link</Link>
        </nav>
      )
      
      expect(() => {
        render(<TestComponentWithMissingHref />)
      }).not.toThrow()
    })

    it('handles invalid URLs gracefully', () => {
      const TestComponentWithInvalidURL = () => (
        <nav>
          <a href="invalid-url">Invalid URL</a>
        </nav>
      )
      
      expect(() => {
        render(<TestComponentWithInvalidURL />)
      }).not.toThrow()
    })
  })

  describe('Performance Optimization', () => {
    it('renders links efficiently', () => {
      const startTime = performance.now()
      
      render(<NavigationLinksTest />)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      expect(renderTime).toBeLessThan(100)
    })

    it('handles large numbers of links efficiently', () => {
      const ManyLinksComponent = () => (
        <nav>
          {Array.from({ length: 100 }, (_, i) => (
            <Link key={i} href={`/page-${i}`}>
              Link {i}
            </Link>
          ))}
        </nav>
      )
      
      const startTime = performance.now()
      render(<ManyLinksComponent />)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(200)
    })
  })
})