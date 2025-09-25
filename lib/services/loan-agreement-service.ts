/**
 * Loan Agreement Generation Service for BuffrLend
 * Generates professional loan agreements with Buffr branding, letterhead, and signature sections
 */

import { LoanAgreementData } from '@/lib/types/loan-agreement'

export interface LoanAgreementResponse {
  success: boolean
  agreement_id?: string
  pdf_url?: string
  agreement_number?: string
  message?: string
  error?: string
}

export interface DigitalSignature {
  borrower_name: string
  borrower_signature: string
  signature_date: string
  ip_address: string
  user_agent: string
  consent_given: boolean
  salary_deduction_authorized: boolean
}

export class LoanAgreementService {
  private config: {
    company_name: string
    company_address: string
    company_phone: string
    company_email: string
    company_website: string
    namfisa_registration: string
    namra_taxpayer_id: string
    logo_path: string
  }

  constructor() {
    this.config = {
      company_name: 'BUFFR FINANCIAL SERVICES cc',
      company_address: '123 Independence Avenue, Windhoek, Namibia',
      company_phone: '+264 61 123 4567',
      company_email: 'info@lend.buffr.ai',
      company_website: 'www.lend.buffr.ai',
      namfisa_registration: 'NAMFISA/2024/001',
      namra_taxpayer_id: 'NAMRATX/2024/001',
      logo_path: '/Buffr_Logo.png'
    }
  }

