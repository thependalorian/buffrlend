/**
 * WhatsApp Analytics API Route
 * 
 * This API endpoint provides analytics and reporting for WhatsApp messages
 * including delivery rates, engagement metrics, and communication history.
 */

import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/integrations/whatsapp/whatsapp-service';
import { getCurrentUser } from '@/lib/auth/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const customerId = url.searchParams.get('customerId');

    // Set default date range if not provided (last 30 days)
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);

    const start = startDate ? new Date(startDate) : defaultStartDate;
    const end = endDate ? new Date(endDate) : new Date();

    let result;

    if (customerId) {
      // Get customer-specific communications
      result = await whatsappService.getCustomerCommunications(customerId);
    } else {
      // Get general analytics
      result = await whatsappService.getMessageAnalytics(start, end);
    }

    return NextResponse.json({
      success: true,
      data: result,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching WhatsApp analytics:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
