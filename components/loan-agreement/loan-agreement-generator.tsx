/**
 * Loan Agreement Generator Component
 * Complete loan agreement system with Buffr branding, terms, and digital signature
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

import { FileText, Download, CheckCircle, AlertCircle, Clock, DollarSign, User, Building, CreditCard, Shield, PenTool } from 'lucide-react';
import { DigitalSignature } from './digital-signature'

// Define the DigitalSignatureData type locally to match the component
interface DigitalSignatureData {
  borrower_name: string
  borrower_signature: string
  signature_date: string
  ip_address: string
  user_agent: string
  consent_given: boolean
  salary_deduction_authorized: boolean
}
import { LoanAgreementService } from '@/lib/services/loan-agreement-service'
import { LoanAgreementData } from '@/lib/types/loan-agreement'

interface LoanAgreementGeneratorProps {
  loanData: Partial<LoanAgreementData>
  userId: string
  loanApplicationId: string
  onAgreementComplete?: (agreementId: string) => void
  onAgreementError?: (error: string) => void
  className?: string
}

interface AgreementState {
  status: 'loading' | 'generated' | 'signing' | 'signed' | 'error'
  agreementId?: string
  agreementNumber?: string
  error?: string
  signature?: DigitalSignatureData
}

export function LoanAgreementGenerator({
  loanData,
  userId,
  loanApplicationId,
  onAgreementComplete,
  onAgreementError,
  className = ''
}: LoanAgreementGeneratorProps) {
  const [agreementState, setAgreementState] = useState<AgreementState>({ status: 'loading' })
  const [agreementService] = useState(() => new LoanAgreementService())
  const [isSigning, setIsSigning] = useState(false)

  const generateAgreement = useCallback(async () => {
    try {
      setAgreementState({ status: 'loading' })

      const result = await agreementService.generateLoanAgreement(
        loanData,
        userId,
        loanApplicationId
      )

      if (result.success && result.agreement_id) {
        setAgreementState({
          status: 'generated',
          agreementId: result.agreement_id,
          agreementNumber: result.agreement_number
        })
      } else {
        throw new Error(result.error || 'Failed to generate agreement')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setAgreementState({ status: 'error', error: errorMessage })
      onAgreementError?.(errorMessage)
    } finally {
      // Agreement generation complete
    }
  }, [loanData, userId, loanApplicationId, agreementService, onAgreementError])

  // Generate agreement on component mount
  useEffect(() => {
    generateAgreement()
  }, [generateAgreement])

  const handleSignatureComplete = async (signature: DigitalSignatureData) => {
    try {
      setIsSigning(true)
      setAgreementState(prev => ({ ...prev, status: 'signing' }))

      if (!agreementState.agreementId) {
        throw new Error('No agreement ID available')
      }

      const result = await agreementService.processDigitalSignature(
        agreementState.agreementId,
        signature
      )

      if (result.success) {
        setAgreementState(prev => ({
          ...prev,
          status: 'signed',
          signature
        }))
        onAgreementComplete?.(agreementState.agreementId)
      } else {
        throw new Error(result.error || 'Failed to process signature')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setAgreementState(prev => ({ ...prev, status: 'error', error: errorMessage }))
      onAgreementError?.(errorMessage)
    } finally {
      setIsSigning(false)
    }
  }

  const handleSignatureError = (error: string) => {
    setAgreementState(prev => ({ ...prev, status: 'error', error }))
    onAgreementError?.(error)
  }

  const downloadPDF = async () => {
    try {
      // TODO: Implement PDF download functionality
      console.log('Downloading PDF for agreement:', agreementState.agreementId)
      // This would generate and download the PDF
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  const getStatusIcon = () => {
    switch (agreementState.status) {
      case 'loading':
        return <Clock className="h-5 w-5 animate-spin text-blue-500" />
      case 'generated':
        return <FileText className="h-5 w-5 text-green-500" />
      case 'signing':
        return <PenTool className="h-5 w-5 animate-pulse text-orange-500" />
      case 'signed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = () => {
    switch (agreementState.status) {
      case 'loading':
        return 'Generating Agreement...'
      case 'generated':
        return 'Agreement Ready for Signature'
      case 'signing':
        return 'Processing Signature...'
      case 'signed':
        return 'Agreement Signed Successfully'
      case 'error':
        return 'Error Processing Agreement'
      default:
        return 'Unknown Status'
    }
  }

  const getStatusColor = () => {
    switch (agreementState.status) {
      case 'loading':
        return 'bg-blue-100 text-blue-800'
      case 'generated':
        return 'bg-green-100 text-green-800'
      case 'signing':
        return 'bg-orange-100 text-orange-800'
      case 'signed':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          {getStatusIcon()}
          <h1 className="text-3xl font-bold text-gray-900">Loan Agreement</h1>
        </div>
        <p className="text-lg text-gray-600">Review and sign your loan agreement</p>
        
        {agreementState.agreementNumber && (
          <Badge variant="outline" className="mt-2">
            Agreement #{agreementState.agreementNumber}
          </Badge>
        )}
      </div>

      {/* Status Alert */}
      <Alert className={getStatusColor()}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="font-medium">
          {getStatusText()}
        </AlertDescription>
      </Alert>

      {/* Error Display */}
      {agreementState.status === 'error' && agreementState.error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{agreementState.error}</AlertDescription>
        </Alert>
      )}

      {/* Agreement Content */}
      {agreementState.status !== 'loading' && agreementState.status !== 'error' && (
        <>
          {/* Loan Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Loan Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Loan Amount:</span>
                  <span>{loanData.loan_amount || 'N$5,000'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Term:</span>
                  <span>{loanData.term_months || 3} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Interest Rate:</span>
                  <span>{loanData.interest_rate || '15%'} (once-off)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Monthly Payment:</span>
                  <span>{loanData.monthly_payment || 'N$1,917'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Repayment:</span>
                  <span>{loanData.total_payable || 'N$5,750'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Disbursement Date:</span>
                  <span>Upon approval</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Borrower Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Borrower Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Full Name:</span>
                  <span>{loanData.borrower_name || 'John Doe'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ID Number:</span>
                  <span>{loanData.borrower_id || '123456789'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{loanData.borrower_phone || '+264 81 123 4567'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{loanData.borrower_email || 'john@example.com'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Employer:</span>
                  <span>{loanData.employer_name || 'ABC Company'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Monthly Salary:</span>
                  <span>{loanData.monthly_salary || 'N$8,000'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Employment Status:</span>
                  <span>{loanData.employment_status || 'Permanent'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Banking Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Bank:</span>
                  <span>{loanData.bank_name || 'First National Bank'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Branch:</span>
                  <span>{loanData.branch_name || 'Windhoek Main'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Account Number:</span>
                  <span>{loanData.account_number || '1234567890'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Account Type:</span>
                  <span>{loanData.account_type || 'Savings'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Responsible Lending:</span>
                  <Badge variant={loanData.responsible_lending_compliant ? 'default' : 'destructive'}>
                    {loanData.responsible_lending_compliant ? 'Compliant' : 'Non-Compliant'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">NAMFISA Compliance:</span>
                  <Badge variant={loanData.namfisa_compliant ? 'default' : 'destructive'}>
                    {loanData.namfisa_compliant ? 'Compliant' : 'Non-Compliant'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <hr className="my-6" />

          {/* Digital Signature Section */}
          {agreementState.status === 'generated' && (
            <DigitalSignature
              borrowerName={loanData.borrower_name || 'John Doe'}
              onSignatureComplete={handleSignatureComplete}
              onSignatureError={handleSignatureError}
              disabled={isSigning}
            />
          )}

          {/* Signed Agreement Actions */}
          {agreementState.status === 'signed' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Agreement Successfully Signed
                </CardTitle>
                <CardDescription>
                  Your loan agreement has been processed and is now legally binding.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={downloadPDF} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Signed Agreement
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    View Agreement Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Loading State */}
      {agreementState.status === 'loading' && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your loan agreement...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
