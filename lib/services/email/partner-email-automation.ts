/**
 * Partner Email Automation Service
 * 
 * Automated email system for BuffrLend partner companies and employees
 * Founder: George Nekwaya (george@buffr.ai +12065308433)
 */

import { BuffrLendEmailService } from './buffrlend-email-service';
import { createClient } from '@/lib/supabase/client';
import { PartnerCompany } from '@/lib/types';
// import { LoanApplication, Loan } from '@/lib/types';

export interface EmployeeLoanSummary {
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
}

export interface PartnerSummaryData {
  partnerCompany: PartnerCompany;
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
  employeeLoans: EmployeeLoanSummary[];
  topPerformers: EmployeeLoanSummary[];
  riskAlerts: EmployeeLoanSummary[];
}

export class PartnerEmailAutomationService {
  private emailService: BuffrLendEmailService;
  private supabase = createClient();

  constructor() {
    this.emailService = new BuffrLendEmailService();
  }

  /**
   * Send monthly partner summary email
   */
  async sendMonthlyPartnerSummary(partnerCompanyId: string, month?: Date): Promise<void> {
    try {
      const summaryData = await this.generatePartnerSummary(partnerCompanyId, month);
      
      await this.emailService.sendPartnerSummary({
        partnerEmail: summaryData.partnerCompany.primary_contact_email,
        partnerName: summaryData.partnerCompany.primary_contact_name,
        companyName: summaryData.partnerCompany.company_name,
        summaryData: summaryData
      });

      console.log(`Monthly partner summary sent to ${summaryData.partnerCompany.company_name}`);
    } catch (error) {
      console.error('Error sending monthly partner summary:', error);
      throw error;
    }
  }

  /**
   * Send employee loan confirmation email
   */
  async sendEmployeeLoanConfirmation(loanApplicationId: string): Promise<void> {
    try {
      const loanData = await this.getLoanApplicationData(loanApplicationId);
      
      await this.emailService.sendEmployeeLoanConfirmation({
        employeeEmail: loanData.employeeEmail,
        employeeName: loanData.employeeName,
        companyName: loanData.companyName,
        loanAmount: loanData.loanAmount,
        loanTerm: loanData.loanTerm,
        monthlyPayment: loanData.monthlyPayment,
        applicationId: loanData.applicationId,
        salaryDeductionStartDate: loanData.salaryDeductionStartDate,
        nextPaymentDate: loanData.nextPaymentDate
      });

      console.log(`Employee loan confirmation sent to ${loanData.employeeName}`);
    } catch (error) {
      console.error('Error sending employee loan confirmation:', error);
      throw error;
    }
  }

  /**
   * Send salary deduction authorization email to partner
   */
  async sendSalaryDeductionAuthorization(loanApplicationId: string): Promise<void> {
    try {
      const loanData = await this.getLoanApplicationData(loanApplicationId);
      
      await this.emailService.sendSalaryDeductionAuthorization({
        partnerEmail: loanData.partnerEmail,
        partnerName: loanData.partnerName,
        companyName: loanData.companyName,
        employeeName: loanData.employeeName,
        employeeId: loanData.employeeId,
        loanAmount: loanData.loanAmount,
        monthlyPayment: loanData.monthlyPayment,
        salaryDeductionStartDate: loanData.salaryDeductionStartDate,
        applicationId: loanData.applicationId
      });

      console.log(`Salary deduction authorization sent to ${loanData.companyName}`);
    } catch (error) {
      console.error('Error sending salary deduction authorization:', error);
      throw error;
    }
  }

  /**
   * Send payment reminder to partner for salary deductions
   */
  async sendPaymentReminderToPartner(partnerCompanyId: string): Promise<void> {
    try {
      const partnerData = await this.getPartnerCompanyData(partnerCompanyId);
      const pendingPayments = await this.getPendingSalaryDeductions(partnerCompanyId);
      
      if (pendingPayments.length === 0) {
        console.log(`No pending payments for ${partnerData.company_name}`);
        return;
      }

      await this.emailService.sendPaymentReminderToPartner({
        partnerEmail: partnerData.primary_contact_email,
        partnerName: partnerData.primary_contact_name,
        companyName: partnerData.company_name,
        pendingPayments: pendingPayments,
        totalAmount: pendingPayments.reduce((sum, payment) => sum + payment.amount, 0),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      });

      console.log(`Payment reminder sent to ${partnerData.company_name}`);
    } catch (error) {
      console.error('Error sending payment reminder to partner:', error);
      throw error;
    }
  }

  /**
   * Generate partner summary data
   */
  private async generatePartnerSummary(partnerCompanyId: string, month?: Date): Promise<PartnerSummaryData> {
    const targetMonth = month || new Date();
    const startDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
    const endDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);

    // Get partner company data
    const { data: partnerCompany, error: partnerError } = await this.supabase
      .from('partner_companies')
      .select('*')
      .eq('id', partnerCompanyId)
      .single();

    if (partnerError || !partnerCompany) {
      throw new Error('Partner company not found');
    }

    // Get all loans for this partner company
    const { data: loans, error: loansError } = await this.supabase
      .from('loans')
      .select(`
        *,
        loan_applications (
          *,
          profiles (
            first_name,
            last_name,
            email,
            id_number
          )
        )
      `)
      .eq('loan_applications.company_id', partnerCompanyId);

    if (loansError) {
      throw new Error('Failed to fetch loans');
    }

