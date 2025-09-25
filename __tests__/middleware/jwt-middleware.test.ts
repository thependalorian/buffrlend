/**
 * JWT Middleware Tests for BuffrLend
 * 
 * This file contains comprehensive tests for the JWT middleware functionality.
 */

import { NextRequest } from 'next/server';
import { JWTMiddleware, jwtMiddleware, withAuth, withRole, withPermissions } from '@/lib/middleware/jwt-middleware';
import { jwtService } from '@/lib/services/jwt-service';

// Mock JWT service
jest.mock('@/lib/services/jwt-service', () => ({
  jwtService: {
    verifyToken: jest.fn(),
    verifyTokenLegacy: jest.fn(),
  },
}));

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null,
          })),
        })),
      })),
    })),
  })),
}));

describe('JWTMiddleware', () => {
  let middleware: JWTMiddleware;
  let mockRequest: NextRequest;

  beforeEach(() => {
    middleware = new JWTMiddleware();
    mockRequest = new NextRequest('http://localhost:3000/api/test', {
      method: 'GET',
      headers: {
        'authorization': 'Bearer valid.token.here',
      },
    });
    jest.clearAllMocks();
  });

  describe('Token Extraction', () => {
    it('should extract token from Authorization header', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'authorization': 'Bearer test.token.here',
        },
      });

      const token = (middleware as any).extractToken(request);
      expect(token).toBe('test.token.here');
    });

    it('should extract token from cookie', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'cookie': 'access_token=test.token.here',
        },
      });

      const token = (middleware as any).extractToken(request);
      expect(token).toBe('test.token.here');
    });

    it('should extract token from query parameter', () => {
      const request = new NextRequest('http://localhost:3000/api/test?token=test.token.here');

      const token = (middleware as any).extractToken(request);
      expect(token).toBe('test.token.here');
    });

    it('should return null if no token found', () => {
      const request = new NextRequest('http://localhost:3000/api/test');

      const token = (middleware as any).extractToken(request);
      expect(token).toBeNull();
    });
  });

  describe('Token Verification', () => {
    it('should verify valid token', async () => {
      const mockPayload = {
        sub: 'test-user-id',
        email: 'test@example.com',
        role: 'user',
        permissions: ['read', 'write'],
        tokenType: 'access',
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 3600,
      };

      (jwtService.verifyToken as jest.Mock).mockResolvedValue(mockPayload);

      const result = await (middleware as any).verifyToken('valid.token.here', 'access');
      expect(result).toEqual(mockPayload);
    });

    it('should return null for invalid token', async () => {
      (jwtService.verifyToken as jest.Mock).mockRejectedValue(new Error('Invalid token'));

      const result = await (middleware as any).verifyToken('invalid.token.here', 'access');
      expect(result).toBeNull();
    });
  });

  describe('Role Checking', () => {
    it('should allow access for correct role', () => {
      const payload = {
        role: 'admin',
        permissions: ['read', 'write'],
      };

      const result = (middleware as any).checkRole(payload, 'admin');
      expect(result).toBe(true);
    });

    it('should allow access for admin role regardless of required role', () => {
      const payload = {
        role: 'admin',
        permissions: ['read', 'write'],
      };

      const result = (middleware as any).checkRole(payload, 'user');
      expect(result).toBe(true);
    });

    it('should deny access for incorrect role', () => {
      const payload = {
        role: 'user',
        permissions: ['read', 'write'],
      };

      const result = (middleware as any).checkRole(payload, 'admin');
      expect(result).toBe(false);
    });
  });

  describe('Permission Checking', () => {
    it('should allow access for admin role regardless of permissions', () => {
      const payload = {
        role: 'admin',
        permissions: ['read'],
      };

      const result = (middleware as any).checkPermissions(payload, ['write', 'delete']);
      expect(result).toBe(true);
    });

    it('should allow access when user has all required permissions', () => {
      const payload = {
        role: 'user',
        permissions: ['read', 'write', 'delete'],
      };

      const result = (middleware as any).checkPermissions(payload, ['read', 'write']);
      expect(result).toBe(true);
    });

    it('should deny access when user lacks required permissions', () => {
      const payload = {
        role: 'user',
        permissions: ['read'],
      };

      const result = (middleware as any).checkPermissions(payload, ['read', 'write']);
      expect(result).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should allow request within rate limit', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
      });

      const result = (middleware as any).checkRateLimit(request);
      expect(result).toBeNull();
    });

    it('should block request exceeding rate limit', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
      });

      // Simulate multiple requests to exceed rate limit
      for (let i = 0; i < 101; i++) {
        (middleware as any).checkRateLimit(request);
      }

      const result = (middleware as any).checkRateLimit(request);
      expect(result).toBeDefined();
      expect(result.status).toBe(429);
    });
  });

  describe('Authentication Flow', () => {
    it('should authenticate valid request', async () => {
      const mockPayload = {
        sub: 'test-user-id',
        email: 'test@example.com',
        role: 'user',
        permissions: ['read', 'write'],
        tokenType: 'access',
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 3600,
      };

      (jwtService.verifyToken as jest.Mock).mockResolvedValue(mockPayload);

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'authorization': 'Bearer valid.token.here',
        },
      });

      const result = await middleware.authenticate(request);
      expect(result).toBeNull();
      expect((request as any).user).toEqual(mockPayload);
    });

    it('should reject request without token', async () => {
      const request = new NextRequest('http://localhost:3000/api/test');

      const result = await middleware.authenticate(request);
      expect(result).toBeDefined();
      expect(result?.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      (jwtService.verifyToken as jest.Mock).mockRejectedValue(new Error('Invalid token'));

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'authorization': 'Bearer invalid.token.here',
        },
      });

      const result = await middleware.authenticate(request);
      expect(result).toBeDefined();
      expect(result?.status).toBe(401);
    });

    it('should reject request with insufficient role', async () => {
      const mockPayload = {
        sub: 'test-user-id',
        email: 'test@example.com',
        role: 'user',
        permissions: ['read', 'write'],
        tokenType: 'access',
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 3600,
      };

      (jwtService.verifyToken as jest.Mock).mockResolvedValue(mockPayload);

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'authorization': 'Bearer valid.token.here',
        },
      });

      const result = await middleware.authenticate(request, { requiredRole: 'admin' });
      expect(result).toBeDefined();
      expect(result?.status).toBe(403);
    });

    it('should reject request with insufficient permissions', async () => {
      const mockPayload = {
        sub: 'test-user-id',
        email: 'test@example.com',
        role: 'user',
        permissions: ['read'],
        tokenType: 'access',
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 3600,
      };

      (jwtService.verifyToken as jest.Mock).mockResolvedValue(mockPayload);

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'authorization': 'Bearer valid.token.here',
        },
      });

      const result = await middleware.authenticate(request, { requiredPermissions: ['write'] });
      expect(result).toBeDefined();
      expect(result?.status).toBe(403);
    });
  });

  describe('Higher-Order Functions', () => {
    it('should work with withAuth wrapper', async () => {
      const mockPayload = {
        sub: 'test-user-id',
        email: 'test@example.com',
        role: 'user',
        permissions: ['read', 'write'],
        tokenType: 'access',
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 3600,
      };

      (jwtService.verifyToken as jest.Mock).mockResolvedValue(mockPayload);

      const handler = jest.fn().mockResolvedValue(new Response('OK'));
      const wrappedHandler = withAuth(handler);

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'authorization': 'Bearer valid.token.here',
        },
      });

      await wrappedHandler(request);
      expect(handler).toHaveBeenCalled();
    });

    it('should work with withRole wrapper', async () => {
      const mockPayload = {
        sub: 'test-user-id',
        email: 'test@example.com',
        role: 'admin',
        permissions: ['read', 'write'],
        tokenType: 'access',
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 3600,
      };

      (jwtService.verifyToken as jest.Mock).mockResolvedValue(mockPayload);

      const handler = jest.fn().mockResolvedValue(new Response('OK'));
      const wrappedHandler = withRole('admin', handler);

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'authorization': 'Bearer valid.token.here',
        },
      });

      await wrappedHandler(request);
      expect(handler).toHaveBeenCalled();
    });

    it('should work with withPermissions wrapper', async () => {
      const mockPayload = {
        sub: 'test-user-id',
        email: 'test@example.com',
        role: 'user',
        permissions: ['read', 'write'],
        tokenType: 'access',
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 3600,
      };

      (jwtService.verifyToken as jest.Mock).mockResolvedValue(mockPayload);

      const handler = jest.fn().mockResolvedValue(new Response('OK'));
      const wrappedHandler = withPermissions(['read', 'write'], handler);

      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'authorization': 'Bearer valid.token.here',
        },
      });

      await wrappedHandler(request);
      expect(handler).toHaveBeenCalled();
    });
  });
});
