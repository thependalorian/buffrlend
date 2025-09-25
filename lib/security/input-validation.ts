/**
 * Input Validation and Sanitization for BuffrLend
 * Comprehensive input validation and sanitization utilities
 */

import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// Common validation schemas
export const commonSchemas = {
  // UUID validation
  uuid: z.string().uuid('Invalid UUID format'),
  
  // Email validation
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  
  // Phone number validation (Namibian format)
  phone: z.string().regex(/^(\+264|264|0)[0-9]{9}$/, 'Invalid Namibian phone number'),
  
  // Currency validation (NAD)
  currency: z.number().positive('Amount must be positive').max(1000000, 'Amount too large'),
  
  // Date validation
  date: z.string().datetime('Invalid date format'),
  
  // File validation
  file: z.object({
    name: z.string().min(1, 'File name required'),
    size: z.number().positive('File size must be positive').max(10 * 1024 * 1024, 'File too large'),
    type: z.string().min(1, 'File type required'),
  }),
  
  // Pagination validation
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
  }),
  
  // Search validation
  search: z.object({
    query: z.string().min(1, 'Search query required').max(100, 'Query too long'),
    filters: z.record(z.string(), z.unknown()).optional(),
  }),
};

// Document-specific schemas
export const documentSchemas = {
  upload: z.object({
    userId: z.string().uuid('Invalid user ID'),
    loanApplicationId: z.string().uuid('Invalid loan application ID').optional(),
    documentType: z.enum([
      'national_id',
      'passport',
      'drivers_license',
      'payslip',
      'bank_statement',
      'employment_letter',
      'loan_agreement'
    ]),
  }),
  
  verification: z.object({
    documentId: z.string().uuid('Invalid document ID'),
    action: z.enum(['verify', 'reject']),
    reason: z.string().min(1, 'Reason required').max(500, 'Reason too long').optional(),
    adminNotes: z.string().max(1000, 'Admin notes too long').optional(),
  }),
};

// Email-specific schemas
export const emailSchemas = {
  send: z.object({
    to: z.string().email('Invalid recipient email'),
    subject: z.string().min(1, 'Subject required').max(200, 'Subject too long'),
    content: z.string().min(1, 'Content required').max(10000, 'Content too long'),
    templateName: z.string().optional(),
    parameters: z.record(z.string(), z.unknown()).optional(),
  }),
  
  preferences: z.object({
    userId: z.string().uuid('Invalid user ID'),
    emailNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    marketingEmails: z.boolean(),
    frequency: z.enum(['immediate', 'daily', 'weekly', 'monthly']),
  }),
};

// WhatsApp-specific schemas
export const whatsappSchemas = {
  send: z.object({
    to: z.string().regex(/^(\+264|264|0)[0-9]{9}$/, 'Invalid Namibian phone number'),
    message: z.string().min(1, 'Message required').max(1000, 'Message too long').optional(),
    templateName: z.string().min(1, 'Template name required').optional(),
    parameters: z.record(z.string(), z.unknown()).optional(),
    customerId: z.string().uuid('Invalid customer ID').optional(),
    loanId: z.string().uuid('Invalid loan ID').optional(),
  }),
};

// Loan-specific schemas
export const loanSchemas = {
  application: z.object({
    loan_amount: z.number().positive('Loan amount must be positive').max(1000000, 'Loan amount too large'),
    loan_purpose: z.string().min(1, 'Loan purpose required').max(500, 'Purpose too long'),
    business_plan: z.string().max(5000, 'Business plan too long').optional(),
    financial_documents: z.array(z.string()).optional(),
  }),
  
  agreement: z.object({
    loanApplicationId: z.string().uuid('Invalid loan application ID'),
    loanData: z.object({
      borrower_name: z.string().min(1, 'Borrower name required'),
      loan_amount: z.number().positive('Loan amount must be positive'),
      interest_rate: z.number().positive('Interest rate must be positive'),
      term_months: z.number().int().positive('Term must be positive'),
      purpose: z.string().min(1, 'Purpose required'),
    }),
  }),
};

// Admin-specific schemas
export const adminSchemas = {
  manualEmail: z.object({
    action: z.enum(['submit_request', 'approve_request', 'reject_request', 'send_immediate', 'cancel_request']),
    adminId: z.string().uuid('Invalid admin ID'),
    adminName: z.string().min(1, 'Admin name required'),
    emailType: z.string().min(1, 'Email type required').optional(),
    recipients: z.array(z.string().email()).optional(),
    subject: z.string().min(1, 'Subject required').max(200, 'Subject too long').optional(),
    content: z.string().min(1, 'Content required').max(10000, 'Content too long').optional(),
    scheduledFor: z.string().datetime().optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
    reason: z.string().min(1, 'Reason required').max(500, 'Reason too long').optional(),
    requestId: z.string().uuid('Invalid request ID').optional(),
    approverId: z.string().uuid('Invalid approver ID').optional(),
    approverName: z.string().min(1, 'Approver name required').optional(),
    rejectionReason: z.string().min(1, 'Rejection reason required').max(500, 'Reason too long').optional(),
  }),
};

// Input validation middleware
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (request: NextRequest, ...args: any[]) {
      try {
        // Get request body
        const body = await request.json();
        
        // Validate input
        const validatedData = schema.parse(body);
        
        // Replace request body with validated data
        const newRequest = new NextRequest(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(validatedData),
        });
        
        return originalMethod.apply(this, [newRequest, ...args]);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return new NextResponse(
            JSON.stringify({
              error: 'Validation failed',
              details: error.issues.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code,
              })),
            }),
            { status: 400 }
          );
        }
        
        throw error;
      }
    };
    
    return descriptor;
  };
}

// Query parameter validation
export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (request: NextRequest, ...args: any[]) {
      try {
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const queryParams: Record<string, any> = {};
        
        for (const [key, value] of searchParams.entries()) {
          queryParams[key] = value;
        }
        
        // Validate query parameters
        const validatedParams = schema.parse(queryParams);
        
        // Add validated params to request
        (request as any).validatedQuery = validatedParams;
        
        return originalMethod.apply(this, [request, ...args]);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return new NextResponse(
            JSON.stringify({
              error: 'Query validation failed',
              details: error.issues.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code,
              })),
            }),
            { status: 400 }
          );
        }
        
        throw error;
      }
    };
    
    return descriptor;
  };
}

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}

export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

// Export all schemas
export const schemas = {
  common: commonSchemas,
  document: documentSchemas,
  email: emailSchemas,
  whatsapp: whatsappSchemas,
  loan: loanSchemas,
  admin: adminSchemas,
};
