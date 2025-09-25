/**
 * Partner Email Automation Hook
 * 
 * React hook for managing partner email automation functionality
 * Founder: George Nekwaya (george@buffr.ai +12065308433)
 */

import { useState, useCallback } from 'react';

export interface PartnerSummaryData {
  partnerCompany: {
    id: string;
    company_name: string;
    primary_contact_name: string;
    primary_contact_email: string;
  };
  period: {
    startDate: Date;
    endDate: Date;
    month: string;
    year: number;
  };
  summary: {
    totalActiveLoans: number;
    totalLoanAmount: number;
    totalMonthlyPayments: number;
    totalPaidThisMonth: number;
    newLoansThisMonth: number;
    completedLoansThisMonth: number;
    defaultRate: number;
    averageLoanAmount: number;
  };
  employeeLoans: Array<{
    employeeId: string;
    employeeName: string;
    employeeEmail: string;
    employeeIdNumber: string;
    position: string;
    department: string;
    loanAmount: number;
    loanTerm: number;
    monthlyPayment: number;
    loanStatus: string;
    applicationDate: Date;
    disbursementDate?: Date;
    nextPaymentDate?: Date;
    totalPaid: number;
    remainingBalance: number;
  }>;
  topPerformers: Array<Record<string, unknown>>;
  riskAlerts: Array<Record<string, unknown>>;
}

export interface UsePartnerEmailAutomationReturn {
  // State
  loading: boolean;
  error: string | null;
  partnerSummary: PartnerSummaryData | null;

  // Actions
  sendMonthlyPartnerSummary: (partnerCompanyId: string, month?: Date) => Promise<void>;
  sendEmployeeLoanConfirmation: (loanApplicationId: string) => Promise<void>;
  sendSalaryDeductionAuthorization: (loanApplicationId: string) => Promise<void>;
  sendPaymentReminderToPartner: (partnerCompanyId: string) => Promise<void>;
  scheduleMonthlyPartnerSummaries: () => Promise<void>;
  getPartnerSummary: (partnerCompanyId: string, month?: Date) => Promise<PartnerSummaryData>;
  getAutomationStatus: () => Promise<any>;
}

export function usePartnerEmailAutomation(): UsePartnerEmailAutomationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partnerSummary, setPartnerSummary] = useState<PartnerSummaryData | null>(null);

  const handleApiCall = useCallback(async (
    apiCall: () => Promise<Response>,
    successMessage?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API call failed');
      }

      if (successMessage) {
        console.log(successMessage);
      }

      return data;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMonthlyPartnerSummary = useCallback(async (partnerCompanyId: string, month?: Date) => {
    await handleApiCall(
      () => fetch('/api/email/partner/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerCompanyId, month: month?.toISOString() })
      }),
      'Monthly partner summary sent successfully'
    );
  }, [handleApiCall]);

  const sendEmployeeLoanConfirmation = useCallback(async (loanApplicationId: string) => {
    await handleApiCall(
      () => fetch('/api/email/employee/confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanApplicationId })
      }),
      'Employee loan confirmation sent successfully'
    );
  }, [handleApiCall]);

  const sendSalaryDeductionAuthorization = useCallback(async (loanApplicationId: string) => {
    await handleApiCall(
      () => fetch('/api/email/partner/authorization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanApplicationId })
      }),
      'Salary deduction authorization email sent successfully'
    );
  }, [handleApiCall]);

  const sendPaymentReminderToPartner = useCallback(async (partnerCompanyId: string) => {
    await handleApiCall(
      () => fetch('/api/email/partner/payment-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerCompanyId })
      }),
      'Payment reminder sent to partner successfully'
    );
  }, [handleApiCall]);

  const scheduleMonthlyPartnerSummaries = useCallback(async () => {
    await handleApiCall(
      () => fetch('/api/email/automation/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'monthly_summaries' })
      }),
      'Monthly partner summaries scheduled for all active partners'
    );
  }, [handleApiCall]);

  const getPartnerSummary = useCallback(async (partnerCompanyId: string, month?: Date): Promise<PartnerSummaryData> => {
    const params = new URLSearchParams({ partnerCompanyId });
    if (month) {
      params.append('month', month.toISOString());
    }

    const data = await handleApiCall(
      () => fetch(`/api/email/partner/summary?${params}`)
    );

    setPartnerSummary(data.data);
    return data.data;
  }, [handleApiCall]);

  const getAutomationStatus = useCallback(async () => {
    const data = await handleApiCall(
      () => fetch('/api/email/automation/schedule?action=status')
    );

    return data.data;
  }, [handleApiCall]);

  return {
    // State
    loading,
    error,
    partnerSummary,

    // Actions
    sendMonthlyPartnerSummary,
    sendEmployeeLoanConfirmation,
    sendSalaryDeductionAuthorization,
    sendPaymentReminderToPartner,
    scheduleMonthlyPartnerSummaries,
    getPartnerSummary,
    getAutomationStatus
  };
}
