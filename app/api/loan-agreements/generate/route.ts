/**
 * API Route: Generate Loan Agreement
 * Creates a new loan agreement with Buffr branding and terms
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { LoanAgreementService } from '@/lib/services/loan-agreement-service'
import { LoanAgreementData } from '@/lib/types/loan-agreement'

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createClient()
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { loanApplicationId, loanData } = body

    if (!loanApplicationId) {
      return NextResponse.json(
        { success: false, error: 'Loan application ID is required' },
        { status: 400 }
      )
    }

    // Validate loan data
    if (!loanData || !loanData.borrower_name || !loanData.loan_amount) {
      return NextResponse.json(
        { success: false, error: 'Invalid loan data provided' },
        { status: 400 }
      )
    }

    // Create loan agreement service
    const agreementService = new LoanAgreementService()

    // Generate agreement
    const result = await agreementService.generateLoanAgreement(
      loanData as Partial<LoanAgreementData>,
      user.id,
      loanApplicationId
    )

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // Store agreement in database
    const { error: dbError } = await supabase
      .from('loan_agreements')
      .insert({
        id: result.agreement_id,
        agreement_number: result.agreement_number,
        user_id: user.id,
        loan_application_id: loanApplicationId,
        agreement_data: loanData,
        status: 'generated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { success: false, error: 'Failed to store agreement' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      agreement_id: result.agreement_id,
      agreement_number: result.agreement_number,
      message: 'Loan agreement generated successfully'
    })

  } catch (error) {
    console.error('Error generating loan agreement:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createClient()
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get agreement ID from query params
    const { searchParams } = new URL(request.url)
    const agreementId = searchParams.get('agreement_id')

    if (!agreementId) {
      return NextResponse.json(
        { success: false, error: 'Agreement ID is required' },
        { status: 400 }
      )
    }

    // Fetch agreement from database
    const { data: agreement, error: dbError } = await supabase
      .from('loan_agreements')
      .select('*')
      .eq('id', agreementId)
      .eq('user_id', user.id)
      .single()

    if (dbError || !agreement) {
      return NextResponse.json(
        { success: false, error: 'Agreement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      agreement: {
        id: agreement.id,
        agreement_number: agreement.agreement_number,
        status: agreement.status,
        agreement_data: agreement.agreement_data,
        created_at: agreement.created_at,
        updated_at: agreement.updated_at
      }
    })

  } catch (error) {
    console.error('Error fetching loan agreement:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
