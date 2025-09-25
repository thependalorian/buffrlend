/**
 * Data Validation Schemas for BuffrLend
 * Inspired by Pydantic patterns and data science best practices
 * 
 * This module provides comprehensive validation schemas for all data types
 * in the BuffrLend system, ensuring type safety and data integrity.
 */

import { z } from 'zod';

// ============================================================================
// BASE VALIDATION PATTERNS
// ============================================================================

/**
 * Common validation patterns used across the application
 */
export const CommonPatterns = {
  // Namibian ID number pattern (11 digits)
  namibianId: z.string().regex(/^\d{11}$/, 'Namibian ID must be 11 digits'),
  
  // Phone number pattern (Namibian format)
  phoneNumber: z.string().regex(/^(\+264|0)[0-9]{9}$/, 'Invalid Namibian phone number'),
  
  // Email validation
  email: z.string().email('Invalid email format'),
  
  // Currency amount (positive decimal with 2 decimal places)
  currency: z.number().positive('Amount must be positive').multipleOf(0.01, 'Amount must have at most 2 decimal places'),
  
  // Percentage (0-100)
  percentage: z.number().min(0, 'Percentage must be at least 0').max(100, 'Percentage must be at most 100'),
  
  // UUID validation
  uuid: z.string().uuid('Invalid UUID format'),
  
  // Date string (ISO format)
  dateString: z.string().datetime('Invalid date format'),
  
  // Company registration number (Namibian format)
  companyRegNumber: z.string().regex(/^[A-Z]{2,3}\d{4,6}$/, 'Invalid company registration number'),
} as const;

// ============================================================================
// USER & PROFILE VALIDATION
// ============================================================================

/**
 * User profile validation schema
 * Based on data science principles for customer segmentation
 */
export const UserProfileSchema = z.object({
  id: CommonPatterns.uuid,
  first_name: z.string().min(1, 'First name is required').max(255),
  last_name: z.string().min(1, 'Last name is required').max(255),
  email: CommonPatterns.email,
  phone: CommonPatterns.phoneNumber.optional(),
  id_number: CommonPatterns.namibianId.optional(),
  company_name: z.string().max(255).optional(),
  position: z.string().max(255).optional(),
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
});

/**
 * Admin profile validation with role-based access
 */
export const AdminProfileSchema = z.object({
  id: CommonPatterns.uuid,
  first_name: z.string().min(1, 'First name is required').max(255),
  last_name: z.string().min(1, 'Last name is required').max(255),
  email: CommonPatterns.email,
  role: z.enum(['super_admin', 'admin', 'analyst', 'support']),
  permissions: z.record(z.string(), z.unknown()).optional(),
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
});

// ============================================================================
// LOAN APPLICATION VALIDATION
// ============================================================================

/**
 * Loan application validation schema
 * Implements financial data validation patterns from data science best practices
 */
