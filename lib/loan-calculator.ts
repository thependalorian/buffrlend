/**
 * Loan calculator utility functions for BuffrLend
 * Handles NAD currency calculations, interest rates, and financial compliance
 */

// Interest rate constants
export const INTEREST_RATE = 15 // 15% once-off interest rate
export const NAMFISA_LEVY_RATE = 4 // 4% NAMFISA levy
export const STAMP_DUTY = 15 // N$15 stamp duty
export const MIN_LOAN_AMOUNT = 500 // N$500 minimum loan amount
export const MAX_LOAN_AMOUNT = 10000 // N$10,000 maximum loan amount
export const MIN_LOAN_TERM = 1 // 1 month minimum term
export const MAX_LOAN_TERM = 5 // 5 months maximum term

/**
 * Calculate interest amount for a loan
 * @param loanAmount - The loan amount in NAD
 * @returns The interest amount (15% of loan amount)
 */
export function calculateInterest(loanAmount: number): number {
  if (typeof loanAmount !== 'number' || isNaN(loanAmount)) {
    throw new Error('Loan amount must be a valid number')
  }
  
  if (loanAmount < 0) {
    throw new Error('Loan amount cannot be negative')
  }
  
  return loanAmount * (INTEREST_RATE / 100)
}

/**
 * Calculate all fees for a loan
 * @param loanAmount - The loan amount in NAD
 * @returns Object containing all fee calculations
 */
export function calculateFees(loanAmount: number) {
  if (typeof loanAmount !== 'number' || isNaN(loanAmount)) {
    throw new Error('Loan amount must be a valid number')
  }
  
  if (loanAmount < 0) {
    throw new Error('Loan amount cannot be negative')
  }
  
  // Processing fee (1% of loan amount, min N$20, max N$100)
  const processingFee = Math.max(20, Math.min(100, loanAmount * 0.01))
  
  // NAMFISA levy (4% of loan amount)
  const namfisaLevy = loanAmount * (NAMFISA_LEVY_RATE / 100)
  
  // Stamp duty (fixed N$15)
  const stampDuty = STAMP_DUTY
  
  const totalFees = processingFee + namfisaLevy + stampDuty
  
  return {
    processing_fee: processingFee,
    namfisa_levy: namfisaLevy,
    stamp_duty: stampDuty,
    total_fees: totalFees,
  }
}

/**
 * Calculate monthly payment amount
 * @param totalPayable - Total amount to be paid back
 * @param termMonths - Loan term in months
 * @returns Monthly payment amount
 */
export function calculateMonthlyPayment(totalPayable: number, termMonths: number): number {
  if (typeof totalPayable !== 'number' || isNaN(totalPayable)) {
    throw new Error('Total payable must be a valid number')
  }
  
  if (typeof termMonths !== 'number' || isNaN(termMonths)) {
    throw new Error('Term months must be a valid number')
  }
  
  if (totalPayable < 0) {
    throw new Error('Total payable cannot be negative')
  }
  
  if (termMonths <= 0) {
    throw new Error('Term months must be greater than 0')
  }
  
  return totalPayable / termMonths
}

/**
 * Calculate complete loan details
 * @param loanAmount - The loan amount in NAD
 * @param termMonths - Loan term in months
 * @returns Complete loan calculation details
 */
export function calculateLoanDetails(loanAmount: number, termMonths: number) {
  if (typeof loanAmount !== 'number' || isNaN(loanAmount)) {
    throw new Error('Loan amount must be a valid number')
  }
  
  if (typeof termMonths !== 'number' || isNaN(termMonths)) {
    throw new Error('Term months must be a valid number')
  }
  
  // Validate loan amount
  const amountValidation = validateLoanAmount(loanAmount)
  if (!amountValidation.is_valid) {
    throw new Error(amountValidation.error || 'Invalid loan amount')
  }
  
  // Validate loan term
  const termValidation = validateLoanTerm(termMonths)
  if (!termValidation.is_valid) {
    throw new Error(termValidation.error || 'Invalid loan term')
  }
  
  // Calculate interest (15% once-off)
  const totalInterest = calculateInterest(loanAmount)
  
  // Calculate fees
  const fees = calculateFees(loanAmount)
  
  // Calculate total payable
  const totalPayable = loanAmount + totalInterest + fees.total_fees
  
  // Calculate monthly payment
  const monthlyPayment = calculateMonthlyPayment(totalPayable, termMonths)
  
  return {
    loan_amount: loanAmount,
    loan_term_months: termMonths,
    buffr_fee_rate: INTEREST_RATE,
    buffr_fee_amount: totalInterest,
    user_total_fees: fees.total_fees,
    total_payable: totalPayable,
    monthly_payment: monthlyPayment,
  }
}

