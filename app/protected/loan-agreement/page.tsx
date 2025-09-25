'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { LoanAgreementGenerator } from '@/components/loan-agreement/loan-agreement-generator'
import { LoanAgreementData } from '@/lib/types/loan-agreement'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function ProtectedLoanAgreementPage() {
  const { user } = useAuth()
  const [loanData, setLoanData] = useState<Partial<LoanAgreementData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  // Mock loan data - in real implementation, this would come from the loan application
  useEffect(() => {
    const mockLoanData: Partial<LoanAgreementData> = {
      // Borrower Information
      borrower_name: 'John Doe',
      borrower_id: '123456789',
      borrower_phone: '+264 81 123 4567',
      borrower_email: 'john.doe@example.com',
      borrower_address: '123 Independence Avenue, Windhoek, Namibia',
      
      // Employment Details
      employer_name: 'ABC Company Ltd',
      employment_status: 'Permanent',
      monthly_salary: 'N$8,000.00',
      
      // Banking Details
      bank_name: 'First National Bank',
      branch_name: 'Windhoek Main',
      branch_code: '281973',
      account_number: '1234567890',
      account_type: 'Savings',
      account_holder: 'John Doe',
      
      // Loan Terms
      loan_amount: 'N$5,000.00',
      namfisa_levy: 'N$50.00',
      stamp_duty: 'N$15.00',
      processing_fee: 'N$0.00',
      disbursement_fee: 'N$25.00',
      total_principal: 'N$5,090.00',
      interest_amount: 'N$750.00',
      total_payable: 'N$5,840.00',
      interest_rate: '15%',
      term_months: 3,
      repayment_due_date: '15/02/2024',
      monthly_payment: 'N$1,946.67',
      
      // Compliance
      max_affordable_payment: 'N$2,666.67',
      responsible_lending_compliant: true,
      namfisa_compliant: true,
      
      // Payment Accounts
      payment_accounts: [
        {
          bank: 'First National Bank',
          branch: 'Windhoek Main',
          account: '9876543210',
          code: '281973'
        }
      ],
      
      // Mandate Details
      mandate_start_date: '15/01/2024',
      mandate_debit_day: '15th',
      mandate_frequency: 'Monthly'
    }
    
    setLoanData(mockLoanData)
    setIsLoading(false)
  }, [])

  const handleAgreementComplete = (agreementId: string) => {
    setSuccess(`Loan agreement signed successfully! Agreement ID: ${agreementId}`)
    setError('')
  }

  const handleAgreementError = (error: string) => {
    setError(error)
    setSuccess('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading loan agreement...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must be logged in to access the loan agreement page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Message */}
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loan Agreement Generator */}
        <LoanAgreementGenerator
          loanData={loanData}
          userId={user.id}
          loanApplicationId="mock-application-id"
          onAgreementComplete={handleAgreementComplete}
          onAgreementError={handleAgreementError}
        />
      </div>
    </div>
  )
}