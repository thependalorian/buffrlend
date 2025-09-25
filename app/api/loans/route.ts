/**
 * BuffrLend Loans API Routes
 * TypeScript-first implementation with Python fallback
 * Replaces the placeholder Python backend with real functionality
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { unifiedAuthService } from '@/lib/services/unified-auth.service'
import type { LoanApplicationInsert } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Get user from unified auth
    const user = await unifiedAuthService.validateSession(
      request.headers.get('authorization')?.replace('Bearer ', '') || '',
      'buffrlend'
    )

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date().toISOString()
      }, { status: 401 })
    }

    // Primary: TypeScript Supabase query
    const supabase = await createClient()
    const { data: loans, error } = await supabase
      .from('loans')
      .select(`
        *,
        loan_applications (
          *,
          partner_companies (
            id,
            name,
            code
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching loans:', "Unknown error")
      // Fallback: Try Python backend
      return await fallbackToPythonLoans('GET', user.id, null)
    }

    return NextResponse.json({
      success: true,
      data: loans,
      message: 'Loans retrieved successfully',
      timestamp: new Date().toISOString(),
      product: 'buffrlend'
    })

    } catch {
    console.error('Loans GET error:', 'Unknown error')
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve loans',
      timestamp: new Date().toISOString(),
      product: 'buffrlend'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from unified auth
    const user = await unifiedAuthService.validateSession(
      request.headers.get('authorization')?.replace('Bearer ', '') || '',
      'buffrlend'
    )

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        timestamp: new Date().toISOString()
      }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate loan application data
    const loanApplicationData: LoanApplicationInsert = {
      application_id: body.application_id || crypto.randomUUID(),
      user_id: user.id,
      company_id: body.company_id,
      employee_verification_id: body.employee_verification_id,
      loan_amount: body.loan_amount,
      loan_term: body.loan_term,
      loan_purpose: body.loan_purpose,
      monthly_income: body.monthly_income,
      monthly_expenses: body.monthly_expenses,
      employment_info: body.employment_info,
      status: 'pending'
    }

    // Primary: TypeScript Supabase insert
    const supabase = await createClient()
    const { data: loanApplication, error } = await supabase
      .from('loan_applications')
      .insert(loanApplicationData)
      .select(`
        *,
        partner_companies (
          id,
          name,
          code
        )
      `)
      .single()

    if (error) {
      console.error('Error creating loan application:', "Unknown error")
      // Fallback: Try Python backend
      return await fallbackToPythonLoans('POST', user.id, loanApplicationData)
    }

    // Create corresponding loan record
    const loanData = {
      application_id: loanApplication.id,
      user_id: user.id,
      amount: loanApplication.loan_amount,
      term_months: loanApplication.loan_term,
      interest_rate: calculateInterestRate(loanApplication.loan_amount, user.buffrlend_data?.monthly_income || 0),
      monthly_payment: calculateMonthlyPayment(loanApplication.loan_amount, loanApplication.loan_term),
      total_amount: calculateTotalAmount(loanApplication.loan_amount, loanApplication.loan_term),
      status: 'pending',
      principal_balance: loanApplication.loan_amount,
      remaining_balance: loanApplication.loan_amount
    }

    const { data: loan, error: loanError } = await supabase
      .from('loans')
      .insert(loanData)
      .select()
      .single()

    if (loanError) {
      console.error('Error creating loan:', loanError)
      // Fallback: Try Python backend
      return await fallbackToPythonLoans('POST', user.id, loanApplicationData)
    }

    return NextResponse.json({
      success: true,
      data: {
        application: loanApplication,
        loan: loan
      },
      message: 'Loan application created successfully',
      timestamp: new Date().toISOString(),
      product: 'buffrlend'
    })

    } catch {
    console.error('Loans POST error:', 'Unknown error')
    return NextResponse.json({
      success: false,
      error: 'Failed to create loan application',
      timestamp: new Date().toISOString(),
      product: 'buffrlend'
    }, { status: 500 })
  }
}

/**
 * Python Backend Fallback
 */
async function fallbackToPythonLoans(
  method: 'GET' | 'POST',
  userId: string,
  data: any
): Promise<NextResponse> {
  try {
    const response = await fetch(`${process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'}/api/loans`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`
      },
      body: method === 'POST' ? JSON.stringify(data) : undefined
    })

    const result = await response.json()
    
    return NextResponse.json({
      success: result.success || true,
      data: result.data,
      message: result.message || 'Python fallback executed',
      timestamp: new Date().toISOString(),
      product: 'buffrlend'
    })

    } catch {
    return NextResponse.json({
      success: false,
      error: 'Python fallback failed',
      timestamp: new Date().toISOString(),
      product: 'buffrlend'
    }, { status: 500 })
  }
}

/**
 * Loan Calculation Functions
 */
function calculateInterestRate(amount: number, monthlyIncome: number): number {
  // Base rate: 2.5% per month
  let baseRate = 2.5
  
  // Risk adjustment based on income
  if (monthlyIncome < 5000) {
    baseRate += 0.5 // Higher risk
  } else if (monthlyIncome > 15000) {
    baseRate -= 0.5 // Lower risk
  }
  
  // Amount-based adjustment
  if (amount > 10000) {
    baseRate += 0.5 // Higher amount = higher risk
  }
  
  return Math.max(1.5, Math.min(5.0, baseRate)) // Cap between 1.5% and 5%
}

function calculateMonthlyPayment(amount: number, termMonths: number): number {
  const interestRate = calculateInterestRate(amount, 0) / 100
  return (amount * (1 + interestRate * termMonths)) / termMonths
}

function calculateTotalAmount(amount: number, termMonths: number): number {
  const interestRate = calculateInterestRate(amount, 0) / 100
  return amount * (1 + interestRate * termMonths)
}
