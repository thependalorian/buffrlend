/**
 * Security Headers Middleware for BuffrLend
 * Implements comprehensive security headers for API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';

// Security headers configuration
const SECURITY_HEADERS = {
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Force HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts for Next.js
    "style-src 'self' 'unsafe-inline'", // Allow inline styles
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.supabase.com https://api.sendgrid.com https://api.twilio.com https://api.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()'
  ].join(', '),
  
  // Cross-Origin policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
} as const;

// CORS configuration
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS?.split(',')[0] || 'https://lend.buffr.ai',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // 24 hours
} as const;

// Security headers middleware
export function withSecurityHeaders(response: NextResponse): NextResponse {
  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add CORS headers
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add custom security headers
  response.headers.set('X-Powered-By', 'BuffrLend');
  response.headers.set('X-API-Version', '1.0.0');
  
  return response;
}

// CORS middleware
export function withCORS(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['https://lend.buffr.ai'];
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    
    // Add CORS headers
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    // Set specific origin if it's allowed
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    
    return withSecurityHeaders(response);
  }
  
  // Check origin for non-preflight requests
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(
      JSON.stringify({ error: 'CORS policy violation' }),
      { 
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
  
  return null; // Continue with request
}

// Security middleware wrapper
export function withSecurity(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  options: {
    enableCORS?: boolean;
    enableSecurityHeaders?: boolean;
    allowedMethods?: string[];
  } = {}
) {
  return async function (request: NextRequest): Promise<NextResponse> {
    const {
      enableCORS = true,
      enableSecurityHeaders = true,
      allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    } = options;
    
    // Check allowed methods
    if (!allowedMethods.includes(request.method)) {
      const response = new NextResponse(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405 }
      );
      return enableSecurityHeaders ? withSecurityHeaders(response) : response;
    }
    
    // Handle CORS
    if (enableCORS) {
      const corsResponse = withCORS(request);
      if (corsResponse) {
        return corsResponse;
      }
    }
    
    try {
      // Execute the handler
      const response = await handler(request);
      
      // Add security headers to response
      if (enableSecurityHeaders) {
        return withSecurityHeaders(response);
      }
      
      return response;
    } catch (error) {
      console.error('Security middleware error:', error);
      
      const response = new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500 }
      );
      
      return enableSecurityHeaders ? withSecurityHeaders(response) : response;
    }
  };
}

// Input sanitization
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (input && typeof input === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// File upload security
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }
  
  // Check file type
  const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/tiff',
    'image/bmp',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported' };
  }
  
  // Check file name
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'];
  const fileName = file.name.toLowerCase();
  
  for (const ext of dangerousExtensions) {
    if (fileName.endsWith(ext)) {
      return { valid: false, error: 'File type not allowed for security reasons' };
    }
  }
  
  return { valid: true };
}

// Export security configurations
export { SECURITY_HEADERS, CORS_HEADERS };
