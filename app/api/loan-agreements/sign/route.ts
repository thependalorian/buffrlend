/**
 * API Route: Sign Loan Agreement
 * Processes digital signature for loan agreements
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { LoanAgreementService, DigitalSignature } from '@/lib/services/loan-agreement-service'

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
    const { agreementId, signature } = body

    if (!agreementId || !signature) {
      return NextResponse.json(
        { success: false, error: 'Agreement ID and signature are required' },
        { status: 400 }
      )
    }

    // Validate signature data
    if (!signature.borrower_name || !signature.consent_given || !signature.salary_deduction_authorized) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature data' },
        { status: 400 }
      )
    }

    // Check if agreement exists and belongs to user
    const { data: agreement, error: agreementError } = await supabase
      .from('loan_agreements')
      .select('*')
      .eq('id', agreementId)
      .eq('user_id', user.id)
      .single()

    if (agreementError || !agreement) {
      return NextResponse.json(
        { success: false, error: 'Agreement not found' },
        { status: 404 }
      )
    }

    // Check if agreement is already signed
    if (agreement.status === 'signed') {
      return NextResponse.json(
        { success: false, error: 'Agreement is already signed' },
        { status: 400 }
      )
    }

    // Create loan agreement service
    const agreementService = new LoanAgreementService()

    // Process digital signature
    const result = await agreementService.processDigitalSignature(
      agreementId,
      signature as DigitalSignature
    )

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // Update agreement status in database
    const { error: updateError } = await supabase
      .from('loan_agreements')
      .update({
        status: 'signed',
        signature_data: signature,
        signed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', agreementId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update agreement status' },
        { status: 500 }
      )
    }

    // Log the signing event for audit purposes
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'loan_agreement_signed',
        resource_type: 'loan_agreement',
        resource_id: agreementId,
        details: {
          agreement_number: agreement.agreement_number,
          signature_timestamp: new Date().toISOString(),
          ip_address: signature.ip_address,
          user_agent: signature.user_agent
        },
        created_at: new Date().toISOString()
      })

    if (auditError) {
      console.warn('Failed to log audit event:', auditError)
      // Don't fail the request for audit logging issues
    }

    return NextResponse.json({
      success: true,
      message: 'Loan agreement signed successfully',
      agreement_id: agreementId,
      signed_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error signing loan agreement:', error)
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

    // Fetch agreement signature status
    const { data: agreement, error: dbError } = await supabase
      .from('loan_agreements')
      .select('id, status, signed_at, signature_data')
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
        status: agreement.status,
        signed_at: agreement.signed_at,
        is_signed: agreement.status === 'signed'
      }
    })

  } catch (error) {
    console.error('Error checking agreement signature status:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
