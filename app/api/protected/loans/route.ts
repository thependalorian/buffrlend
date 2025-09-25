/**
 * Protected Loans API Route for BuffrLend
 * 
 * This route demonstrates JWT authentication and authorization in action.
 * It shows how to use the JWT middleware to protect API endpoints.
 */

import { NextResponse } from 'next/server';
import { withAuth, type AuthenticatedRequest } from '@/lib/middleware/jwt-middleware';
import { createClient } from '@/lib/supabase/server';

const getSupabaseClient = async () => await createClient();

/**
 * GET /api/protected/loans - Get user's loans (requires authentication)
 */
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Build query based on user role
    const supabase = await getSupabaseClient();
    let query = supabase
      .from('loan_applications')
      .select(`
        id,
        applicant_id,
        loan_amount,
        loan_purpose,
        status,
        created_at,
        updated_at,
        profiles!loan_applications_applicant_id_fkey (
          first_name,
          last_name,
          email,
          company_name
        )
      `)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    // Apply role-based filtering
    if (user.role === 'user') {
      // Users can only see their own loans
      query = query.eq('applicant_id', user.sub);
    } else if (user.role === 'admin') {
      // Admins can see all loans
      if (status) {
        query = query.eq('status', status);
      }
    }

    const { data: loans, error, count } = await query;

    if (error) {
      console.error('Error fetching loans:', error);
      return NextResponse.json(
        { error: 'Failed to fetch loans' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        loans,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit),
        },
      },
    });
  } catch (error) {
    console.error('Loans API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}, { 
  logRequests: true,
  rateLimit: true 
});

/**
 * POST /api/protected/loans - Create new loan application (requires authentication)
 */
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const user = request.user;
    const loanData = await request.json();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate required fields
    const { loan_amount, loan_purpose, business_plan, financial_documents } = loanData;
    
    if (!loan_amount || !loan_purpose) {
      return NextResponse.json(
        { error: 'Loan amount and purpose are required' },
        { status: 400 }
      );
    }

    // Create loan application
    const supabase = await getSupabaseClient();
    const { data: loan, error } = await supabase
      .from('loan_applications')
      .insert({
        applicant_id: user.sub,
        loan_amount: parseFloat(loan_amount),
        loan_purpose,
        business_plan,
        financial_documents,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating loan application:', error);
      return NextResponse.json(
        { error: 'Failed to create loan application' },
        { status: 500 }
      );
    }

    // Log the action
    await supabase.rpc('log_token_action', {
      p_user_id: user.sub,
      p_action: 'create_loan',
      p_success: true,
      p_metadata: {
        loan_id: loan.id,
        loan_amount,
        loan_purpose,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json({
      success: true,
      data: loan,
      message: 'Loan application created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Loan creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}, { 
  logRequests: true,
  rateLimit: true 
});
