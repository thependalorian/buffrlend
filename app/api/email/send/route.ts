/**
 * Email Send API Route
 * 
 * Handles sending emails through the BuffrSign email system.
 * POST /api/email/send
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EmailService } from '@/lib/services/email';
import { SendEmailRequest, SendEmailResponse } from '@/lib/types/email';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { withSecurity, sanitizeInput } from '@/lib/security/security-headers';
// import { validateInput, schemas } from '@/lib/security/input-validation';
import { createApiError, ERROR_CODES } from '@/lib/types/errors';

export const POST = withSecurity(async (request: NextRequest): Promise<NextResponse> => {
  try {
    // Apply rate limiting
    const rateLimitResult = await checkRateLimit(request, 'email')
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and sanitize request body
    const rawBody = await request.json();
    const body: SendEmailRequest = sanitizeInput(rawBody);

    // Validate required fields
    if (!body.to || !body.email_type) {
      return NextResponse.json(
        { error: 'Missing required fields: to, email_type' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.to)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Initialize email service
    const emailService = new EmailService();

    // Send email
    const result: SendEmailResponse = await emailService.sendEmail(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Email send API error:', error);
    const apiError = createApiError(
      error instanceof Error ? error.message : 'Internal server error',
      500,
      ERROR_CODES.EMAIL_ERROR
    );
    return NextResponse.json(apiError, { status: apiError.statusCode });
  }
});

