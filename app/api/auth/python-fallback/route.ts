/**
 * Python Backend Fallback API Routes
 * Provides fallback functionality when TypeScript services fail
 * Calls the actual Python backend implementations
 */

import { NextRequest, NextResponse } from 'next/server'
// Types will be imported when needed

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, product } = body

    // Call Python backend authentication
    const response = await fetch(`${PYTHON_BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, product })
    })

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: 'Python backend authentication failed',
        timestamp: new Date().toISOString()
      }, { status: response.status })
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: data.success || true,
      user: data.user,
      session: data.session,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      message: data.message || 'Python fallback authentication successful',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Python fallback authentication error:', error)
    return NextResponse.json({
      success: false,
      error: 'Python fallback authentication failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
