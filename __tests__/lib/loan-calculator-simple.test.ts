/**
 * Simple tests for loan calculator utility functions
 */

import { 
  calculateInterest,
  calculateFees,
  calculateMonthlyPayment,
  formatCurrency,
  validateLoanAmount,
  validateLoanTerm
} from '@/lib/loan-calculator'

describe('Loan Calculator Utilities', () => {
  describe('calculateInterest', () => {
    it('calculates 15% interest correctly', () => {
      expect(calculateInterest(1000)).toBe(150)
      expect(calculateInterest(5000)).toBe(750)
    })
  })

  describe('calculateFees', () => {
    it('calculates fees correctly', () => {
      const fees = calculateFees(5000)
      expect(fees.namfisa_levy).toBe(200) // 4% of 5000
      expect(fees.stamp_duty).toBe(15)
    })
  })

  describe('calculateMonthlyPayment', () => {
    it('calculates monthly payment correctly', () => {
      expect(calculateMonthlyPayment(6000, 3)).toBe(2000)
    })
  })

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(1000)).toBe('N$1,000')
    })
  })

  describe('validateLoanAmount', () => {
    it('validates loan amount correctly', () => {
      expect(validateLoanAmount(500).is_valid).toBe(true)
      expect(validateLoanAmount(100).is_valid).toBe(false)
    })
  })

  describe('validateLoanTerm', () => {
    it('validates loan term correctly', () => {
      expect(validateLoanTerm(3).is_valid).toBe(true)
      expect(validateLoanTerm(0).is_valid).toBe(false)
    })
  })
})
