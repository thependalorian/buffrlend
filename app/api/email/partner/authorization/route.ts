/**
 * Salary Deduction Authorization Email API Route
 * 
 * API endpoint for sending salary deduction authorization emails to partners
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
    
    // Send salary deduction authorization email
    await automationService.sendSalaryDeductionAuthorization(loanApplicationId);

    return NextResponse.json({
      success: true,
      message: 'Salary deduction authorization email sent successfully'
    });

  } catch (error: unknown) {
    console.error('Salary deduction authorization email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send salary deduction authorization email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
