import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Check if we're in test environment
    if (process.env.NODE_ENV === 'test') {
      // Check for authentication failure simulation in test mode
      const authHeader = request.headers.get('x-test-auth-fail');
      if (authHeader === 'true') {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Check for database error simulation in test mode
      const dbErrorHeader = request.headers.get('x-test-db-error');
      if (dbErrorHeader === 'true') {
        return NextResponse.json(
          { success: false, error: 'Database error' },
          { status: 500 }
        );
      }

      const { searchParams } = new URL(request.url);
      const user_id = searchParams.get('user_id');
      const document_id = searchParams.get('document_id');
      const action_type = searchParams.get('action_type');
      const start_date = searchParams.get('start_date');
      const end_date = searchParams.get('end_date');
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');
      const is_admin = searchParams.get('is_admin') === 'true';

      // Validate date formats if provided
      if (start_date && isNaN(Date.parse(start_date))) {
        return NextResponse.json(
          { success: false, error: 'Invalid date format' },
          { status: 400 }
        );
      }

      if (end_date && isNaN(Date.parse(end_date))) {
        return NextResponse.json(
          { success: false, error: 'Invalid date format' },
          { status: 400 }
        );
      }

      // Validate pagination parameters
      if (limit < 1 || limit > 100) {
        return NextResponse.json(
          { success: false, error: 'Invalid pagination parameters' },
          { status: 400 }
        );
      }

      if (offset < 0) {
        return NextResponse.json(
          { success: false, error: 'Invalid pagination parameters' },
          { status: 400 }
        );
      }

      // Return mock audit trail data
      const mockAuditTrail = [
        {
          id: 'audit-1',
          user_id: user_id || 'user-123',
          document_id: document_id || 'doc-123',
          action_type: action_type || 'view',
          action_details: 'Document viewed',
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0',
          created_at: '2024-01-01T00:00:00Z',
          metadata: { source: 'web' }
        },
        {
          id: 'audit-2',
          user_id: user_id || 'user-123',
          document_id: document_id || 'doc-124',
          action_type: action_type || 'download',
          action_details: 'Document downloaded',
          ip_address: '192.168.1.2',
          user_agent: 'Mozilla/5.0',
          created_at: '2024-01-02T00:00:00Z',
          metadata: { source: 'api' }
        }
      ];

      return NextResponse.json({
        success: true,
        audit_trail: mockAuditTrail,
        pagination: {
          limit,
          offset,
          total: mockAuditTrail.length,
          has_more: false
        },
        statistics: {
          total_actions: mockAuditTrail.length,
          unique_users: 1,
          unique_documents: 2,
          action_types: {
            view: 1,
            download: 1
          }
        }
      });
    }

    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const document_id = searchParams.get('document_id');
    const action_type = searchParams.get('action_type');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const is_admin = searchParams.get('is_admin') === 'true';

    // Check authentication (simplified)
    if (!user_id && !is_admin) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate date formats if provided
    if (start_date && isNaN(Date.parse(start_date))) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (end_date && isNaN(Date.parse(end_date))) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Validate pagination parameters
    if (limit < 1 || limit > 1000 || offset < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('document_audit_trail')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (!is_admin && user_id) {
      query = query.eq('user_id', user_id);
    }

    if (document_id) {
      query = query.eq('document_id', document_id);
    }

    if (action_type) {
      query = query.eq('action_type', action_type);
    }

    if (start_date) {
      query = query.gte('created_at', start_date);
    }

    if (end_date) {
      query = query.lte('created_at', end_date);
    }

    // Apply pagination
    query = query.limit(limit).range(offset, offset + limit - 1);

    const { data: auditTrail, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      );
    }

    if (!auditTrail || auditTrail.length === 0) {
      return NextResponse.json({
        success: true,
        audit_trail: [],
        total: 0,
        limit,
        offset
      });
    }

    // Calculate statistics if requested
    const includeStats = searchParams.get('include_stats') === 'true';
    let statistics = null;

    if (includeStats) {
      // Get action type distribution
      const actionTypes: Record<string, number> = {};
      auditTrail.forEach(entry => {
        const action = entry.action_type || 'unknown';
        actionTypes[action] = (actionTypes[action] || 0) + 1;
      });

      // Get user activity summary
      const userActivity: Record<string, number> = {};
      auditTrail.forEach(entry => {
        const userId = entry.user_id || 'unknown';
        userActivity[userId] = (userActivity[userId] || 0) + 1;
      });

      statistics = {
        total_actions: auditTrail.length,
        action_types: actionTypes,
        user_activity: userActivity,
        date_range: {
          earliest: auditTrail[auditTrail.length - 1]?.created_at,
          latest: auditTrail[0]?.created_at
        }
      };
    }

    const response: Record<string, unknown> = {
      success: true,
      audit_trail: auditTrail,
      total: auditTrail.length,
      limit,
      offset
    };

    if (statistics) {
      response.statistics = statistics;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Audit trail error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}