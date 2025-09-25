/**
 * Mock loan data for testing
 * Includes various loan applications, terms, and financial calculations
 */

export const mockLoanApplications = {
  approvedApplication: {
    id: 'loan-app-001',
    user_id: 'user-123',
    loan_amount: 5000,
    loan_term_months: 3,
    monthly_salary: 25000,
    employment_id: 'emp-001',
    status: 'approved',
    interest_rate: 15,
    total_interest: 750,
    total_fees: 200,
    total_payable: 5950,
    monthly_payment: 1983.33,
    application_date: '2024-01-15T10:00:00Z',
    approved_date: '2024-01-15T11:00:00Z',
    disbursement_date: '2024-01-16T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T11:00:00Z',
  },
  pendingApplication: {
    id: 'loan-app-002',
    user_id: 'user-789',
    loan_amount: 3000,
    loan_term_months: 2,
    monthly_salary: 5000,
    employment_id: 'emp-003',
    status: 'pending',
    interest_rate: 15,
    total_interest: 450,
    total_fees: 150,
    total_payable: 3600,
    monthly_payment: 1800,
    application_date: '2024-01-20T10:00:00Z',
    approved_date: null,
    disbursement_date: null,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
  },
  rejectedApplication: {
    id: 'loan-app-003',
    user_id: 'user-rejected-001',
    loan_amount: 15000,
    loan_term_months: 5,
    monthly_salary: 8000,
    employment_id: 'emp-rejected-001',
    status: 'rejected',
    interest_rate: 15,
    total_interest: 2250,
    total_fees: 300,
    total_payable: 17550,
    monthly_payment: 3510,
    rejection_reason: 'Salary too low for requested amount (exceeds 1/3 rule)',
    application_date: '2024-01-18T10:00:00Z',
    rejected_date: '2024-01-18T11:00:00Z',
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T11:00:00Z',
  },
  contractEmployeeApplication: {
    id: 'loan-app-004',
    user_id: 'user-contract-001',
    loan_amount: 2000,
    loan_term_months: 1,
    monthly_salary: 18000,
    employment_id: 'emp-002',
    status: 'approved',
    interest_rate: 15,
    total_interest: 300,
    total_fees: 100,
    total_payable: 2400,
    monthly_payment: 2400,
    application_date: '2024-01-10T10:00:00Z',
    approved_date: '2024-01-10T11:00:00Z',
    disbursement_date: '2024-01-11T10:00:00Z',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T11:00:00Z',
  },
}

export const mockActiveLoans = {
  activeLoan1: {
    id: 'loan-001',
    application_id: 'loan-app-001',
    user_id: 'user-123',
    loan_amount: 5000,
    remaining_balance: 3966.67,
    loan_term_months: 3,
    monthly_payment: 1983.33,
    interest_rate: 15,
    status: 'active',
    disbursement_date: '2024-01-16T10:00:00Z',
    next_payment_date: '2024-02-16T10:00:00Z',
    final_payment_date: '2024-04-16T10:00:00Z',
    payments_made: 1,
    payments_remaining: 2,
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
  },
  activeLoan2: {
    id: 'loan-002',
    application_id: 'loan-app-004',
    user_id: 'user-contract-001',
    loan_amount: 2000,
    remaining_balance: 0,
    loan_term_months: 1,
    monthly_payment: 2400,
    interest_rate: 15,
    status: 'completed',
    disbursement_date: '2024-01-11T10:00:00Z',
    next_payment_date: null,
    final_payment_date: '2024-02-11T10:00:00Z',
    payments_made: 1,
    payments_remaining: 0,
    completed_date: '2024-02-11T10:00:00Z',
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-02-11T10:00:00Z',
  },
}

export const mockPayments = {
  completedPayment1: {
    id: 'payment-001',
    loan_id: 'loan-001',
    user_id: 'user-123',
    amount: 1983.33,
    payment_date: '2024-01-16T10:00:00Z',
    payment_method: 'salary_deduction',
    status: 'completed',
    reference_number: 'PAY-001-20240116',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
  },
  completedPayment2: {
    id: 'payment-002',
    loan_id: 'loan-002',
    user_id: 'user-contract-001',
    amount: 2400,
    payment_date: '2024-02-11T10:00:00Z',
    payment_method: 'salary_deduction',
    status: 'completed',
    reference_number: 'PAY-002-20240211',
    created_at: '2024-02-11T10:00:00Z',
    updated_at: '2024-02-11T10:00:00Z',
  },
  pendingPayment: {
    id: 'payment-003',
    loan_id: 'loan-001',
    user_id: 'user-123',
    amount: 1983.33,
    payment_date: '2024-02-16T10:00:00Z',
    payment_method: 'salary_deduction',
    status: 'pending',
    reference_number: 'PAY-003-20240216',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
  },
}

export const mockFinancialCalculations = {
  // Test case: N$5,000 loan for 3 months
  standardLoan: {
    loan_amount: 5000,
    loan_term_months: 3,
    interest_rate: 15,
    expected_calculations: {
      total_interest: 750, // 15% of 5000
      processing_fee: 50,
      namfisa_levy: 200, // 4% of 5000
      stamp_duty: 15,
      total_fees: 265,
      total_payable: 6015,
      monthly_payment: 2005, // 6015 / 3
    },
  },
  // Test case: N$2,000 loan for 1 month
  shortTermLoan: {
    loan_amount: 2000,
    loan_term_months: 1,
    interest_rate: 15,
    expected_calculations: {
      total_interest: 300, // 15% of 2000
      processing_fee: 20,
      namfisa_levy: 80, // 4% of 2000
      stamp_duty: 15,
      total_fees: 115,
      total_payable: 2415,
      monthly_payment: 2415, // 2415 / 1
    },
  },
  // Test case: N$10,000 loan for 5 months (maximum)
  maximumLoan: {
    loan_amount: 10000,
    loan_term_months: 5,
    interest_rate: 15,
    expected_calculations: {
      total_interest: 1500, // 15% of 10000
      processing_fee: 100,
      namfisa_levy: 400, // 4% of 10000
      stamp_duty: 15,
      total_fees: 515,
      total_payable: 12015,
      monthly_payment: 2403, // 12015 / 5
    },
  },
  // Test case: Salary compliance (1/3 rule)
  salaryCompliance: {
    monthly_salary: 15000,
    max_loan_amount: 5000, // 1/3 of 15000
    test_cases: [
      { loan_amount: 4000, is_compliant: true },
      { loan_amount: 5000, is_compliant: true },
      { loan_amount: 6000, is_compliant: false },
    ],
  },
}

export const mockLoanHistory = {
  user123History: [
    {
      id: 'loan-001',
      loan_amount: 5000,
      status: 'active',
      application_date: '2024-01-15T10:00:00Z',
      disbursement_date: '2024-01-16T10:00:00Z',
      remaining_balance: 3966.67,
      monthly_payment: 1983.33,
      next_payment_date: '2024-02-16T10:00:00Z',
    },
  ],
  userContractHistory: [
    {
      id: 'loan-002',
      loan_amount: 2000,
      status: 'completed',
      application_date: '2024-01-10T10:00:00Z',
      disbursement_date: '2024-01-11T10:00:00Z',
      completed_date: '2024-02-11T10:00:00Z',
      total_paid: 2400,
    },
  ],
}
