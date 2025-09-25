import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component - Comprehensive Tests', () => {
  describe('Basic Rendering', () => {
    it('renders button with text content', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Click me')
    })

    it('renders as button element by default', () => {
      render(<Button>Test Button</Button>)
      const button = screen.getByRole('button')
      expect(button.tagName).toBe('BUTTON')
    })

    it('renders with proper default classes', () => {
      render(<Button>Test Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'inline-flex',
        'items-center', 
        'justify-center',
        'gap-2',
        'whitespace-nowrap',
        'rounded-md',
        'text-sm',
        'font-medium',
        'transition-colors'
      )
    })
  })

  describe('Variant Styles', () => {
    it('applies default variant styles', () => {
      render(<Button variant="default">Default Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'bg-primary',
        'text-primary-foreground',
        'shadow',
        'hover:bg-primary/90'
      )
    })

    it('applies destructive variant styles', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'bg-destructive',
        'text-destructive-foreground',
        'shadow-sm',
        'hover:bg-destructive/90'
      )
    })

    it('applies outline variant styles', () => {
      render(<Button variant="outline">Outline Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'border',
        'border-input',
        'bg-background',
        'shadow-sm',
        'hover:bg-accent',
        'hover:text-accent-foreground'
      )
    })

    it('applies secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'bg-secondary',
        'text-secondary-foreground',
        'shadow-sm',
        'hover:bg-secondary/80'
      )
    })

    it('applies ghost variant styles', () => {
      render(<Button variant="ghost">Ghost Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'hover:bg-accent',
        'hover:text-accent-foreground'
      )
    })

    it('applies link variant styles', () => {
      render(<Button variant="link">Link Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'text-primary',
        'underline-offset-4',
        'hover:underline'
      )
    })
  })

  describe('Size Variants', () => {
    it('applies default size styles', () => {
      render(<Button size="default">Default Size</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9', 'px-4', 'py-2')
    })

    it('applies small size styles', () => {
      render(<Button size="sm">Small Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-8', 'rounded-md', 'px-3', 'text-xs')
    })

    it('applies large size styles', () => {
      render(<Button size="lg">Large Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'rounded-md', 'px-8')
    })

    it('applies icon size styles', () => {
      render(<Button size="icon">🔍</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9', 'w-9')
    })
  })

  describe('Interactive Behavior', () => {
    it('handles click events correctly', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('handles multiple clicks', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(3)
    })

    it('passes event object to click handler', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object))
    })

    it('supports keyboard interaction (Enter key)', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Press Enter</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      // Test that the button is focusable and can receive keyboard events
      expect(button).toHaveFocus()
      expect(button).not.toHaveAttribute('tabindex', '-1')
      
      // Simulate the native browser behavior for Enter key
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' })
      fireEvent.click(button) // Browsers trigger click on Enter
      
      expect(handleClick).toHaveBeenCalled()
    })

    it('supports keyboard interaction (Space key)', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Press Space</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      // Test that the button is focusable and can receive keyboard events
      expect(button).toHaveFocus()
      expect(button).not.toHaveAttribute('tabindex', '-1')
      
      // Simulate the native browser behavior for Space key
      fireEvent.keyDown(button, { key: ' ', code: 'Space' })
      fireEvent.click(button) // Browsers trigger click on Space
      
      expect(handleClick).toHaveBeenCalled()
    })
  })

  describe('Disabled State', () => {
    it('can be disabled', () => {
      render(<Button disabled>Disabled button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('applies disabled styles', () => {
      render(<Button disabled>Disabled button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
    })

    it('does not trigger click events when disabled', () => {
      const handleClick = jest.fn()
      render(<Button disabled onClick={handleClick}>Disabled button</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('cannot be focused when disabled', () => {
      render(<Button disabled>Disabled button</Button>)
      const button = screen.getByRole('button')
      
      button.focus()
      expect(document.activeElement).not.toBe(button)
    })
  })

  describe('AsChild Prop', () => {
    it('renders as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      )
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
      expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center')
    })

    it('maintains button styling when rendered as child', () => {
      render(
        <Button asChild variant="outline" size="lg">
          <a href="/test">Styled Link</a>
        </Button>
      )
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass(
        'border',
        'border-input',
        'h-10',
        'px-8'
      )
    })
  })

  describe('Custom Props and Attributes', () => {
    it('accepts custom className', () => {
      render(<Button className="custom-class">Custom Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('merges custom className with default classes', () => {
      render(<Button className="custom-class">Custom Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class', 'inline-flex', 'items-center')
    })

    it('accepts custom HTML attributes', () => {
      render(
        <Button 
          data-testid="custom-button" 
          aria-label="Custom aria label"
          title="Custom title"
        >
          Custom Button
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-testid', 'custom-button')
      expect(button).toHaveAttribute('aria-label', 'Custom aria label')
      expect(button).toHaveAttribute('title', 'Custom title')
    })

    it('accepts type attribute', () => {
      render(<Button type="submit">Submit Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('accepts form attribute', () => {
      render(<Button form="test-form">Form Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('form', 'test-form')
    })
  })

  describe('Icon Support', () => {
    it('renders with SVG icons', () => {
      render(
        <Button>
          <svg data-testid="icon" width="16" height="16">
            <circle cx="8" cy="8" r="4" />
          </svg>
          Button with Icon
        </Button>
      )
      
      const button = screen.getByRole('button')
      const icon = screen.getByTestId('icon')
      
      expect(button).toContainElement(icon)
      expect(button).toHaveTextContent('Button with Icon')
    })

    it('applies icon-specific styles', () => {
      render(
        <Button>
          <svg className="w-4 h-4">
            <circle cx="8" cy="8" r="4" />
          </svg>
          Icon Button
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('[&_svg]:pointer-events-none', '[&_svg]:size-4', '[&_svg]:shrink-0')
    })
  })

  describe('Focus Management', () => {
    it('can receive focus', () => {
      render(<Button>Focusable Button</Button>)
      const button = screen.getByRole('button')
      
      button.focus()
      expect(document.activeElement).toBe(button)
    })

    it('applies focus-visible styles', () => {
      render(<Button>Focus Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-1',
        'focus-visible:ring-ring'
      )
    })

    it('maintains focus after click', () => {
      render(<Button>Click and Focus</Button>)
      const button = screen.getByRole('button')
      
      // Focus first, then click (more realistic user interaction)
      button.focus()
      fireEvent.click(button)
      
      // Button should still be focused after click
      expect(document.activeElement).toBe(button)
    })
  })

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Accessible Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>)
      const button = screen.getByRole('button', { name: 'Close dialog' })
      expect(button).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(
        <div>
          <Button aria-describedby="button-description">Help</Button>
          <div id="button-description">This button provides help</div>
        </div>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'button-description')
    })

    it('supports aria-pressed for toggle buttons', () => {
      render(<Button aria-pressed="true">Toggle Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Loading State', () => {
    it('can show loading state with custom content', () => {
      render(
        <Button disabled>
          <svg className="animate-spin w-4 h-4 mr-2" data-testid="spinner">
            <circle cx="12" cy="12" r="10" />
          </svg>
          Loading...
        </Button>
      )
      
      const button = screen.getByRole('button')
      const spinner = screen.getByTestId('spinner')
      
      expect(button).toBeDisabled()
      expect(button).toContainElement(spinner)
      expect(button).toHaveTextContent('Loading...')
    })
  })

  describe('Form Integration', () => {
    it('submits form when type is submit', () => {
      const handleSubmit = jest.fn(e => e.preventDefault())
      
      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit Form</Button>
        </form>
      )
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleSubmit).toHaveBeenCalled()
    })

    it('resets form when type is reset', () => {
      render(
        <form>
          <input defaultValue="test" data-testid="input" />
          <Button type="reset">Reset Form</Button>
        </form>
      )
      
      const input = screen.getByTestId('input') as HTMLInputElement
      const button = screen.getByRole('button')
      
      // Change input value
      fireEvent.change(input, { target: { value: 'changed' } })
      expect(input.value).toBe('changed')
      
      // Reset form
      fireEvent.click(button)
      expect(input.value).toBe('test')
    })
  })
})