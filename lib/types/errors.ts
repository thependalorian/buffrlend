/**
 * Common Error Types for BuffrLend
 * 
 * Standardized error types for consistent error handling across the application
 */

export interface BuffrError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface ApiError extends BuffrError {
  statusCode: number;
  path?: string;
  method?: string;
}

export interface ValidationError extends BuffrError {
  field: string;
  value: unknown;
  constraint?: string;
}

export interface DatabaseError extends BuffrError {
  table?: string;
  operation?: string;
  constraint?: string;
}

export interface EmailError extends BuffrError {
  provider?: string;
  recipient?: string;
  template?: string;
}

export interface AuthenticationError extends BuffrError {
  userId?: string;
  tokenType?: string;
  reason?: string;
}

export interface AuthorizationError extends BuffrError {
  userId?: string;
  resource?: string;
  action?: string;
  requiredRole?: string;
  requiredPermissions?: string[];
}

// Error factory functions
export function createApiError(
  message: string,
  statusCode: number = 500,
  code: string = 'INTERNAL_ERROR',
  details?: Record<string, unknown>
): ApiError {
  return {
    code,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    details,
  };
}

export function createValidationError(
  field: string,
  value: unknown,
  message: string,
  constraint?: string
): ValidationError {
  return {
    code: 'VALIDATION_ERROR',
    message,
    field,
    value,
    constraint,
    timestamp: new Date().toISOString(),
  };
}

export function createDatabaseError(
  message: string,
  table?: string,
  operation?: string,
  constraint?: string
): DatabaseError {
  return {
    code: 'DATABASE_ERROR',
    message,
    table,
    operation,
    constraint,
    timestamp: new Date().toISOString(),
  };
}

export function createEmailError(
  message: string,
  provider?: string,
  recipient?: string,
  template?: string
): EmailError {
  return {
    code: 'EMAIL_ERROR',
    message,
    provider,
    recipient,
    template,
    timestamp: new Date().toISOString(),
  };
}

export function createAuthenticationError(
  message: string,
  userId?: string,
  tokenType?: string,
  reason?: string
): AuthenticationError {
  return {
    code: 'AUTHENTICATION_ERROR',
    message,
    userId,
    tokenType,
    reason,
    timestamp: new Date().toISOString(),
  };
}

export function createAuthorizationError(
  message: string,
  userId?: string,
  resource?: string,
  action?: string,
  requiredRole?: string,
  requiredPermissions?: string[]
): AuthorizationError {
  return {
    code: 'AUTHORIZATION_ERROR',
    message,
    userId,
    resource,
    action,
    requiredRole,
    requiredPermissions,
    timestamp: new Date().toISOString(),
  };
}

// Error type guards
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'statusCode' in error &&
    typeof (error as ApiError).statusCode === 'number'
  );
}

export function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'field' in error &&
    (error as ValidationError).code === 'VALIDATION_ERROR'
  );
}

export function isDatabaseError(error: unknown): error is DatabaseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as DatabaseError).code === 'DATABASE_ERROR'
  );
}

export function isEmailError(error: unknown): error is EmailError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as EmailError).code === 'EMAIL_ERROR'
  );
}

export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as AuthenticationError).code === 'AUTHENTICATION_ERROR'
  );
}

export function isAuthorizationError(error: unknown): error is AuthorizationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as AuthorizationError).code === 'AUTHORIZATION_ERROR'
  );
}

// Common error codes
export const ERROR_CODES = {
  // General errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  FOREIGN_KEY_VIOLATION: 'FOREIGN_KEY_VIOLATION',
  
  // Authentication errors
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  
  // Authorization errors
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ROLE_REQUIRED: 'ROLE_REQUIRED',
  
  // Email errors
  EMAIL_ERROR: 'EMAIL_ERROR',
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  EMAIL_TEMPLATE_NOT_FOUND: 'EMAIL_TEMPLATE_NOT_FOUND',
  EMAIL_PROVIDER_ERROR: 'EMAIL_PROVIDER_ERROR',
  
  // File errors
  FILE_ERROR: 'FILE_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  
  // Business logic errors
  LOAN_ERROR: 'LOAN_ERROR',
  INSUFFICIENT_CREDIT: 'INSUFFICIENT_CREDIT',
  LOAN_ALREADY_APPROVED: 'LOAN_ALREADY_APPROVED',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