/**
 * Validate salary compliance (1/3 rule)
 * @param loanAmount - The loan amount in NAD
 * @param monthlySalary - Monthly salary in NAD
 * @returns Compliance validation result
 */
export function validateSalaryCompliance(loanAmount: number, monthlySalary: number) {
  if (typeof loanAmount !== 'number' || isNaN(loanAmount)) {
    throw new Error('Loan amount must be a valid number')
  }
  
  if (typeof monthlySalary !== 'number' || isNaN(monthlySalary)) {
    throw new Error('Monthly salary must be a valid number')
  }
  
  if (loanAmount < 0) {
    throw new Error('Loan amount cannot be negative')
  }
  
  if (monthlySalary <= 0) {
    throw new Error('Monthly salary must be greater than 0')
  }
  
  // Calculate maximum loan amount (1/3 of monthly salary)
  const maxLoanAmount = monthlySalary / 3
  
  // Check compliance
  const isCompliant = loanAmount <= maxLoanAmount
  
  // Calculate compliance percentage
  const compliancePercentage = (loanAmount / monthlySalary) * 100
  
  return {
    is_compliant: isCompliant,
    max_loan_amount: maxLoanAmount,
    compliance_percentage: compliancePercentage,
  }
}

/**
 * Format currency in NAD
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'N$0'
  }
  
  // Simple NAD formatting since Intl.NumberFormat may not support NAD
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
  
  return `N$${formatted}`
}

/**
 * Validate loan amount
 * @param amount - Loan amount to validate
 * @returns Validation result
 */
export function validateLoanAmount(amount: number) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return {
      is_valid: false,
      error: 'Loan amount must be a valid number',
      corrected_amount: MIN_LOAN_AMOUNT,
    }
  }
  
  if (amount < MIN_LOAN_AMOUNT) {
    return {
      is_valid: false,
      error: `Loan amount must be at least N$${MIN_LOAN_AMOUNT}`,
      corrected_amount: MIN_LOAN_AMOUNT,
    }
  }
  
  if (amount > MAX_LOAN_AMOUNT) {
    return {
      is_valid: false,
      error: `Loan amount cannot exceed N$${MAX_LOAN_AMOUNT}`,
      corrected_amount: MAX_LOAN_AMOUNT,
    }
  }
  
  return {
    is_valid: true,
    error: null,
    corrected_amount: amount,
  }
}

/**
 * Validate loan term
 * @param term - Loan term in months
 * @returns Validation result
 */
export function validateLoanTerm(term: number) {
  if (typeof term !== 'number' || isNaN(term)) {
    return {
      is_valid: false,
      error: 'Loan term must be a valid number',
      corrected_term: MIN_LOAN_TERM,
    }
  }
  
  if (!Number.isInteger(term)) {
    return {
      is_valid: false,
      error: 'Loan term must be a whole number',
      corrected_term: Math.round(term),
    }
  }
  
  if (term < MIN_LOAN_TERM) {
    return {
      is_valid: false,
      error: `Loan term must be at least ${MIN_LOAN_TERM} month`,
      corrected_term: MIN_LOAN_TERM,
    }
  }
  
  if (term > MAX_LOAN_TERM) {
    return {
      is_valid: false,
      error: `Loan term cannot exceed ${MAX_LOAN_TERM} months`,
      corrected_term: MAX_LOAN_TERM,
    }
  }
  
  return {
    is_valid: true,
    error: null,
    corrected_term: term,
  }
}