export const LoanApplicationSchema = z.object({
  id: CommonPatterns.uuid,
  application_id: z.string().min(1, 'Application ID is required'),
  user_id: CommonPatterns.uuid,
  company_id: CommonPatterns.uuid,
  loan_amount: CommonPatterns.currency,
  loan_term: z.number().int().min(1, 'Loan term must be at least 1 month').max(60, 'Loan term cannot exceed 60 months'),
  loan_term_months: z.number().int().positive().optional(),
  loan_purpose: z.string().max(500).optional(),
  
  // Financial data validation
  monthly_income: CommonPatterns.currency.optional(),
  monthly_expenses: CommonPatterns.currency.optional(),
  net_income: CommonPatterns.currency.optional(),
  net_income_from_payslip: CommonPatterns.currency.optional(),
  monthly_payment: CommonPatterns.currency.optional(),
  
  // Interest and fees
  interest_rate: CommonPatterns.percentage.optional(),
  total_repayment: CommonPatterns.currency.optional(),
  total_interest: CommonPatterns.currency.optional(),
  total_fees: CommonPatterns.currency.optional(),
  total_payable: CommonPatterns.currency.optional(),
  remaining_balance: CommonPatterns.currency.optional(),
  
  // Status and metadata
  status: z.enum(['pending', 'under_review', 'approved', 'rejected', 'funded', 'active', 'completed', 'defaulted']),
  currency: z.string().length(3, 'Currency must be 3 characters').default('NAD'),
  
  // Timestamps
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
  approved_at: CommonPatterns.dateString.optional(),
  funded_at: CommonPatterns.dateString.optional(),
  completed_at: CommonPatterns.dateString.optional(),
  
  // Risk assessment
  risk_category: z.enum(['low', 'medium', 'high']).optional(),
  affordability_score: CommonPatterns.percentage.optional(),
  dti_ratio: CommonPatterns.percentage.optional(),
  namfisa_compliant: z.boolean().optional(),
  
  // Employment and payroll data (Partner Company Employee)
  employment_info: z.object({
    company_name: z.string(),
    position: z.string(),
    employment_type: z.literal('permanent'), // Only permanent employees
    partner_company_id: z.string(), // Required partner company
    salary_deduction_eligible: z.boolean(), // Must be true
    tenure_months: z.number().min(0),
  }).optional(),
  fee_breakdown: z.record(z.string(), z.unknown()).optional(),
  payroll_deduction_amount: CommonPatterns.currency.optional(),
  payroll_deduction_start_date: CommonPatterns.dateString.optional(),
  
  // Verification status
  payslip_verified: z.boolean().optional(),
  payslip_verification_date: CommonPatterns.dateString.optional(),
  payslip_verification_notes: z.string().max(1000).optional(),
  
  // Fee calculations
  collection_fee: CommonPatterns.currency.optional(),
  disbursement_fee: CommonPatterns.currency.optional(),
  stamp_duty: CommonPatterns.currency.optional(),
  namfisa_levy: CommonPatterns.currency.optional(),
  bond_payment_amount: CommonPatterns.currency.optional(),
  coupon_payment_amount: CommonPatterns.currency.optional(),
  competitive_rate: CommonPatterns.percentage.optional(),
  
  // Loan limits
  max_loan_amount: CommonPatterns.currency.optional(),
  max_loan_term: z.number().int().positive().optional(),
  min_loan_amount: CommonPatterns.currency.optional(),
});

// ============================================================================
// CRM VALIDATION SCHEMAS
// ============================================================================

/**
 * Contact validation schema
 * Supports multiple contact types for comprehensive relationship management
 */
export const ContactSchema = z.object({
  id: CommonPatterns.uuid,
  type: z.enum(['individual', 'employer', 'partner', 'referral']),
  first_name: z.string().min(1, 'First name is required').max(255),
  last_name: z.string().min(1, 'Last name is required').max(255),
  company_name: z.string().max(255).optional(),
  position: z.string().max(255).optional(),
  email: CommonPatterns.email.optional(),
  phone: CommonPatterns.phoneNumber.optional(),
  mobile: CommonPatterns.phoneNumber.optional(),
  address: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
  relationship_stage: z.enum(['prospect', 'lead', 'customer', 'partner', 'inactive']).optional(),
  last_contact_date: CommonPatterns.dateString.optional(),
  next_follow_up: CommonPatterns.dateString.optional(),
  assigned_to: CommonPatterns.uuid.optional(),
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
});

/**
 * Contact interaction validation schema
 */
export const ContactInteractionSchema = z.object({
  id: CommonPatterns.uuid,
  contact_id: CommonPatterns.uuid.optional(),
  interaction_type: z.enum(['call', 'email', 'meeting', 'whatsapp', 'sms', 'note']),
  subject: z.string().max(255).optional(),
  description: z.string().max(2000).optional(),
  outcome: z.string().max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
  scheduled_date: CommonPatterns.dateString.optional(),
  completed_date: CommonPatterns.dateString.optional(),
  assigned_to: CommonPatterns.uuid.optional(),
  related_to: CommonPatterns.uuid.optional(),
  related_type: z.string().max(100).optional(),
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
});

/**
 * Sales pipeline validation schema
 */
export const SalesPipelineSchema = z.object({
  id: CommonPatterns.uuid,
  name: z.string().min(1, 'Pipeline name is required').max(255),
  description: z.string().max(1000).optional(),
  stages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    order: z.number().int().positive(),
    probability: CommonPatterns.percentage,
    color: z.string().optional(),
  })),
  is_active: z.boolean().default(true),
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
});

/**
 * Deal validation schema
 */
