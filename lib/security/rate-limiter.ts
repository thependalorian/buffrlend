/**
 * Rate Limiting Service for BuffrLend API Endpoints
 * Implements sliding window rate limiting with Redis
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from 'next/server';

// Rate limiting configurations for different endpoint types
const RATE_LIMITS = {
  // Authentication endpoints - moderate limits
  auth: {
    window: "15 m", // 15 minutes
    limit: 10, // 10 requests per 15 minutes
    burst: 3 // Allow 3 burst requests
  },
  
  // Document upload endpoints - strict limits
  document_upload: {
    window: "1 h", // 1 hour
    limit: 20, // 20 uploads per hour
    burst: 5 // Allow 5 burst requests
  },
  
  // Email endpoints - moderate limits
  email: {
    window: "1 m", // 1 minute
    limit: 10, // 10 emails per minute
    burst: 3 // Allow 3 burst requests
  },
  
  // WhatsApp endpoints - moderate limits
  whatsapp: {
    window: "1 m", // 1 minute
    limit: 15, // 15 messages per minute
    burst: 5 // Allow 5 burst requests
  },
  
  // Admin endpoints - strict limits
  admin: {
    window: "1 m", // 1 minute
    limit: 30, // 30 requests per minute
    burst: 10 // Allow 10 burst requests
  },
  
  // General API endpoints - moderate limits
  general: {
    window: "1 m", // 1 minute
    limit: 60, // 60 requests per minute
    burst: 20 // Allow 20 burst requests
  },
  
  // Webhook endpoints - permissive (but with signature verification)
  webhook: {
    window: "1 m", // 1 minute
    limit: 100, // 100 requests per minute
    burst: 50 // Allow 50 burst requests
  },
  
  // Test endpoints - very strict (should be disabled in production)
  test: {
    window: "1 m", // 1 minute
    limit: 5, // 5 requests per minute
    burst: 1 // Allow 1 burst request
  }
} as const;

// Redis configuration
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create rate limiters for each endpoint type
const rateLimiters = {
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMITS.auth.limit, RATE_LIMITS.auth.window),
    analytics: true,
    prefix: "buffrlend_auth",
  }),
  
  document_upload: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMITS.document_upload.limit, RATE_LIMITS.document_upload.window),
    analytics: true,
    prefix: "buffrlend_doc_upload",
  }),
  
  email: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMITS.email.limit, RATE_LIMITS.email.window),
    analytics: true,
    prefix: "buffrlend_email",
  }),
  
  whatsapp: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMITS.whatsapp.limit, RATE_LIMITS.whatsapp.window),
    analytics: true,
    prefix: "buffrlend_whatsapp",
  }),
  
  admin: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMITS.admin.limit, RATE_LIMITS.admin.window),
    analytics: true,
    prefix: "buffrlend_admin",
  }),
  
  general: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMITS.general.limit, RATE_LIMITS.general.window),
    analytics: true,
    prefix: "buffrlend_general",
  }),
  
  webhook: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMITS.webhook.limit, RATE_LIMITS.webhook.window),
    analytics: true,
    prefix: "buffrlend_webhook",
  }),
  
  test: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMITS.test.limit, RATE_LIMITS.test.window),
    analytics: true,
    prefix: "buffrlend_test",
  }),
};

// Rate limiting middleware
export async function withRateLimit(
  endpointType: keyof typeof rateLimiters,
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    skipRateLimit?: boolean;
    customKey?: string;
    customLimit?: number;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Skip rate limiting if disabled
    if (options.skipRateLimit || process.env.NODE_ENV === 'development') {
      return handler(request);
    }
    
    try {
      // Get client identifier
      const identifier = options.customKey || getClientIdentifier(request);
      
      // Get rate limiter
      const rateLimiter = rateLimiters[endpointType];
      
      if (!rateLimiter) {
        console.error(`Rate limiter not found for endpoint type: ${endpointType}`);
        return handler(request); // Allow request if rate limiter not found
      }
      
      // Check rate limit
      const { success, limit, remaining, reset } = await rateLimiter.limit(identifier);
      
      if (!success) {
        const response = NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: `Too many requests. Limit: ${limit} requests per ${RATE_LIMITS[endpointType].window}`,
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          },
          { status: 429 }
        );
        
        // Add rate limit headers
        response.headers.set('X-RateLimit-Limit', limit.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString());
        response.headers.set('Retry-After', Math.ceil((reset - Date.now()) / 1000).toString());
        
        return response;
      }
      
      return handler(request);
      
    } catch {
      console.error('Rate limiting error:', 'Unknown error');
      // Allow request if rate limiting fails
      return handler(request);
    }
  };
}

// Legacy rate limiting function for backward compatibility
export async function checkRateLimit(
  request: NextRequest,
  endpointType: keyof typeof rateLimiters,
  options: {
    skipRateLimit?: boolean;
    customKey?: string;
    customLimit?: number;
  } = {}
): Promise<{ success: boolean; response?: NextResponse; remaining?: number; reset?: number }> {
  
  // Skip rate limiting if disabled
  if (options.skipRateLimit || process.env.NODE_ENV === 'development') {
    return { success: true };
  }
  
  try {
    // Get client identifier
    const identifier = options.customKey || getClientIdentifier(request);
    
    // Get rate limiter
    const rateLimiter = rateLimiters[endpointType];
    
    if (!rateLimiter) {
      console.error(`Rate limiter not found for endpoint type: ${endpointType}`);
      return { success: true }; // Allow request if rate limiter not found
    }
    
    // Check rate limit
    const { success, limit, remaining, reset } = await rateLimiter.limit(identifier);
    
    if (!success) {
      const response = NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Limit: ${limit} requests per ${RATE_LIMITS[endpointType].window}`,
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        { status: 429 }
      );
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString());
      response.headers.set('Retry-After', Math.ceil((reset - Date.now()) / 1000).toString());
      
      return { success: false, response };
    }
    
    return { success: true, remaining, reset };
    
  } catch {
    console.error('Rate limiting error:', 'Unknown error');
    // Allow request if rate limiting fails
    return { success: true };
  }
}

// Get client identifier for rate limiting
function getClientIdentifier(request: NextRequest): string {
  // Try to get user ID from JWT token first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.replace('Bearer ', '');
      // You could decode the JWT here to get user ID
      // For now, we'll use the token hash
      return `user_${Buffer.from(token).toString('base64').slice(0, 16)}`;
    } catch {
      // Fall back to IP if token parsing fails
    }
  }
  
  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `ip_${ip}`;
}

// Rate limiting decorator for API routes
export function rateLimit(
  endpointType: keyof typeof rateLimiters,
  options: {
    skipRateLimit?: boolean;
    customKey?: string;
  } = {}
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (request: NextRequest, ..._args: any[]) {
      const wrappedHandler = await withRateLimit(endpointType, originalMethod.bind(this), options);
      return wrappedHandler(request);
    };
    
    return descriptor;
  };
}

// Utility function to get rate limit info
export async function getRateLimitInfo(
  request: NextRequest,
  endpointType: keyof typeof rateLimiters
): Promise<{ limit: number; remaining: number; reset: number } | null> {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimiter = rateLimiters[endpointType];
    
    if (!rateLimiter) {
      return null;
    }
    
    const { limit, remaining, reset } = await rateLimiter.limit(identifier);
    
    return { limit, remaining, reset };
  } catch {
    console.error('Error getting rate limit info:', 'Unknown error');
    return null;
  }
}

// Export rate limiters for direct use
export { rateLimiters, RATE_LIMITS };

// Export specific rate limiter instances for convenience
export const strictRateLimiter = rateLimiters.document_upload;
export const authRateLimiter = rateLimiters.auth;
export const generalRateLimiter = rateLimiters.general;