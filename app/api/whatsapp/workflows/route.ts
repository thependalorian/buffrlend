/**
 * WhatsApp Workflows API Route
 * 
 * This API endpoint handles WhatsApp workflow triggers and automation
 * including customer onboarding, loan updates, and payment reminders.
 */

import { NextRequest, NextResponse } from 'next/server';
import { processWhatsAppWorkflow, scheduleWhatsAppWorkflows, WorkflowTrigger } from '@/lib/workflows/whatsapp-workflows';
import { getCurrentUser } from '@/lib/auth/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { type, customerId, loanId, data } = body;

    // Validate required fields
    if (!type || !customerId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, customerId' },
        { status: 400 }
      );
    }

    // Validate workflow type
    const validTypes = ['loan_application', 'loan_approved', 'loan_disbursed', 'payment_due', 'payment_overdue', 'kyc_required', 'welcome'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid workflow type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Create workflow trigger
    const trigger: WorkflowTrigger = {
      type,
      customerId,
      loanId,
      data
    };

    // Process the workflow
    await processWhatsAppWorkflow(trigger);

    return NextResponse.json({
      success: true,
      message: 'Workflow triggered successfully',
      data: {
        type,
        customerId,
        loanId,
        triggeredAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error processing WhatsApp workflow:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process workflow',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'schedule') {
      // Schedule recurring workflows
      await scheduleWhatsAppWorkflows();
      
      return NextResponse.json({
        success: true,
        message: 'Recurring workflows scheduled successfully'
      });
    }

    // Return available workflow types
    const workflowTypes = [
      {
        type: 'welcome',
        name: 'Customer Onboarding',
        description: 'Sends welcome message to new customers'
      },
      {
        type: 'loan_approved',
        name: 'Loan Approval',
        description: 'Notifies customers when loan is approved'
      },
      {
        type: 'loan_disbursed',
        name: 'Loan Disbursement',
        description: 'Notifies customers when loan funds are disbursed'
      },
      {
        type: 'payment_due',
        name: 'Payment Reminder',
        description: 'Sends payment reminders before due date'
      },
      {
        type: 'payment_overdue',
        name: 'Overdue Payment',
        description: 'Sends overdue payment reminders'
      },
      {
        type: 'kyc_required',
        name: 'KYC Verification',
        description: 'Sends KYC verification reminders'
      }
    ];

    return NextResponse.json({
      success: true,
      data: workflowTypes
    });

  } catch (error) {
    console.error('Error in WhatsApp workflows GET:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