  /**
   * Generate a complete loan agreement with Buffr branding
   */
  async generateLoanAgreement(
    loanData: Partial<LoanAgreementData>,
    userId: string,
    loanApplicationId: string
  ): Promise<LoanAgreementResponse> {
    try {
      // Generate unique agreement number
      const agreementNumber = this.generateAgreementNumber()
      
      // Prepare complete agreement data
      const agreementData: LoanAgreementData = {
        agreement_number: agreementNumber,
        agreement_date: new Date().toLocaleDateString('en-GB'),
        ...loanData,
        ...this.config
      } as LoanAgreementData

      // Generate HTML template
      await this.generateAgreementHTML(agreementData)
      
      // Store agreement in database
      const agreementId = await this.storeAgreement(agreementData, userId, loanApplicationId)
      
      return {
        success: true,
        agreement_id: agreementId,
        agreement_number: agreementNumber,
        message: 'Loan agreement generated successfully'
      }
    } catch (error) {
      console.error('Error generating loan agreement:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Generate HTML template with Buffr letterhead and branding
   */
  public async generateAgreementHTML(data: LoanAgreementData): Promise<string> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/logo`);
    const { logoBase64 } = await response.json();
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Buffr Lend Loan Agreement ${data.agreement_number}</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                font-size: 11px; 
                line-height: 1.5; 
                color: #333; 
                margin: 0;
                padding: 20px;
            }
            .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 3px solid #2563eb; 
                padding-bottom: 20px; 
            }
            .company-logo { 
                margin-bottom: 15px;
            }
            .company-logo img {
                height: 60px;
                width: auto;
            }
            .company-name { 
                font-size: 24px; 
                font-weight: bold; 
                color: #2563eb; 
                margin-bottom: 10px; 
            }
            .agreement-title {
                font-size: 20px;
                font-weight: bold;
                color: #1e40af;
                margin: 15px 0;
            }
            .agreement-meta {
                font-size: 12px;
                color: #666;
                margin: 10px 0;
            }
            .section { 
                margin-bottom: 25px; 
            }
            .section-title { 
                font-weight: bold; 
                font-size: 14px; 
                margin-bottom: 15px; 
                color: #1e40af; 
                border-left: 4px solid #2563eb; 
                padding-left: 10px; 
            }
            .field { 
                margin-bottom: 8px; 
                display: flex; 
            }
            .field-label { 
                font-weight: bold; 
                min-width: 200px; 
            }
            .field-value { 
                flex: 1; 
            }
            .signature-section {
                margin-top: 40px;
                page-break-inside: avoid;
            }
            .signature-line { 
                border-top: 1px solid #666; 
                margin-top: 40px; 
                padding-top: 10px; 
                min-height: 60px;
            }
            .signature-field {
                display: inline-block;
                width: 45%;
                margin-right: 5%;
                vertical-align: top;
            }
            .payment-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 15px 0; 
            }
            .payment-table th, .payment-table td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left; 
            }
            .payment-table th { 
                background-color: #f8fafc; 
                font-weight: bold; 
            }
            .footer { 
                margin-top: 40px; 
                font-size: 10px; 
                text-align: center; 
                color: #666; 
                border-top: 1px solid #eee; 
                padding-top: 20px; 
            }
            .compliance-box { 
                border: 2px solid #10b981; 
                padding: 15px; 
                margin: 20px 0; 
                background-color: #f0fdf4; 
                border-radius: 5px; 
            }
            .warning-box { 
                border: 2px solid #f59e0b; 
                padding: 15px; 
                margin: 20px 0; 
                background-color: #fffbeb; 
                border-radius: 5px; 
            }
            .highlight { 
                background-color: #dbeafe; 
                padding: 2px 4px; 
                border-radius: 3px; 
            }
            .buffr-branding {
                color: #2563eb;
                font-weight: bold;
            }
            @media print {
                body { margin: 0; padding: 15px; }
                .signature-section { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="company-logo">
                <img src="${logoBase64}" alt="Buffr Financial Services" />
            </div>
            <div class="company-name">${data.company_name}</div>
            <div class="agreement-title">MICRO LOAN AGREEMENT</div>
            <div class="agreement-meta">
                <p><strong>Agreement Number:</strong> ${data.agreement_number}</p>
                <p><strong>Date:</strong> ${data.agreement_date}</p>
                <p>NAMFISA Registration: ${data.namfisa_registration} | NAMRA Tax ID: ${data.namra_taxpayer_id}</p>
                <p>${data.company_address}</p>
                <p>P.O. Box 90022, Ongwediva, Namibia</p>
            </div>
        </div>

        <div class="section">
            <div class="section-title">1. BORROWER INFORMATION</div>
            <div class="field">
                <span class="field-label">Full Name:</span>
                <span class="field-value">${data.borrower_name}</span>
            </div>
            <div class="field">
                <span class="field-label">ID Number:</span>
                <span class="field-value">${data.borrower_id}</span>
            </div>
            <div class="field">
                <span class="field-label">Phone Number:</span>
                <span class="field-value">${data.borrower_phone}</span>
            </div>
            <div class="field">
                <span class="field-label">Email Address:</span>
                <span class="field-value">${data.borrower_email}</span>
            </div>
            <div class="field">
                <span class="field-label">Residential Address:</span>
                <span class="field-value">${data.borrower_address}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">2. EMPLOYMENT DETAILS</div>
            <div class="field">
                <span class="field-label">Employment Status:</span>
                <span class="field-value">${data.employment_status}</span>
            </div>
            <div class="field">
                <span class="field-label">Employer:</span>
                <span class="field-value">${data.employer_name}</span>
            </div>
            <div class="field">
                <span class="field-label">Monthly Salary:</span>
                <span class="field-value">${data.monthly_salary}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">3. BANKING DETAILS</div>
            <div class="field">
                <span class="field-label">Bank Name:</span>
                <span class="field-value">${data.bank_name}</span>
            </div>
            <div class="field">
                <span class="field-label">Branch Name:</span>
                <span class="field-value">${data.branch_name}</span>
            </div>
            <div class="field">
                <span class="field-label">Branch Code:</span>
                <span class="field-value">${data.branch_code}</span>
            </div>
            <div class="field">
                <span class="field-label">Account Number:</span>
                <span class="field-value">${data.account_number}</span>
            </div>
            <div class="field">
                <span class="field-label">Account Type:</span>
                <span class="field-value">${data.account_type}</span>
            </div>
            <div class="field">
                <span class="field-label">Account Holder:</span>
                <span class="field-value">${data.account_holder}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">4. LOAN TERMS & CONDITIONS</div>
            <table class="payment-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount (NAD)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Principal Loan Amount</td>
                        <td>${data.loan_amount}</td>
                    </tr>
                    <tr>
                        <td>NAMFISA Levy (1%)</td>
                        <td>${data.namfisa_levy}</td>
                    </tr>
                    <tr>
                        <td>Stamp Duty</td>
                        <td>${data.stamp_duty}</td>
                    </tr>
                    <tr>
                        <td>Processing Fee</td>
                        <td>${data.processing_fee}</td>
                    </tr>
                    <tr>
                        <td>Disbursement Fee</td>
                        <td>${data.disbursement_fee}</td>
                    </tr>
                    <tr style="background-color: #f8fafc;">
                        <td><strong>Total Principal</strong></td>
                        <td><strong>${data.total_principal}</strong></td>
                    </tr>
                    <tr>
                        <td>Interest (${data.interest_rate} once-off)</td>
                        <td>${data.interest_amount}</td>
                    </tr>
                    <tr style="background-color: #dbeafe;">
                        <td><strong>TOTAL AMOUNT REPAYABLE</strong></td>
                        <td><strong>${data.total_payable}</strong></td>
                    </tr>
                </tbody>
            </table>

            <div style="margin-top: 15px;">
                <p><strong>Loan Term:</strong> ${data.term_months} months</p>
                <p><strong>Monthly Payment:</strong> ${data.monthly_payment}</p>
                <p><strong>First Payment Due:</strong> ${data.repayment_due_date}</p>
                <p><strong>Interest Rate:</strong> ${data.interest_rate} once-off on disbursement</p>
                <p><strong>Default Interest:</strong> 5% per month on outstanding amounts</p>
            </div>
        </div>

        <div class="section">
            <div class="section-title">5. RESPONSIBLE LENDING COMPLIANCE</div>
            <div class="compliance-box">
                <h4>Affordability Assessment</h4>
                <div class="field">
                    <span class="field-label">Monthly Salary:</span>
                    <span class="field-value">${data.monthly_salary}</span>
                </div>
                <div class="field">
                    <span class="field-label">Maximum Affordable Payment (1/3):</span>
                    <span class="field-value">${data.max_affordable_payment}</span>
                </div>
                <div class="field">
                    <span class="field-label">Monthly Loan Payment:</span>
                    <span class="field-value">${data.monthly_payment}</span>
                </div>
                <div class="field">
                    <span class="field-label">Responsible Lending Status:</span>
                    <span class="field-value">
                        ${data.responsible_lending_compliant ? 
                            '✅ COMPLIANT - Payment within 1/3 salary limit' : 
                            '⚠️ NON-COMPLIANT - Payment exceeds 1/3 salary limit'}
                    </span>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">6. NAMFISA COMPLIANCE</div>
            <div class="compliance-box">
                <h4>Regulatory Compliance</h4>
                <div class="field">
                    <span class="field-label">Interest Rate:</span>
                    <span class="field-value">${data.interest_rate}</span>
                </div>
                <div class="field">
                    <span class="field-label">NAMFISA Limit:</span>
                    <span class="field-value">14.8%</span>
                </div>
                <div class="field">
                    <span class="field-label">NAMFISA Compliance:</span>
                    <span class="field-value">
                        ${data.namfisa_compliant ? 
                            '✅ COMPLIANT - Within regulatory limit' : 
                            '⚠️ NON-COMPLIANT - Exceeds regulatory limit'}
                    </span>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">7. REALPAY DEBIT ORDER AUTHORIZATION</div>
            <p>I hereby authorize <span class="buffr-branding">Buffr Lend</span> to create and manage a RealPay mandate for automatic monthly debit order processing of my loan repayments.</p>

            <table class="payment-table">
                <thead>
                    <tr>
                        <th>Mandate Details</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Agreement Number</td>
                        <td>${data.agreement_number}</td>
                    </tr>
                    <tr>
                        <td>Mandate Start Date</td>
                        <td>${data.mandate_start_date}</td>
                    </tr>
                    <tr>
                        <td>Debit Day</td>
                        <td>${data.mandate_debit_day}</td>
                    </tr>
                    <tr>
                        <td>Frequency</td>
                        <td>${data.mandate_frequency}</td>
                    </tr>
                    <tr>
                        <td>Debit Amount</td>
                        <td>${data.monthly_payment}</td>
                    </tr>
                </tbody>
            </table>

            <p><strong>Important:</strong> This authorization remains valid until the loan is fully repaid or cancelled in writing with 20 working days' notice.</p>
        </div>

        <div class="section signature-section">
            <div class="section-title">8. SIGNATURES & ACKNOWLEDGMENTS</div>
            <p>By signing below, I acknowledge that:</p>
            <ul>
                <li>I have read and understood all terms and conditions of this loan agreement</li>
                <li>All information provided is true and accurate</li>
                <li>I consent to credit bureau checks and data processing</li>
                <li>I authorize RealPay debit order processing</li>
                <li>I understand my rights under NAMFISA regulations</li>
            </ul>

            <div class="signature-line">
                <div class="signature-field">
                    <p><strong>Borrower Signature:</strong></p>
                    <p>Name: ${data.borrower_name}</p>
                    <p>Date: ${data.agreement_date}</p>
                    <div style="margin-top: 20px; border-bottom: 1px solid #333; width: 200px;"></div>
                    <p style="font-size: 10px; margin-top: 5px;">Signature</p>
                </div>
                
                <div class="signature-field">
                    <p><strong><span class="buffr-branding">Buffr Lend</span> Representative:</strong></p>
                    <p>Name: _________________________</p>
                    <p>Date: ${data.agreement_date}</p>
                    <div style="margin-top: 20px; border-bottom: 1px solid #333; width: 200px;"></div>
                    <p style="font-size: 10px; margin-top: 5px;">Authorized Signature</p>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">9. PAYMENT INSTRUCTIONS</div>
            <p><strong>Bank Transfer Details:</strong></p>
            ${data.payment_accounts?.map(account => `
            <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <p><strong>${account.bank}</strong></p>
                <p>Branch: ${account.branch}</p>
                <p>Account Number: ${account.account}</p>
                <p>Branch Code: ${account.code}</p>
            </div>
            `).join('') || ''}
            <p><em>Please use your agreement number (${data.agreement_number}) as payment reference</em></p>
        </div>

        <div class="footer">
            <p><strong>${data.company_name}</strong> - ${data.company_phone} | ${data.company_email}</p>
            <p>${data.company_website} | NAMFISA Compliant Microlending Platform</p>
            <p>This agreement is generated electronically and is legally binding when signed</p>
        </div>
    </body>
    </html>
    `
  }

  /**
   * Generate unique agreement number
   */
  private generateAgreementNumber(): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    
    return `BUFFR-${year}${month}${day}-${random}`
  }

  /**
   * Store agreement in database
   */
  private async storeAgreement(
    agreementData: LoanAgreementData,
    userId: string,
    loanApplicationId: string
  ): Promise<string> {
    // This would integrate with your Supabase database
    // For now, return a mock ID
    const agreementId = `agreement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // TODO: Implement actual database storage
    console.log('Storing agreement:', {
      id: agreementId,
      userId,
      loanApplicationId,
      agreementNumber: agreementData.agreement_number
    })
    
    return agreementId
  }

  /**
   * Process digital signature
   */
  async processDigitalSignature(
    agreementId: string,
    signature: DigitalSignature
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Validate signature data
      if (!signature.borrower_name || !signature.consent_given) {
        return {
          success: false,
          error: 'Missing required signature information'
        }
      }

      // Store signature in database
      await this.storeSignature(agreementId, signature)
      
      return {
        success: true,
        message: 'Digital signature processed successfully'
      }
    } catch (error) {
      console.error('Error processing digital signature:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Store signature in database
   */
  private async storeSignature(
    agreementId: string,
    signature: DigitalSignature
  ): Promise<void> {
    // TODO: Implement actual database storage
    console.log('Storing signature:', {
      agreementId,
      signature: {
        ...signature,
        borrower_signature: '[SIGNATURE_DATA]' // Don't log actual signature
      }
    })
  }

  /**
   * Get agreement by ID
   */
  async getAgreement(agreementId: string): Promise<LoanAgreementData | null> {
    try {
      // TODO: Implement actual database retrieval
      console.log('Retrieving agreement:', agreementId)
      return null
    } catch (error) {
      console.error('Error retrieving agreement:', error)
      return null
    }
  }

  /**
   * Generate PDF from HTML (placeholder for PDF generation)
   */
  async generatePDF(): Promise<Buffer> {
    // TODO: Implement PDF generation using a library like puppeteer or jsPDF
    // For now, return empty buffer
    console.log('Generating PDF from HTML...')
    return Buffer.from('')
  }
}
