import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get recent activities from various tables
    const { data: activities, error } = await supabase
      .from('audit_logs')
      .select(`
        id,
        action,
        table_name,
        created_at,
        user_id,
        profiles!audit_logs_user_id_fkey (
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }

    // Transform the data to match the expected format
    const transformedActivities = activities?.map(activity => ({
      id: activity.id,
      type: getActivityType(activity.action, activity.table_name),
      description: getActivityDescription(activity.action, activity.table_name),
      timestamp: activity.created_at,
      customer_name: activity.profiles && Array.isArray(activity.profiles) && activity.profiles.length > 0
        ? `${activity.profiles[0].first_name} ${activity.profiles[0].last_name}`
        : 'System'
    })) || [];

    return NextResponse.json(transformedActivities);
  } catch (error) {
    console.error('Recent activities API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getActivityType(action: string, tableName: string): string {
  if (tableName === 'loan_applications') {
    return 'application';
  } else if (tableName === 'payments') {
    return 'payment';
  } else if (tableName === 'communications') {
    return 'communication';
  } else if (action === 'APPROVE') {
    return 'approval';
  }
  return 'system';
}

function getActivityDescription(action: string, tableName: string): string {
  if (tableName === 'loan_applications') {
    if (action === 'INSERT') return 'New loan application submitted';
    if (action === 'UPDATE') return 'Loan application updated';
  } else if (tableName === 'payments') {
    if (action === 'INSERT') return 'Payment received';
    if (action === 'UPDATE') return 'Payment updated';
  } else if (tableName === 'communications') {
    if (action === 'INSERT') return 'WhatsApp message sent';
    if (action === 'UPDATE') return 'Communication updated';
  } else if (action === 'APPROVE') {
    return 'Loan application approved';
  }
  return `${action} on ${tableName}`;
}
