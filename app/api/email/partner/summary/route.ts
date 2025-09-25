/**
 * Partner Summary Email API Route
 * 
 * API endpoint for sending monthly partner summary emails
 * Founder: George Nekwaya (george@buffr.ai +12065308433)
 */

import { NextRequest, NextResponse } from 'next/server';
import { PartnerEmailAutomationService } from '@/lib/services/email/partner-email-automation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partnerCompanyId, month } = body;

    if (!partnerCompanyId) {
      return NextResponse.json(
        { error: 'Partner company ID is required' },
        { status: 400 }
      );
    }

    const automationService = new PartnerEmailAutomationService();
    
    // Send monthly partner summary
    await automationService.sendMonthlyPartnerSummary(
      partnerCompanyId,
      month ? new Date(month) : undefined
    );

    return NextResponse.json({
      success: true,
      message: 'Monthly partner summary sent successfully'
    });

  } catch (error: unknown) {
    console.error('Partner summary email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send partner summary email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerCompanyId = searchParams.get('partnerCompanyId');
    const month = searchParams.get('month');

    if (!partnerCompanyId) {
      return NextResponse.json(
        { error: 'Partner company ID is required' },
        { status: 400 }
      );
    }

    const automationService = new PartnerEmailAutomationService();
    
    // Generate summary data without sending email
    const summaryData = await (automationService as unknown as { generatePartnerSummary: (partnerId: string, month?: Date) => Promise<unknown> }).generatePartnerSummary(
      partnerCompanyId,
      month ? new Date(month) : undefined
    );

    return NextResponse.json({
      success: true,
      data: summaryData
    });

  } catch (error: unknown) {
    console.error('Get partner summary error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get partner summary';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
