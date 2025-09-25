/**
 * API Route: Generate PDF for Loan Agreement
 * Creates and downloads PDF version of signed loan agreement
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { LoanAgreementService } from '@/lib/services/loan-agreement-service'

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

    // Check if agreement is signed
    if (agreement.status !== 'signed') {
      return NextResponse.json(
        { success: false, error: 'Agreement must be signed before generating PDF' },
        { status: 400 }
      )
    }

    // Create loan agreement service
    const agreementService = new LoanAgreementService()

    // Generate HTML content
    const htmlContent = await agreementService.generateAgreementHTML(agreement.agreement_data)

    // For now, return the HTML content
    // In a production environment, you would use a PDF generation library like Puppeteer
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="loan-agreement-${agreement.agreement_number}.html"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

    // TODO: Implement actual PDF generation
    // const pdfBuffer = await agreementService.generatePDF(htmlContent)
    // 
    // return new NextResponse(pdfBuffer, {
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `attachment; filename="loan-agreement-${agreement.agreement_number}.pdf"`,
    //     'Cache-Control': 'no-cache, no-store, must-revalidate',
    //     'Pragma': 'no-cache',
    //     'Expires': '0'
    //   }
    // })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const { agreementId, format = 'html' } = body

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

    // Create loan agreement service
    const agreementService = new LoanAgreementService()

    // Generate content based on format
    if (format === 'pdf') {
      // TODO: Implement PDF generation
      return NextResponse.json({
        success: false,
        error: 'PDF generation not yet implemented'
      })
    } else {
      // Generate HTML content
      const htmlContent = await agreementService.generateAgreementHTML(agreement.agreement_data)
      
      return NextResponse.json({
        success: true,
        content: htmlContent,
        format: 'html',
        agreement_number: agreement.agreement_number
      })
    }

  } catch (error) {
    console.error('Error generating agreement content:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
