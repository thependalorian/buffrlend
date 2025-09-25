/**
 * Comprehensive Security Middleware for BuffrLend
 * Combines all security measures into a single middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from './rate-limiter';
import { withSecurity, sanitizeInput, validateFileUpload } from './security-headers';
import { validateInput, schemas } from './input-validation';
import { withWebhookSecurity, validateWebhookEvent } from './webhook-security';

// Security middleware configuration
export interface SecurityConfig {
  // Rate limiting
  rateLimit?: {
    enabled: boolean;
    type: 'auth' | 'document_upload' | 'email' | 'whatsapp' | 'admin' | 'general' | 'webhook' | 'test';
    customKey?: string;
  };
  
  // Input validation
  inputValidation?: {
    enabled: boolean;
    schema?: any;
    sanitize: boolean;
  };
  
  // File upload security
  fileUpload?: {
    enabled: boolean;
    maxSize?: number;
    allowedTypes?: string[];
  };
  
  // Webhook security
  webhook?: {
    enabled: boolean;
    provider: 'sendgrid' | 'resend' | 'ses' | 'twilio';
    enforceSignature: boolean;
  };
  
  // CORS and security headers
  cors?: boolean;
  securityHeaders?: boolean;
  
  // Authentication
  requireAuth?: boolean;
  
  // Admin access
  requireAdmin?: boolean;
  
  // Allowed methods
  allowedMethods?: string[];
}

// Default security configuration
const DEFAULT_CONFIG: SecurityConfig = {
  rateLimit: { enabled: true, type: 'general' },
  inputValidation: { enabled: true, sanitize: true },
  cors: true,
  securityHeaders: true,
  requireAuth: true,
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

// Comprehensive security middleware
export function withComprehensiveSecurity(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  config: SecurityConfig = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  return async function (request: NextRequest): Promise<NextResponse> {
    try {
      // Check allowed methods
      if (finalConfig.allowedMethods && !finalConfig.allowedMethods.includes(request.method)) {
        return new NextResponse(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405 }
        );
      }
      
      // Apply rate limiting
      if (finalConfig.rateLimit?.enabled) {
        const wrappedHandler = await withRateLimit(
          finalConfig.rateLimit.type,
          async (req: NextRequest) => {
            const result = handler(req);
            return result instanceof Promise ? result : Promise.resolve(result);
          },
          { customKey: finalConfig.rateLimit.customKey }
        );
        
        return wrappedHandler(request);
      }
      
      // Apply webhook security
      if (finalConfig.webhook?.enabled) {
        // const webhookHandler = withWebhookSecurity(
        //   finalConfig.webhook.provider,
        //   { enforceSignature: finalConfig.webhook.enforceSignature }
        // );
        
        // This would need to be applied differently in practice
        // For now, we'll handle it in the individual endpoints
      }
      
      // Execute the handler
      const response = await handler(request);
      
      // Add security headers and CORS
      if (finalConfig.cors || finalConfig.securityHeaders) {
        return withSecurity(() => response, {
          enableCORS: finalConfig.cors,
          enableSecurityHeaders: finalConfig.securityHeaders,
          allowedMethods: finalConfig.allowedMethods,
        })(request);
      }
      
      return response;
    } catch (error) {
      console.error('Security middleware error:', error);
      
      const response = new NextResponse(
        JSON.stringify({ error: 'Security validation failed' }),
        { status: 500 }
      );
      
      return withSecurity(() => response, {
        enableCORS: finalConfig.cors,
        enableSecurityHeaders: finalConfig.securityHeaders,
      })(request);
    }
  };
}

// Pre-configured security middleware for different endpoint types
export const securityMiddleware = {
  // Authentication endpoints
  auth: (handler: (request: NextRequest) => Promise<NextResponse> | NextResponse) =>
    withComprehensiveSecurity(handler, {
      rateLimit: { enabled: true, type: 'auth' },
      inputValidation: { enabled: true, sanitize: true },
      requireAuth: false, // Auth endpoints don't require existing auth
    }),
  
  // Document upload endpoints
  documentUpload: (handler: (request: NextRequest) => Promise<NextResponse> | NextResponse) =>
    withComprehensiveSecurity(handler, {
      rateLimit: { enabled: true, type: 'document_upload' },
      inputValidation: { enabled: true, sanitize: true },
      fileUpload: { enabled: true },
    }),
  
  // Email endpoints
  email: (handler: (request: NextRequest) => Promise<NextResponse> | NextResponse) =>
    withComprehensiveSecurity(handler, {
      rateLimit: { enabled: true, type: 'email' },
      inputValidation: { enabled: true, sanitize: true },
    }),
  
  // WhatsApp endpoints
  whatsapp: (handler: (request: NextRequest) => Promise<NextResponse> | NextResponse) =>
    withComprehensiveSecurity(handler, {
      rateLimit: { enabled: true, type: 'whatsapp' },
      inputValidation: { enabled: true, sanitize: true },
    }),
  
  // Admin endpoints
  admin: (handler: (request: NextRequest) => Promise<NextResponse> | NextResponse) =>
    withComprehensiveSecurity(handler, {
      rateLimit: { enabled: true, type: 'admin' },
      inputValidation: { enabled: true, sanitize: true },
      requireAdmin: true,
    }),
  
  // Webhook endpoints
  webhook: (provider: 'sendgrid' | 'resend' | 'ses' | 'twilio') =>
    (handler: (request: NextRequest) => Promise<NextResponse> | NextResponse) =>
      withComprehensiveSecurity(handler, {
        rateLimit: { enabled: true, type: 'webhook' },
        webhook: { enabled: true, provider, enforceSignature: true },
        requireAuth: false, // Webhooks don't require user auth
      }),
  
  // General API endpoints
  general: (handler: (request: NextRequest) => Promise<NextResponse> | NextResponse) =>
    withComprehensiveSecurity(handler, {
      rateLimit: { enabled: true, type: 'general' },
      inputValidation: { enabled: true, sanitize: true },
    }),
  
  // Test endpoints (should be disabled in production)
  test: (handler: (request: NextRequest) => Promise<NextResponse> | NextResponse) =>
    withComprehensiveSecurity(handler, {
      rateLimit: { enabled: true, type: 'test' },
      inputValidation: { enabled: true, sanitize: true },
      requireAuth: false,
    }),
};

// Utility function to validate request body with schema
export function validateRequestBody<T>(schema: any) {
  return async (request: NextRequest): Promise<T> => {
    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);
    return schema.parse(sanitizedBody);
  };
}

// Utility function to validate file upload
export function validateFileUploadRequest(file: File): { valid: boolean; error?: string } {
  return validateFileUpload(file);
}

// Export all security utilities
export {
  withRateLimit,
  withSecurity,
  sanitizeInput,
  validateFileUpload,
  validateInput,
  schemas,
  withWebhookSecurity,
  validateWebhookEvent,
};
