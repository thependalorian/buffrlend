/**
 * JWT Middleware for BuffrLend API Routes
 * 
 * This middleware provides JWT authentication and authorization for API routes.
 * It integrates with the JWT service and provides comprehensive security features.
 * 
 * Features:
 * - Token verification and validation
 * - Role-based access control
 * - Permission-based authorization
 * - Rate limiting integration
 * - Request logging and monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtService, type JWTPayloadCustom, type TokenType } from '@/lib/services/jwt-service';
import { createClient } from '@/lib/supabase/server';

// Middleware Configuration
const MIDDLEWARE_CONFIG = {
  // Rate limiting configuration
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100, // 100 requests per window
  // Token validation
  ALLOWED_ALGORITHMS: ['HS256'],
  // Security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  },
} as const;

// Request Context Interface
export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayloadCustom;
  token?: string;
  tokenType?: TokenType;
}

// Middleware Options Interface
export interface JWTMiddlewareOptions {
  requiredRole?: string;
  requiredPermissions?: string[];
  tokenType?: TokenType;
  allowExpired?: boolean;
  rateLimit?: boolean;
  logRequests?: boolean;
}

// Rate Limiting Store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * JWT Middleware Class
 */
export class JWTMiddleware {
  private getSupabaseClient = async () => await createClient();

  /**
   * Main middleware function
   */
  async authenticate(
    request: NextRequest,
    options: JWTMiddlewareOptions = {}
  ): Promise<NextResponse | null> {
    try {
      // Add security headers
      this.addSecurityHeaders(new NextResponse());

      // Rate limiting check
      if (options.rateLimit !== false) {
        const rateLimitResponse = await this.checkRateLimit(request);
        if (rateLimitResponse) {
          return rateLimitResponse;
        }
      }

      // Extract token from request
      const token = this.extractToken(request);
      if (!token) {
        return this.createErrorResponse('No token provided', 401);
      }

      // Verify token
      const payload = await this.verifyToken(token, options.tokenType);
      if (!payload) {
        return this.createErrorResponse('Invalid token', 401);
      }

      // Check role requirements
      if (options.requiredRole && !this.checkRole(payload, options.requiredRole)) {
        return this.createErrorResponse('Insufficient role', 403);
      }

      // Check permission requirements
      if (options.requiredPermissions && !this.checkPermissions(payload, options.requiredPermissions)) {
        return this.createErrorResponse('Insufficient permissions', 403);
      }

      // Log request if enabled
      if (options.logRequests) {
        this.logRequest(request, payload);
      }

      // Add user context to request
      (request as AuthenticatedRequest).user = payload;
      (request as AuthenticatedRequest).token = token;
      (request as AuthenticatedRequest).tokenType = options.tokenType || 'access';

      return null; // Continue to next middleware/handler
    } catch (error) {
      console.error('JWT Middleware error:', error);
      return this.createErrorResponse('Authentication failed', 401);
    }
  }

  /**
   * Extract token from request headers
   */
  private extractToken(request: NextRequest): string | null {
    // Check Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check cookie (for web clients)
    const tokenCookie = request.cookies.get('access_token');
    if (tokenCookie) {
      return tokenCookie.value;
    }

    // Check query parameter (for specific use cases)
    const tokenParam = request.nextUrl.searchParams.get('token');
    if (tokenParam) {
      return tokenParam;
    }

    return null;
  }

