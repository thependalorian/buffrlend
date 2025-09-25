// Loan Agreement Types
export interface LoanAgreementData {
  // Borrower Information
  borrower_name: string
  borrower_id: string
  borrower_phone: string
  borrower_email: string
  borrower_address: string
  
  // Employment Details
  employer_name: string
  employment_status: string
  monthly_salary: string
  
  // Banking Details
  bank_name: string
  branch_name: string
  branch_code: string
  account_number: string
  account_type: string
  account_holder: string
  
  // Loan Terms
  loan_amount: string
  namfisa_levy: string
  stamp_duty: string
  processing_fee: string
  disbursement_fee: string
  total_principal: string
  interest_amount: string
  total_payable: string
  interest_rate: string
  term_months: number
  repayment_due_date: string
  monthly_payment: string
  
  // Compliance
  max_affordable_payment: string
  responsible_lending_compliant: boolean
  namfisa_compliant: boolean
  
  // Payment Accounts
  payment_accounts: Array<{
    bank: string
    branch: string
    account: string
    code: string
  }>
  
  // Mandate Details
  mandate_start_date: string
  mandate_debit_day: string
  mandate_frequency: string
  
  // Agreement Details
  agreement_number: string
  agreement_date: string
  loan_application_id: string
  company_name?: string
  company_address?: string
  company_phone?: string
  company_email?: string
  company_website?: string
  namfisa_registration?: string
  namra_taxpayer_id?: string
}

export interface DigitalSignatureData {
  signatureDataUrl: string
  signerName: string
  signDate: string
  ipAddress: string
  userAgent: string
}

export interface LoanAgreementRecord {
  id: string
  loan_application_id: string
  user_id: string
  agreement_number: string
  agreement_date: string
  agreement_data: LoanAgreementData
  borrower_signature_image?: string
  borrower_signature_name?: string
  borrower_signature_date?: string
  borrower_signature_data?: DigitalSignatureData
  borrower_ip_address?: string
  borrower_user_agent?: string
  pdf_file_path?: string
  pdf_generated: boolean
  google_drive_file_id?: string
  status: string
  created_at: string
  updated_at: string
}

export interface LoanAgreementResponse {
  success: boolean
  agreementId?: string
  error?: string
  message?: string
}

export interface PDFGenerationResponse {
  success: boolean
  pdfUrl?: string
  error?: string
  message?: string
}
