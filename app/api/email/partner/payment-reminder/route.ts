/**
 * Partner Payment Reminder Email API Route
 * 
 * API endpoint for sending payment reminder emails to partners
 * Founder: George Nekwaya (george@buffr.ai +12065308433)
 */

import { NextRequest, NextResponse } from 'next/server';
import { PartnerEmailAutomationService } from '@/lib/services/email/partner-email-automation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partnerCompanyId } = body;

    if (!partnerCompanyId) {
      return NextResponse.json(
        { error: 'Partner company ID is required' },
        { status: 400 }
      );
    }

    const automationService = new PartnerEmailAutomationService();
    
    // Send payment reminder to partner
    await automationService.sendPaymentReminderToPartner(partnerCompanyId);

    return NextResponse.json({
      success: true,
      message: 'Payment reminder sent to partner successfully'
    });

  } catch (error: unknown) {
    console.error('Partner payment reminder email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send payment reminder email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