  /**
   * Verify JWT token
   */
  private async verifyToken(token: string, tokenType?: TokenType): Promise<JWTPayloadCustom | null> {
    try {
      const payload = await jwtService.verifyToken(token, tokenType);
      return payload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Check if user has required role
   */
  private checkRole(payload: JWTPayloadCustom, requiredRole: string): boolean {
    return payload.role === requiredRole || payload.role === 'admin';
  }

  /**
   * Check if user has required permissions
   */
  private checkPermissions(payload: JWTPayloadCustom, requiredPermissions: string[]): boolean {
    if (payload.role === 'admin') {
      return true; // Admin has all permissions
    }

    return requiredPermissions.every(permission => 
      payload.permissions.includes(permission)
    );
  }

  /**
   * Check rate limiting
   */
  private async checkRateLimit(request: NextRequest): Promise<NextResponse | null> {
    const clientId = await this.getClientId(request);
    const now = Date.now();
    // const windowStart = now - MIDDLEWARE_CONFIG.RATE_LIMIT_WINDOW;

    // Clean up old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }

    // Get current count
    const current = rateLimitStore.get(clientId);
    if (!current || current.resetTime < now) {
      rateLimitStore.set(clientId, {
        count: 1,
        resetTime: now + MIDDLEWARE_CONFIG.RATE_LIMIT_WINDOW,
      });
      return null;
    }

    // Check if limit exceeded
    if (current.count >= MIDDLEWARE_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
      return this.createErrorResponse('Rate limit exceeded', 429, {
        'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString(),
        'X-RateLimit-Limit': MIDDLEWARE_CONFIG.RATE_LIMIT_MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(current.resetTime).toISOString(),
      });
    }

    // Increment count
    current.count++;
    return null;
  }

  /**
   * Get client identifier for rate limiting
   */
  private async getClientId(request: NextRequest): Promise<string> {
    // Try to get user ID from token first
    const token = this.extractToken(request);
    if (token) {
      try {
        const payload = await jwtService.verifyTokenLegacy(token);
        return payload.sub;
      } catch {
        // Fall back to IP address
      }
    }

    // Fall back to IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    return ip;
  }

  /**
   * Add security headers to response
   */
  private addSecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(MIDDLEWARE_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  /**
   * Create error response
   */
  private createErrorResponse(
    message: string,
    status: number,
    additionalHeaders: Record<string, string> = {}
  ): NextResponse {
    const response = NextResponse.json(
      { error: message, status },
      { status }
    );

    // Add security headers
    this.addSecurityHeaders(response);

    // Add additional headers
    Object.entries(additionalHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  /**
   * Log request for monitoring
   */
  private logRequest(request: NextRequest, payload: JWTPayloadCustom): void {
    const logData = {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      user: payload.sub,
      role: payload.role,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent'),
    };

    console.log('API Request:', JSON.stringify(logData));
  }
}

// Export singleton instance
export const jwtMiddleware = new JWTMiddleware();

// Export convenience functions
export const authenticate = (options?: JWTMiddlewareOptions) => 
  (request: NextRequest) => jwtMiddleware.authenticate(request, options);

export const requireAuth = (options?: JWTMiddlewareOptions) => 
  (request: NextRequest) => jwtMiddleware.authenticate(request, { ...options, rateLimit: true });

export const requireRole = (role: string, options?: Omit<JWTMiddlewareOptions, 'requiredRole'>) =>
  (request: NextRequest) => jwtMiddleware.authenticate(request, { ...options, requiredRole: role });

export const requirePermissions = (permissions: string[], options?: Omit<JWTMiddlewareOptions, 'requiredPermissions'>) =>
  (request: NextRequest) => jwtMiddleware.authenticate(request, { ...options, requiredPermissions: permissions });

export const requireAdmin = (options?: Omit<JWTMiddlewareOptions, 'requiredRole'>) =>
  (request: NextRequest) => jwtMiddleware.authenticate(request, { ...options, requiredRole: 'admin' });

// Higher-order function for API route protection
export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>,
  options?: JWTMiddlewareOptions
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResponse = await jwtMiddleware.authenticate(request, options);
    if (authResponse) {
      return authResponse;
    }

    return handler(request as AuthenticatedRequest);
  };
}

// Higher-order function for role-based protection
export function withRole(
  role: string,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>,
  options?: Omit<JWTMiddlewareOptions, 'requiredRole'>
) {
  return withAuth(handler, { ...options, requiredRole: role });
}

// Higher-order function for permission-based protection
export function withPermissions(
  permissions: string[],
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>,
  options?: Omit<JWTMiddlewareOptions, 'requiredPermissions'>
) {
  return withAuth(handler, { ...options, requiredPermissions: permissions });
}

// Higher-order function for admin-only protection
export function withAdmin(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>,
  options?: Omit<JWTMiddlewareOptions, 'requiredRole'>
) {
  return withAuth(handler, { ...options, requiredRole: 'admin' });
}
