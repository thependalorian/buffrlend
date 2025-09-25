/**
 * Email Automation Scheduling API Route
 * 
 * API endpoint for scheduling automated email campaigns
 * Founder: George Nekwaya (george@buffr.ai +12065308433)
 */

import { NextRequest, NextResponse } from 'next/server';
import { PartnerEmailAutomationService } from '@/lib/services/email/partner-email-automation';
import { createApiError, ERROR_CODES } from '@/lib/types/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, partnerCompanyId, month } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    const automationService = new PartnerEmailAutomationService();
    let result;

    switch (action) {
      case 'monthly_summaries':
        // Schedule monthly partner summaries for all active partners
        await automationService.scheduleMonthlyPartnerSummaries();
        result = { message: 'Monthly partner summaries scheduled for all active partners' };
        break;

      case 'partner_summary':
        if (!partnerCompanyId) {
          return NextResponse.json(
            { error: 'Partner company ID is required for partner summary' },
            { status: 400 }
          );
        }
        await automationService.sendMonthlyPartnerSummary(
          partnerCompanyId,
          month ? new Date(month) : undefined
        );
        result = { message: 'Monthly partner summary sent successfully' };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error: unknown) {
    console.error('Email automation scheduling error:', error);
    const apiError = createApiError(
      error instanceof Error ? error.message : 'Failed to schedule email automation',
      500,
      ERROR_CODES.EMAIL_ERROR
    );
    return NextResponse.json(apiError, { status: apiError.statusCode });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'status':
        // Get automation service status
        result = {
          status: 'active',
          availableActions: [
            'monthly_summaries',
            'partner_summary',
            'employee_confirmation',
            'salary_deduction_authorization',
            'payment_reminder'
          ],
          lastRun: new Date().toISOString()
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: unknown) {
    console.error('Get automation status error:', error);
    const apiError = createApiError(
      error instanceof Error ? error.message : 'Failed to get automation status',
      500,
      ERROR_CODES.EMAIL_ERROR
    );
    return NextResponse.json(apiError, { status: apiError.statusCode });
  }
}
