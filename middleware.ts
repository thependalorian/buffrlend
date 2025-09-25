import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/lib/security/rate-limiter";
import { auditLogger } from "@/lib/security/audit-logger";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting based on the route
  if (pathname.startsWith('/api/auth/')) {
    // Rate limiting handled in API routes
    // Rate limiting handled in API routes
  } else if (pathname.startsWith('/api/')) {
    // Rate limiting handled in API routes
    // Rate limiting handled in API routes
  }

  // Log API access
  if (pathname.startsWith('/api/')) {
    auditLogger.logAPIAccess(request);
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\./, // Directory traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /javascript:/i, // JavaScript injection
  ];

  const url = request.url.toLowerCase();
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(userAgent)) {
      auditLogger.logSecurityEvent(
        request,
        'suspicious_request',
        'high',
        { pattern: pattern.toString(), url, userAgent }
      );
      
      return NextResponse.json(
        { error: 'Request blocked for security reasons' },
        { status: 400 }
      );
    }
  }

  // Update session with Supabase
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/documents/upload-enhanced|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)!",
  ],
};
