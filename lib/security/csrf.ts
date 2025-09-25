import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const CSRF_TOKEN_COOKIE = 'csrf-token'
const CSRF_TOKEN_HEADER = 'x-csrf-token'

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function setCSRFToken(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

export function getCSRFToken(request: NextRequest): string | null {
  return request.cookies.get(CSRF_TOKEN_COOKIE)?.value || null
}

export function validateCSRFToken(request: NextRequest): boolean {
  const tokenFromCookie = getCSRFToken(request)
  const tokenFromHeader = request.headers.get(CSRF_TOKEN_HEADER)

  if (!tokenFromCookie || !tokenFromHeader) {
    return false
  }

  return tokenFromCookie === tokenFromHeader
}

export function withCSRFProtection(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Skip CSRF protection for GET requests
    if (request.method === 'GET') {
      return handler(request)
    }

    // Check if CSRF token is valid
    if (!validateCSRFToken(request)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    return handler(request)
  }
}

export function createCSRFResponse(token: string): NextResponse {
  const response = NextResponse.json({ csrfToken: token })
  setCSRFToken(response, token)
  return response
}