export const DealSchema = z.object({
  id: CommonPatterns.uuid,
  name: z.string().min(1, 'Deal name is required').max(255),
  contact_id: CommonPatterns.uuid.optional(),
  pipeline_id: CommonPatterns.uuid.optional(),
  stage: z.string().min(1, 'Stage is required'),
  value: CommonPatterns.currency.optional(),
  probability: CommonPatterns.percentage.optional(),
  expected_close_date: CommonPatterns.dateString.optional(),
  actual_close_date: CommonPatterns.dateString.optional(),
  loss_reason: z.string().max(500).optional(),
  assigned_to: CommonPatterns.uuid.optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
});

// ============================================================================
// TEAM & PROJECT VALIDATION
// ============================================================================

/**
 * Team validation schema
 */
export const TeamSchema = z.object({
  id: CommonPatterns.uuid,
  name: z.string().min(1, 'Team name is required').max(255),
  description: z.string().max(1000).optional(),
  manager_id: CommonPatterns.uuid.optional(),
  is_active: z.boolean().default(true),
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
});

/**
 * Project validation schema
 */
export const ProjectSchema = z.object({
  id: CommonPatterns.uuid,
  name: z.string().min(1, 'Project name is required').max(255),
  description: z.string().max(2000).optional(),
  status: z.enum(['planned', 'active', 'paused', 'completed', 'cancelled']).default('planned'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  start_date: CommonPatterns.dateString.optional(),
  end_date: CommonPatterns.dateString.optional(),
  actual_end_date: CommonPatterns.dateString.optional(),
  budget: CommonPatterns.currency.optional(),
  actual_cost: CommonPatterns.currency.optional(),
  team_id: CommonPatterns.uuid.optional(),
  parent_project_id: CommonPatterns.uuid.optional(),
  tags: z.array(z.string()).optional(),
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
});

/**
 * Task validation schema
 */
export const TaskSchema = z.object({
  id: CommonPatterns.uuid,
  title: z.string().min(1, 'Task title is required').max(255),
  description: z.string().max(2000).optional(),
  status: z.enum(['todo', 'doing', 'review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignee_id: CommonPatterns.uuid.optional(),
  reporter_id: CommonPatterns.uuid.optional(),
  project_id: CommonPatterns.uuid.optional(),
  due_date: CommonPatterns.dateString.optional(),
  completed_date: CommonPatterns.dateString.optional(),
  estimated_hours: z.number().positive().optional(),
  actual_hours: z.number().positive().optional(),
  dependencies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
});

// ============================================================================
// FINANCIAL VALIDATION SCHEMAS
// ============================================================================

/**
 * Invoice validation schema
 */
export const InvoiceSchema = z.object({
  id: CommonPatterns.uuid,
  invoice_number: z.string().min(1, 'Invoice number is required').max(255),
  contact_id: CommonPatterns.uuid.optional(),
  issue_date: CommonPatterns.dateString,
  due_date: CommonPatterns.dateString,
  status: z.enum(['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled']).default('draft'),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unit_price: CommonPatterns.currency,
    tax_rate: CommonPatterns.percentage.optional(),
    total: CommonPatterns.currency,
  })),
  subtotal: CommonPatterns.currency.optional(),
  tax_amount: CommonPatterns.currency.optional(),
  total_amount: CommonPatterns.currency.optional(),
  currency: z.string().length(3).default('NAD'),
  notes: z.string().max(1000).optional(),
  payment_terms: z.string().max(500).optional(),
  paid_date: CommonPatterns.dateString.optional(),
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
});

/**
 * Payment validation schema
 */
export const PaymentSchema = z.object({
  id: CommonPatterns.uuid,
  invoice_id: CommonPatterns.uuid.optional(),
  amount: CommonPatterns.currency,
  payment_date: CommonPatterns.dateString,
  payment_method: z.enum(['bank_transfer', 'credit_card', 'debit_card', 'cash', 'mobile_money', 'salary_deduction']).optional(),
  reference_number: z.string().max(255).optional(),
  notes: z.string().max(1000).optional(),
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
});

// ============================================================================
// PARTNER COMPANY VALIDATION
// ============================================================================

/**
 * Partner company validation schema
 * Comprehensive validation for B2B2C business model
 */
