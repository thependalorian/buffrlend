/**
 * WhatsApp Send Message API Route
 * 
 * This API endpoint handles sending WhatsApp messages through the WhatsApp Business API
 * using Twilio integration. Supports both template and text messages.
 */

import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/integrations/whatsapp/whatsapp-service';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { withSecurity, sanitizeInput } from '@/lib/security/security-headers';
// import { validateInput, schemas } from '@/lib/security/input-validation';

export const POST = withSecurity(async (request: NextRequest) => {
  try {
    // Apply rate limiting
    const rateLimitResult = await checkRateLimit(request, 'whatsapp')
    if (!rateLimitResult.success) {
      return rateLimitResult.response!
    }

    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and sanitize request body
    const rawBody = await request.json();
    const body = sanitizeInput(rawBody);
    const { 
      to, 
      message, 
      templateName, 
      parameters = {}, 
      customerId, 
      loanId 
    } = body;

    // Validate required fields
    if (!to) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!message && !templateName) {
      return NextResponse.json(
        { error: 'Either message or templateName is required' },
        { status: 400 }
      );
    }

    let result;

    // Send message based on type
    if (templateName) {
      result = await whatsappService.sendTemplateMessage(
        to,
        templateName,
        parameters,
        customerId,
        loanId
      );
    } else {
      result = await whatsappService.sendTextMessage(
        to,
        message,
        customerId,
        loanId
      );
    }

    return NextResponse.json({
      success: true,
      message: 'WhatsApp message sent successfully',
      data: result
    });

  } catch (error: unknown) {
    console.error('Error sending WhatsApp message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to send WhatsApp message',
        details: errorMessage
      },
      { status: 500 }
    );
  }
});

