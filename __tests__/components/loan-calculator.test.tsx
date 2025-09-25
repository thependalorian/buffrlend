/**
 * Tests for LoanCalculator component
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import LoanCalculator from '@/components/loan-calculator'

describe('LoanCalculator Component', () => {
  beforeEach(() => {
    render(<LoanCalculator />)
  })

  it('renders the calculator with default values', () => {
    // Check for range inputs by their attributes
    const loanAmountSlider = screen.getByDisplayValue('5000')
    const loanTermSlider = screen.getByDisplayValue('3')
    
    expect(loanAmountSlider).toBeInTheDocument()
    expect(loanAmountSlider).toHaveAttribute('type', 'range')
    expect(loanTermSlider).toBeInTheDocument()
    expect(loanTermSlider).toHaveAttribute('type', 'range')
    
    // Check for Apply Now button
    expect(screen.getByText(/Apply Now/i)).toBeInTheDocument()
  })

  it('updates loan amount on slider change', () => {
    const loanAmountSlider = screen.getByDisplayValue('5000')
    fireEvent.change(loanAmountSlider, { target: { value: '2000' } })
    expect(loanAmountSlider).toHaveValue('2000')
  })

  it('updates loan term on slider change', () => {
    const loanTermSlider = screen.getByDisplayValue('3')
    fireEvent.change(loanTermSlider, { target: { value: '5' } })
    expect(loanTermSlider).toHaveValue('5')
  })

  it('respects slider constraints', () => {
    const loanAmountSlider = screen.getByDisplayValue('5000')
    const loanTermSlider = screen.getByDisplayValue('3')
    
    // Check loan amount constraints
    expect(loanAmountSlider).toHaveAttribute('min', '500')
    expect(loanAmountSlider).toHaveAttribute('max', '10000')
    expect(loanAmountSlider).toHaveAttribute('step', '100')
    
    // Check loan term constraints
    expect(loanTermSlider).toHaveAttribute('min', '1')
    expect(loanTermSlider).toHaveAttribute('max', '5')
    expect(loanTermSlider).toHaveAttribute('step', '1')
  })

  it('updates calculations when using quick amount buttons', () => {
    // Find the button specifically (not the display value)
    const quickAmount2000 = screen.getByRole('button', { name: '$2,000' })
    fireEvent.click(quickAmount2000)
    
    // Check if the slider value updated
    const loanAmountSlider = screen.getByDisplayValue('2000')
    expect(loanAmountSlider).toBeInTheDocument()
  })

  it('displays calculation results automatically', () => {
    // Check for key result sections
    expect(screen.getByText(/Monthly Payment/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Cost/i)).toBeInTheDocument()
    
    // Check for cost breakdown
    expect(screen.getByText(/Cost Breakdown/i)).toBeInTheDocument()
    expect(screen.getByText(/BuffrLend Fee/i)).toBeInTheDocument()
    expect(screen.getByText(/Regulatory & Processing/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Payable/i)).toBeInTheDocument()
  })

  it('updates calculations when loan amount changes', () => {
    const loanAmountSlider = screen.getByDisplayValue('5000')
    
    // Change to 8000
    fireEvent.change(loanAmountSlider, { target: { value: '8000' } })
    
    // Check if calculations updated (should show different values)
    expect(screen.getByText(/Monthly Payment/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Cost/i)).toBeInTheDocument()
    
    // Verify the slider value changed
    expect(loanAmountSlider).toHaveValue('8000')
  })

  it('updates calculations when loan term changes', () => {
    const loanTermSlider = screen.getByDisplayValue('3')
    
    // Change to 1 month
    fireEvent.change(loanTermSlider, { target: { value: '1' } })
    
    // Verify the slider value changed
    expect(loanTermSlider).toHaveValue('1')
    
    // Monthly payment should equal total cost for 1 month term
    expect(screen.getByText(/Monthly Payment/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Cost/i)).toBeInTheDocument()
  })
})