export const PartnerCompanySchema = z.object({
  id: CommonPatterns.uuid,
  company_name: z.string().min(1, 'Company name is required').max(255),
  company_registration_number: CommonPatterns.companyRegNumber.optional(),
  industry_sector: z.string().max(100).optional(),
  company_size: z.enum(['micro', 'small', 'medium', 'large', 'enterprise']).optional(),
  total_employees: z.number().int().positive().optional(),
  
  // Address information
  street_address: z.string().min(1, 'Street address is required').max(500),
  city: z.string().min(1, 'City is required').max(100),
  state_province: z.string().min(1, 'State/Province is required').max(100),
  postal_code: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().length(2).default('NA'),
  
  // Contact information
  primary_contact_name: z.string().min(1, 'Primary contact name is required').max(255),
  primary_contact_email: CommonPatterns.email,
  primary_contact_phone: CommonPatterns.phoneNumber.optional(),
  secondary_contact_name: z.string().max(255).optional(),
  secondary_contact_email: CommonPatterns.email.optional(),
  
  // Digital presence
  website_url: z.string().url().optional(),
  linkedin_url: z.string().url().optional(),
  logo_url: z.string().url().optional(),
  description: z.string().max(2000).optional(),
  
  // Partnership details
  partnership_status: z.enum(['pending', 'active', 'suspended', 'terminated']).default('pending'),
  partnership_tier: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
  partnership_date: CommonPatterns.dateString.optional(),
  agreement_signed_date: CommonPatterns.dateString.optional(),
  agreement_expiry_date: CommonPatterns.dateString.optional(),
  agreement_document_path: z.string().max(500).optional(),
  
  // Status and compliance
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  featured: z.boolean().default(false),
  namfisa_approved: z.boolean().default(false),
  compliance_status: z.enum(['compliant', 'non_compliant', 'under_review']).optional(),
  last_audit_date: CommonPatterns.dateString.optional(),
  next_audit_date: CommonPatterns.dateString.optional(),
  admin_notes: z.string().max(2000).optional(),
  
  // Financial parameters
  category: z.string().max(100).optional(),
  credit_limit: CommonPatterns.currency.optional(),
  current_exposure: CommonPatterns.currency.optional(),
  default_rate: CommonPatterns.percentage.optional(),
  commission_rate: CommonPatterns.percentage.optional(),
  interest_rate_override: CommonPatterns.percentage.optional(),
  
  // Loan parameters
  max_loan_amount: CommonPatterns.currency.optional(),
  max_loan_term_months: z.number().int().positive().optional(),
  minimum_monthly_salary: CommonPatterns.currency.optional(),
  minimum_tenure_months: z.number().int().positive().optional(),
  
  // Employment filters
  eligible_departments: z.array(z.string()).optional(),
  excluded_job_titles: z.array(z.string()).optional(),
  
  // Payroll information
  payroll_frequency: z.enum(['weekly', 'bi_weekly', 'monthly', 'quarterly']).optional(),
  payroll_system: z.string().max(100).optional(),
  next_payroll_date: CommonPatterns.dateString.optional(),
  
  // Performance metrics
  active_borrowers: z.number().int().min(0).optional(),
  total_loans_disbursed: CommonPatterns.currency.optional(),
  
  // Timestamps
  created_at: CommonPatterns.dateString,
  updated_at: CommonPatterns.dateString,
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type UserProfile = z.infer<typeof UserProfileSchema>;
export type AdminProfile = z.infer<typeof AdminProfileSchema>;
export type LoanApplication = z.infer<typeof LoanApplicationSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type ContactInteraction = z.infer<typeof ContactInteractionSchema>;
export type SalesPipeline = z.infer<typeof SalesPipelineSchema>;
export type Deal = z.infer<typeof DealSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type PartnerCompany = z.infer<typeof PartnerCompanySchema>;

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validation result type for error handling
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
}

/**
 * Validates data against a schema and returns a structured result
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error,
      };
    }
    throw error;
  }
}

/**
 * Safe validation that doesn't throw errors
 */
export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    return {
      success: false,
      errors: result.error,
    };
  }
}

/**
 * Partial validation for update operations
 */
export function validatePartial<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<Partial<T>> {
  try {
    const validatedData = (schema as z.ZodObject<z.ZodRawShape>).partial().parse(data);
    return {
      success: true,
      data: validatedData as Partial<T>,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error,
      };
    }
    throw error;
  }
}
