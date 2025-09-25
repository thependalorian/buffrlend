import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { crmIntegration } from '@/lib/crm/integration';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'sync_loan_status':
        await crmIntegration.syncLoanApplicationStatus(
          data.applicationId,
          data.userId,
          data.oldStatus,
          data.newStatus,
          data.additionalData
        );
        break;

      case 'sync_new_customer':
        await crmIntegration.syncNewCustomer(data.userId);
        break;

      case 'update_health_score':
        await crmIntegration.updateCustomerHealthScore(data.userId);
        break;

      case 'sync_partner_performance':
        await crmIntegration.syncPartnerPerformance(
          data.partnerId,
          new Date(data.startDate),
          new Date(data.endDate)
        );
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CRM sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'test_connection':
        // Test CRM database connection
        const { data: testData, error: testError } = await supabase
          .from('customer_relationships')
          .select('count')
          .limit(1);

        if (testError) throw testError;

        return NextResponse.json({
          success: true,
          message: 'CRM connection successful',
          data: testData
        });

      case 'get_stats':
        // Get basic CRM stats
        const { data: stats, error: statsError } = await supabase
          .rpc('get_crm_dashboard_metrics');

        if (statsError) throw statsError;

        return NextResponse.json({
          success: true,
          data: stats
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('CRM API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