    // Calculate summary statistics
    const activeLoans = loans?.filter(loan => loan.status === 'active') || [];
    const newLoansThisMonth = loans?.filter(loan => 
      new Date(loan.created_at) >= startDate && 
      new Date(loan.created_at) <= endDate
    ) || [];
    const completedLoansThisMonth = loans?.filter(loan => 
      loan.status === 'completed' && 
      new Date(loan.updated_at) >= startDate && 
      new Date(loan.updated_at) <= endDate
    ) || [];

    const summary = {
      totalActiveLoans: activeLoans.length,
      totalLoanAmount: activeLoans.reduce((sum, loan) => sum + (loan.principal_balance || 0), 0),
      totalMonthlyPayments: activeLoans.reduce((sum, loan) => sum + (loan.monthly_payment || 0), 0),
      totalPaidThisMonth: 0, // This would need to be calculated from payments table
      newLoansThisMonth: newLoansThisMonth.length,
      completedLoansThisMonth: completedLoansThisMonth.length,
      defaultRate: 0, // This would need to be calculated from payment history
      averageLoanAmount: activeLoans.length > 0 ? 
        activeLoans.reduce((sum, loan) => sum + (loan.principal_balance || 0), 0) / activeLoans.length : 0
    };

    // Generate employee loan summaries
    const employeeLoans: EmployeeLoanSummary[] = activeLoans.map(loan => ({
      employeeId: loan.loan_applications.profiles.id,
      employeeName: `${loan.loan_applications.profiles.first_name} ${loan.loan_applications.profiles.last_name}`,
      employeeEmail: loan.loan_applications.profiles.email,
      employeeIdNumber: loan.loan_applications.profiles.id_number,
      position: loan.loan_applications.employment_info?.position || 'N/A',
      department: loan.loan_applications.employment_info?.department || 'N/A',
      loanAmount: loan.loan_amount,
      loanTerm: loan.loan_term,
      monthlyPayment: loan.monthly_payment,
      loanStatus: loan.status,
      applicationDate: new Date(loan.created_at),
      disbursementDate: loan.disbursement_date ? new Date(loan.disbursement_date) : undefined,
      nextPaymentDate: loan.next_payment_date ? new Date(loan.next_payment_date) : undefined,
      totalPaid: loan.total_paid || 0,
      remainingBalance: loan.remaining_balance || 0
    }));

    // Identify top performers (employees with good payment history)
    const topPerformers = employeeLoans
      .filter(employee => employee.totalPaid > 0)
      .sort((a, b) => b.totalPaid - a.totalPaid)
      .slice(0, 5);

    // Identify risk alerts (employees with payment issues)
    const riskAlerts = employeeLoans
      .filter(employee => employee.remainingBalance > 0 && employee.totalPaid === 0)
      .slice(0, 5);

    return {
      partnerCompany,
      period: {
        startDate,
        endDate,
        month: targetMonth.toLocaleDateString('en-US', { month: 'long' }),
        year: targetMonth.getFullYear()
      },
      summary,
      employeeLoans,
      topPerformers,
      riskAlerts
    };
  }

  /**
   * Get loan application data for emails
   */
  private async getLoanApplicationData(loanApplicationId: string): Promise<any> {
    const { data: loanApplication, error } = await this.supabase
      .from('loan_applications')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          email
        ),
        partner_companies (
          company_name,
          primary_contact_name,
          primary_contact_email
        )
      `)
      .eq('id', loanApplicationId)
      .single();

    if (error || !loanApplication) {
      throw new Error('Loan application not found');
    }

    return {
      employeeName: `${loanApplication.profiles.first_name} ${loanApplication.profiles.last_name}`,
      employeeEmail: loanApplication.profiles.email,
      employeeId: loanApplication.profiles.id,
      companyName: loanApplication.partner_companies.company_name,
      partnerName: loanApplication.partner_companies.primary_contact_name,
      partnerEmail: loanApplication.partner_companies.primary_contact_email,
      loanAmount: loanApplication.loan_amount,
      loanTerm: loanApplication.loan_term,
      monthlyPayment: loanApplication.monthly_payment,
      applicationId: loanApplication.application_id,
      salaryDeductionStartDate: loanApplication.payroll_deduction_start_date,
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
  }

  /**
   * Get partner company data
   */
  private async getPartnerCompanyData(partnerCompanyId: string): Promise<PartnerCompany> {
    const { data: partnerCompany, error } = await this.supabase
      .from('partner_companies')
      .select('*')
      .eq('id', partnerCompanyId)
      .single();

    if (error || !partnerCompany) {
      throw new Error('Partner company not found');
    }

    return partnerCompany;
  }

  /**
   * Get pending salary deductions for a partner company
   */
  private async getPendingSalaryDeductions(_partnerCompanyId: string): Promise<any[]> {
    // This would query the payments table for pending salary deductions
    // For now, returning empty array as placeholder
    return [];
  }

  /**
   * Schedule monthly partner summaries for all active partners
   */
  async scheduleMonthlyPartnerSummaries(): Promise<void> {
    try {
      const { data: partnerCompanies, error } = await this.supabase
        .from('partner_companies')
        .select('id, company_name')
        .eq('partnership_status', 'active')
        .eq('status', 'active');

      if (error) {
        throw new Error('Failed to fetch partner companies');
      }

      for (const partner of partnerCompanies || []) {
        try {
          await this.sendMonthlyPartnerSummary(partner.id);
          console.log(`Scheduled monthly summary for ${partner.company_name}`);
        } catch (error) {
          console.error(`Failed to send summary for ${partner.company_name}:`, error);
        }
      }
    } catch (error) {
      console.error('Error scheduling monthly partner summaries:', error);
      throw error;
    }
  }
}
