/**
 * Error Handling and Validation Tests
 * Tests input validation, error handling, and edge cases
 */

import { 
  validateLoanAmount, 
  validateLoanTerm, 
  validateSalaryCompliance,
  formatCurrency,
  calculateInterest,
  calculateFees,
  calculateMonthlyPayment
} from '@/lib/loan-calculator'

describe('Error Handling and Validation', () => {
  describe('Input Validation', () => {
    describe('validateLoanAmount', () => {
      it('should validate loan amount within acceptable range', () => {
        expect(validateLoanAmount(500).is_valid).toBe(true)
        expect(validateLoanAmount(5000).is_valid).toBe(true)
        expect(validateLoanAmount(10000).is_valid).toBe(true)
      })

      it('should reject amounts below minimum', () => {
        const result = validateLoanAmount(100)
        expect(result.is_valid).toBe(false)
        expect(result.error).toContain('at least')
        expect(result.corrected_amount).toBe(500)
      })

      it('should reject amounts above maximum', () => {
        const result = validateLoanAmount(15000)
        expect(result.is_valid).toBe(false)
        expect(result.error).toContain('exceed')
        expect(result.corrected_amount).toBe(10000)
      })

      it('should handle edge cases', () => {
        expect(validateLoanAmount(0).is_valid).toBe(false)
        expect(validateLoanAmount(-100).is_valid).toBe(false)
      })

      it('should handle invalid input types', () => {
        const result = validateLoanAmount('invalid' as any)
        expect(result.is_valid).toBe(false)
        expect(result.error).toContain('valid number')
      })

      it('should handle NaN values', () => {
        const result = validateLoanAmount(NaN)
        expect(result.is_valid).toBe(false)
        expect(result.error).toContain('valid number')
      })
    })

    describe('validateLoanTerm', () => {
      it('should validate loan term within acceptable range', () => {
        expect(validateLoanTerm(1).is_valid).toBe(true)
        expect(validateLoanTerm(3).is_valid).toBe(true)
        expect(validateLoanTerm(5).is_valid).toBe(true)
      })

      it('should reject terms outside valid range', () => {
        expect(validateLoanTerm(0).is_valid).toBe(false)
        expect(validateLoanTerm(6).is_valid).toBe(false)
        expect(validateLoanTerm(-1).is_valid).toBe(false)
      })

      it('should correct term to valid range', () => {
        const result = validateLoanTerm(0)
        expect(result.corrected_term).toBe(1)
        
        const result2 = validateLoanTerm(10)
        expect(result2.corrected_term).toBe(5)
      })

      it('should handle decimal terms', () => {
        const result = validateLoanTerm(2.5)
        expect(result.is_valid).toBe(false)
        expect(result.error).toContain('whole number')
      })

      it('should handle invalid input types', () => {
        const result = validateLoanTerm('invalid' as any)
        expect(result.is_valid).toBe(false)
        expect(result.error).toContain('valid number')
      })
    })

    describe('validateSalaryCompliance', () => {
      it('should validate 1/3 salary rule correctly', () => {
        const monthlySalary = 15000
        const testCases = [
          { loan_amount: 5000, is_compliant: true },
          { loan_amount: 5001, is_compliant: false },
          { loan_amount: 4000, is_compliant: true },
        ]
        
        testCases.forEach(testCase => {
          const result = validateSalaryCompliance(testCase.loan_amount, monthlySalary)
          expect(result.is_compliant).toBe(testCase.is_compliant)
        })
      })

      it('should calculate maximum loan amount correctly', () => {
        const monthlySalary = 15000
        const result = validateSalaryCompliance(5000, monthlySalary)
        expect(result.max_loan_amount).toBe(5000) // 1/3 of 15000
      })

      it('should handle edge cases for salary compliance', () => {
        // Test with very low salary
        const lowSalary = 3000
        const result = validateSalaryCompliance(1000, lowSalary)
        expect(result.is_compliant).toBe(true)
        expect(result.max_loan_amount).toBe(1000)
      })

      it('should calculate compliance percentage correctly', () => {
        const monthlySalary = 15000
        const loanAmount = 4000
        const result = validateSalaryCompliance(loanAmount, monthlySalary)
        
        const expectedPercentage = (loanAmount / monthlySalary) * 100
        expect(result.compliance_percentage).toBeCloseTo(expectedPercentage, 2)
      })

      it('should handle invalid inputs', () => {
        expect(() => validateSalaryCompliance('invalid' as any, 15000)).toThrow()
        expect(() => validateSalaryCompliance(5000, 'invalid' as any)).toThrow()
        expect(() => validateSalaryCompliance(-1000, 15000)).toThrow()
        expect(() => validateSalaryCompliance(5000, 0)).toThrow()
      })
    })
  })

  describe('Financial Calculation Error Handling', () => {
    describe('calculateInterest', () => {
      it('should handle invalid input types', () => {
        expect(() => calculateInterest('invalid' as any)).toThrow('Loan amount must be a valid number')
        expect(() => calculateInterest(null as any)).toThrow('Loan amount must be a valid number')
        expect(() => calculateInterest(undefined as any)).toThrow('Loan amount must be a valid number')
      })

      it('should handle negative amounts', () => {
        expect(() => calculateInterest(-1000)).toThrow('Loan amount cannot be negative')
      })

      it('should handle NaN values', () => {
        expect(() => calculateInterest(NaN)).toThrow('Loan amount must be a valid number')
      })

      it('should handle extreme values', () => {
        // Very large numbers
        expect(() => calculateInterest(Number.MAX_SAFE_INTEGER)).not.toThrow()
        
        // Very small numbers
        expect(() => calculateInterest(0.01)).not.toThrow()
      })
    })

    describe('calculateFees', () => {
      it('should handle invalid input types', () => {
        expect(() => calculateFees('invalid' as any)).toThrow('Loan amount must be a valid number')
        expect(() => calculateFees(null as any)).toThrow('Loan amount must be a valid number')
      })

      it('should handle negative amounts', () => {
        expect(() => calculateFees(-1000)).toThrow('Loan amount cannot be negative')
      })

      it('should handle zero amounts', () => {
        const fees = calculateFees(0)
        expect(fees.processing_fee).toBe(20) // Minimum processing fee
        expect(fees.namfisa_levy).toBe(0)
        expect(fees.stamp_duty).toBe(15)
      })
    })

    describe('calculateMonthlyPayment', () => {
      it('should handle invalid input types', () => {
        expect(() => calculateMonthlyPayment('invalid' as any, 3)).toThrow('Total payable must be a valid number')
        expect(() => calculateMonthlyPayment(1000, 'invalid' as any)).toThrow('Term months must be a valid number')
      })

      it('should handle negative values', () => {
        expect(() => calculateMonthlyPayment(-1000, 3)).toThrow('Total payable cannot be negative')
        expect(() => calculateMonthlyPayment(1000, -3)).toThrow('Term months must be greater than 0')
      })

      it('should handle zero term months', () => {
        expect(() => calculateMonthlyPayment(1000, 0)).toThrow('Term months must be greater than 0')
      })

      it('should handle decimal results correctly', () => {
        const payment = calculateMonthlyPayment(7000, 3)
        expect(payment).toBeCloseTo(2333.33, 2)
      })
    })
  })

  describe('Currency Formatting Error Handling', () => {
    describe('formatCurrency', () => {
      it('should handle invalid input types', () => {
        expect(formatCurrency('invalid' as any)).toBe('N$0')
        expect(formatCurrency(null as any)).toBe('N$0')
        expect(formatCurrency(undefined as any)).toBe('N$0')
      })

      it('should handle NaN values', () => {
        expect(formatCurrency(NaN)).toBe('N$0')
      })

      it('should handle Infinity values', () => {
        expect(formatCurrency(Infinity)).toBe('N$∞')
        expect(formatCurrency(-Infinity)).toBe('N$-∞')
      })

      it('should handle zero and negative amounts', () => {
        expect(formatCurrency(0)).toBe('N$0')
        expect(formatCurrency(-100)).toBe('N$-100')
      })

      it('should handle decimal amounts correctly', () => {
        expect(formatCurrency(1234.56)).toBe('N$1,234.56')
        expect(formatCurrency(2500.50)).toBe('N$2,500.5')
      })

      it('should handle large amounts correctly', () => {
        expect(formatCurrency(100000)).toBe('N$100,000')
        expect(formatCurrency(1000000)).toBe('N$1,000,000')
      })
    })
  })

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle minimum loan amount calculations', () => {
      const fees = calculateFees(500) // Minimum loan amount
      expect(fees.processing_fee).toBe(20) // Minimum processing fee
      expect(fees.namfisa_levy).toBe(20) // 4% of 500
      expect(fees.stamp_duty).toBe(15)
      expect(fees.total_fees).toBe(55)
    })

    it('should handle maximum loan amount calculations', () => {
      const fees = calculateFees(10000) // Maximum loan amount
      expect(fees.processing_fee).toBe(100) // Maximum processing fee
      expect(fees.namfisa_levy).toBe(400) // 4% of 10000
      expect(fees.stamp_duty).toBe(15)
      expect(fees.total_fees).toBe(515)
    })

    it('should handle 1-month loan term', () => {
      const payment = calculateMonthlyPayment(2400, 1)
      expect(payment).toBe(2400)
    })

    it('should handle 5-month loan term', () => {
      const payment = calculateMonthlyPayment(12000, 5)
      expect(payment).toBe(2400)
    })

    it('should handle salary compliance at exact 1/3 threshold', () => {
      const monthlySalary = 15000
      const loanAmount = 5000 // Exactly 1/3
      const result = validateSalaryCompliance(loanAmount, monthlySalary)
      expect(result.is_compliant).toBe(true)
      expect(result.compliance_percentage).toBeCloseTo(33.33, 2)
    })

    it('should handle salary compliance just over 1/3 threshold', () => {
      const monthlySalary = 15000
      const loanAmount = 5001 // Just over 1/3
      const result = validateSalaryCompliance(loanAmount, monthlySalary)
      expect(result.is_compliant).toBe(false)
      expect(result.compliance_percentage).toBeCloseTo(33.34, 2)
    })
  })

  describe('Performance and Resource Limits', () => {
    it('should handle rapid successive calculations efficiently', () => {
      const startTime = Date.now()
      
      for (let i = 0; i < 1000; i++) {
        calculateInterest(1000 + i)
        calculateFees(1000 + i)
        validateLoanAmount(1000 + i)
      }
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      // Should complete within reasonable time (less than 1 second)
      expect(duration).toBeLessThan(1000)
    })

    it('should handle large numbers without overflow', () => {
      const largeAmount = Number.MAX_SAFE_INTEGER / 1000
      const interest = calculateInterest(largeAmount)
      const fees = calculateFees(largeAmount)
      
      expect(interest).toBeGreaterThan(0)
      expect(fees.total_fees).toBeGreaterThan(0)
      expect(Number.isFinite(interest)).toBe(true)
      expect(Number.isFinite(fees.total_fees)).toBe(true)
    })
  })
})
