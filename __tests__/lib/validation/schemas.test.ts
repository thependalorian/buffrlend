
/**
 * Tests for data validation schemas
 */

import { z } from 'zod'
import {
  CommonPatterns,
  UserProfileSchema,
  LoanApplicationSchema,
  validateData,
  safeValidate,
  validatePartial,
} from '@/lib/validation/schemas'

describe('Data Validation Schemas', () => {
  // Test suite for CommonPatterns
  describe('CommonPatterns', () => {
    it('should validate Namibian ID correctly', () => {
      expect(CommonPatterns.namibianId.safeParse('12345678901').success).toBe(true)
      expect(CommonPatterns.namibianId.safeParse('12345').success).toBe(false)
    })

    it('should validate phone number correctly', () => {
      expect(CommonPatterns.phoneNumber.safeParse('+264812345678').success).toBe(true)
      expect(CommonPatterns.phoneNumber.safeParse('0812345678').success).toBe(true)
      expect(CommonPatterns.phoneNumber.safeParse('12345').success).toBe(false)
    })

    it('should validate email correctly', () => {
      expect(CommonPatterns.email.safeParse('test@example.com').success).toBe(true)
      expect(CommonPatterns.email.safeParse('invalid-email').success).toBe(false)
    })
  })

  // Test suite for UserProfileSchema
  describe('UserProfileSchema', () => {
    const validUserData = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+264812345678',
      id_number: '12345678901',
      company_name: 'Test Company',
      position: 'Manager',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    it('should validate a valid user profile', () => {
      const result = UserProfileSchema.safeParse(validUserData)
      if (!result.success) {
        console.log('User validation errors:', result.error.issues)
      }
      expect(result.success).toBe(true)
    })

    it('should invalidate a user profile with a missing required field', () => {
      const invalidData = { ...validUserData, first_name: '' }
      const result = UserProfileSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  // Test suite for LoanApplicationSchema
  describe('LoanApplicationSchema', () => {
    const validLoanData = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      application_id: 'APP-123',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      company_id: '550e8400-e29b-41d4-a716-446655440002',
      loan_amount: 5000.00,
      loan_term: 3,
      status: 'pending' as const,
      currency: 'NAD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    it('should validate a valid loan application', () => {
      const result = LoanApplicationSchema.safeParse(validLoanData)
      if (!result.success) {
        console.log('Loan validation errors:', result.error.issues)
      }
      expect(result.success).toBe(true)
    })

    it('should invalidate a loan application with an invalid loan amount', () => {
      const invalidData = { ...validLoanData, loan_amount: -100 }
      const result = LoanApplicationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  // Test suite for validation utilities
  describe('Validation Utilities', () => {
    const TestSchema = z.object({
      name: z.string().min(1),
      age: z.number().min(18),
    })

    describe('validateData', () => {
      it('should return success for valid data', () => {
        const result = validateData(TestSchema, { name: 'John', age: 30 })
        expect(result.success).toBe(true)
      })

      it('should return error for invalid data', () => {
        const result = validateData(TestSchema, { name: '', age: 17 })
        expect(result.success).toBe(false)
        expect(result.errors).toBeInstanceOf(z.ZodError)
      })
    })

    describe('safeValidate', () => {
      it('should return success for valid data', () => {
        const result = safeValidate(TestSchema, { name: 'John', age: 30 })
        expect(result.success).toBe(true)
      })

      it('should return error for invalid data without throwing', () => {
        const result = safeValidate(TestSchema, { name: '', age: 17 })
        expect(result.success).toBe(false)
        expect(result.errors).toBeInstanceOf(z.ZodError)
      })
    })

    describe('validatePartial', () => {
      it('should validate a partial object successfully', () => {
        const result = validatePartial(TestSchema, { name: 'John' })
        expect(result.success).toBe(true)
      })

      it('should return error for invalid partial data', () => {
        const result = validatePartial(TestSchema, { age: 17 })
        expect(result.success).toBe(false)
        expect(result.errors).toBeInstanceOf(z.ZodError)
      })
    })
  })
})
