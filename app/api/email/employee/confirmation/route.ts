/**
 * Employee Loan Confirmation Email API Route
 * 
 * API endpoint for sending employee loan confirmation emails
 * Founder: George Nekwaya (george@buffr.ai +12065308433)
 */

import { NextRequest, NextResponse } from 'next/server';
import { PartnerEmailAutomationService } from '@/lib/services/email/partner-email-automation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { loanApplicationId } = body;

    if (!loanApplicationId) {
      return NextResponse.json(
        { error: 'Loan application ID is required' },
        { status: 400 }
      );
    }

    const automationService = new PartnerEmailAutomationService();
    
    // Send employee loan confirmation
    await automationService.sendEmployeeLoanConfirmation(loanApplicationId);

    return NextResponse.json({
      success: true,
      message: 'Employee loan confirmation sent successfully'
    });

  } catch (error: unknown) {
    console.error('Employee loan confirmation email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send employee loan confirmation email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
