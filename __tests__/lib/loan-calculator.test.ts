
/**
 * Comprehensive tests for loan calculator utility functions
 */

import {
  INTEREST_RATE,
  NAMFISA_LEVY_RATE,
  STAMP_DUTY,
  MIN_LOAN_AMOUNT,
  MAX_LOAN_AMOUNT,
  MIN_LOAN_TERM,
  MAX_LOAN_TERM,
  calculateInterest,
  calculateFees,
  calculateMonthlyPayment,
  calculateLoanDetails,
  validateSalaryCompliance,
  formatCurrency,
  validateLoanAmount,
  validateLoanTerm,
} from '@/lib/loan-calculator'

describe('Loan Calculator Utilities', () => {
  // Test suite for calculateInterest
  describe('calculateInterest', () => {
    it('should calculate the correct interest for a valid loan amount', () => {
      expect(calculateInterest(1000)).toBe(150)
      expect(calculateInterest(5000)).toBe(750)
      expect(calculateInterest(MAX_LOAN_AMOUNT)).toBe(MAX_LOAN_AMOUNT * (INTEREST_RATE / 100))
    })

    it('should return 0 for a loan amount of 0', () => {
      expect(calculateInterest(0)).toBe(0)
    })

    it('should throw an error for a negative loan amount', () => {
      expect(() => calculateInterest(-1000)).toThrow('Loan amount cannot be negative')
    })

    it('should throw an error for a non-numeric loan amount', () => {
      // @ts-ignore
      expect(() => calculateInterest('abc')).toThrow('Loan amount must be a valid number')
      // @ts-ignore
      expect(() => calculateInterest(null)).toThrow('Loan amount must be a valid number')
      // @ts-ignore
      expect(() => calculateInterest(undefined)).toThrow('Loan amount must be a valid number')
      expect(() => calculateInterest(NaN)).toThrow('Loan amount must be a valid number')
    })
  })

  // Test suite for calculateFees
  describe('calculateFees', () => {
    it('should calculate fees correctly for a valid loan amount', () => {
      const fees = calculateFees(5000)
      expect(fees.processing_fee).toBe(50) // 1% of 5000
      expect(fees.namfisa_levy).toBe(200) // 4% of 5000
      expect(fees.stamp_duty).toBe(15)
      expect(fees.total_fees).toBe(265)
    })

    it('should respect the minimum processing fee', () => {
      const fees = calculateFees(1000)
      expect(fees.processing_fee).toBe(20)
    })

    it('should respect the maximum processing fee', () => {
      const fees = calculateFees(15000)
      expect(fees.processing_fee).toBe(100)
    })

    it('should throw an error for a negative loan amount', () => {
      expect(() => calculateFees(-1000)).toThrow('Loan amount cannot be negative')
    })

    it('should throw an error for a non-numeric loan amount', () => {
      // @ts-ignore
      expect(() => calculateFees('abc')).toThrow('Loan amount must be a valid number')
    })
  })

  // Test suite for calculateMonthlyPayment
  describe('calculateMonthlyPayment', () => {
    it('should calculate the monthly payment correctly', () => {
      expect(calculateMonthlyPayment(6000, 3)).toBe(2000)
      expect(calculateMonthlyPayment(11500, 5)).toBe(2300)
    })

    it('should throw an error for a negative total payable amount', () => {
      expect(() => calculateMonthlyPayment(-6000, 3)).toThrow('Total payable cannot be negative')
    })

    it('should throw an error for a term of 0 or less', () => {
      expect(() => calculateMonthlyPayment(6000, 0)).toThrow('Term months must be greater than 0')
      expect(() => calculateMonthlyPayment(6000, -1)).toThrow('Term months must be greater than 0')
    })

    it('should throw an error for non-numeric inputs', () => {
      // @ts-ignore
      expect(() => calculateMonthlyPayment('abc', 3)).toThrow('Total payable must be a valid number')
      // @ts-ignore
      expect(() => calculateMonthlyPayment(6000, 'abc')).toThrow('Term months must be a valid number')
    })
  })

  // Test suite for calculateLoanDetails
  describe('calculateLoanDetails', () => {
    it('should calculate loan details correctly for a valid loan', () => {
      const details = calculateLoanDetails(5000, 3)
      expect(details.loan_amount).toBe(5000)
      expect(details.loan_term_months).toBe(3)
      expect(details.buffr_fee_amount).toBe(750)
      expect(details.user_total_fees).toBe(265)
      expect(details.total_payable).toBe(6015)
      expect(details.monthly_payment).toBe(2005)
    })

    it('should throw an error for an invalid loan amount', () => {
      expect(() => calculateLoanDetails(100, 3)).toThrow(`Loan amount must be at least N$${MIN_LOAN_AMOUNT}`)
      expect(() => calculateLoanDetails(20000, 3)).toThrow(`Loan amount cannot exceed N$${MAX_LOAN_AMOUNT}`)
    })

    it('should throw an error for an invalid loan term', () => {
      expect(() => calculateLoanDetails(5000, 0)).toThrow(`Loan term must be at least ${MIN_LOAN_TERM} month`)
      expect(() => calculateLoanDetails(5000, 6)).toThrow(`Loan term cannot exceed ${MAX_LOAN_TERM} months`)
    })
  })

  // Test suite for validateSalaryCompliance
  describe('validateSalaryCompliance', () => {
    it('should return compliant for a valid loan', () => {
      const result = validateSalaryCompliance(3000, 9000)
      expect(result.is_compliant).toBe(true)
      expect(result.max_loan_amount).toBe(3000)
    })

    it('should return not compliant for an invalid loan', () => {
      const result = validateSalaryCompliance(3001, 9000)
      expect(result.is_compliant).toBe(false)
    })

    it('should throw an error for negative or zero salary', () => {
      expect(() => validateSalaryCompliance(3000, 0)).toThrow('Monthly salary must be greater than 0')
      expect(() => validateSalaryCompliance(3000, -100)).toThrow('Monthly salary must be greater than 0')
    })
  })

  // Test suite for formatCurrency
  describe('formatCurrency', () => {
    it('should format a valid number correctly', () => {
      expect(formatCurrency(1000)).toBe('N$1,000')
      expect(formatCurrency(12345.67)).toBe('N$12,345.67')
    })

    it('should handle 0 correctly', () => {
      expect(formatCurrency(0)).toBe('N$0')
    })

    it('should handle non-numeric input gracefully', () => {
      // @ts-ignore
      expect(formatCurrency('abc')).toBe('N$0')
      // @ts-ignore
      expect(formatCurrency(null)).toBe('N$0')
      expect(formatCurrency(NaN)).toBe('N$0')
    })
  })

  // Test suite for validateLoanAmount
  describe('validateLoanAmount', () => {
    it('should return valid for an amount within range', () => {
      const result = validateLoanAmount(5000)
      expect(result.is_valid).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should return invalid for an amount below minimum', () => {
      const result = validateLoanAmount(100)
      expect(result.is_valid).toBe(false)
      expect(result.error).toBe(`Loan amount must be at least N$${MIN_LOAN_AMOUNT}`)
      expect(result.corrected_amount).toBe(MIN_LOAN_AMOUNT)
    })

    it('should return invalid for an amount above maximum', () => {
      const result = validateLoanAmount(20000)
      expect(result.is_valid).toBe(false)
      expect(result.error).toBe(`Loan amount cannot exceed N$${MAX_LOAN_AMOUNT}`)
      expect(result.corrected_amount).toBe(MAX_LOAN_AMOUNT)
    })
  })

  // Test suite for validateLoanTerm
  describe('validateLoanTerm', () => {
    it('should return valid for a term within range', () => {
      const result = validateLoanTerm(3)
      expect(result.is_valid).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should return invalid for a term below minimum', () => {
      const result = validateLoanTerm(0)
      expect(result.is_valid).toBe(false)
      expect(result.error).toBe(`Loan term must be at least ${MIN_LOAN_TERM} month`)
      expect(result.corrected_term).toBe(MIN_LOAN_TERM)
    })

    it('should return invalid for a term above maximum', () => {
      const result = validateLoanTerm(6)
      expect(result.is_valid).toBe(false)
      expect(result.error).toBe(`Loan term cannot exceed ${MAX_LOAN_TERM} months`)
      expect(result.corrected_term).toBe(MAX_LOAN_TERM)
    })

    it('should return invalid for a non-integer term', () => {
      const result = validateLoanTerm(3.5)
      expect(result.is_valid).toBe(false)
      expect(result.error).toBe('Loan term must be a whole number')
      expect(result.corrected_term).toBe(4)
    })
  })
})
