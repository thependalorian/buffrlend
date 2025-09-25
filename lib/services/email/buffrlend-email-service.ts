import { EmailService } from './email-service';
import { emailConfig } from '@/lib/config/email-config';

export class BuffrLendEmailService extends EmailService {
  constructor() {
    super();
  }

  /**
   * Send partner summary email
   */
  async sendPartnerSummary(data: {
    partnerEmail: string;
    partnerName: string;
    companyName: string;
    summaryData: any;
  }): Promise<any> {
    try {
      const emailData = {
        to: data.partnerEmail,
        email_type: 'partner_summary' as const,
        template_variables: {
          partner_name: data.partnerName,
          company_name: data.companyName,
          period_month: data.summaryData.period.month,
          period_year: data.summaryData.period.year,
          total_loans: data.summaryData.totalLoans,
          total_amount: data.summaryData.totalAmount.toLocaleString(),
          active_loans: data.summaryData.activeLoans,
          completed_loans: data.summaryData.completedLoans,
          dashboard_url: `${emailConfig.appUrl}/partner/dashboard`,
          support_email: 'support@lend.buffr.ai',
          support_phone: '+12065308433'
        }
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Error sending partner summary:', error);
      throw error;
    }
  }

  /**
   * Send employee loan confirmation
   */
  async sendEmployeeLoanConfirmation(data: any): Promise<any> {
    try {
      const emailData = {
        to: data.employeeEmail,
        email_type: 'employee_loan_confirmation' as const,
        template_variables: {
          employee_name: data.employeeName,
          company_name: data.companyName,
          loan_amount: data.loanAmount?.toLocaleString() || '0',
          loan_id: data.loanId || '',
          salary_deduction_amount: data.salaryDeductionAmount?.toLocaleString() || '0',
          deduction_start_date: data.deductionStartDate || '',
          loan_url: `${emailConfig.appUrl}/loans/${data.loanId || ''}`,
          support_email: 'support@lend.buffr.ai',
          support_phone: '+12065308433'
        }
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Error sending employee loan confirmation:', error);
      throw error;
    }
  }

  /**
   * Send salary deduction authorization request
   */
  async sendSalaryDeductionAuthorization(data: any): Promise<any> {
    try {
      const emailData = {
        to: data.partnerEmail,
        email_type: 'salary_deduction_authorization' as const,
        template_variables: {
          partner_name: data.partnerName,
          company_name: data.companyName,
          employee_name: data.employeeName,
          loan_amount: data.loanAmount?.toLocaleString() || '0',
          loan_id: data.loanId || '',
          authorization_url: data.authorizationUrl || '',
          support_email: 'support@lend.buffr.ai',
          support_phone: '+12065308433'
        }
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Error sending salary deduction authorization:', error);
      throw error;
    }
  }

  /**
   * Send payment reminder to partner
   */
  async sendPaymentReminderToPartner(data: any): Promise<any> {
    try {
      const emailData = {
        to: data.partnerEmail,
        email_type: 'payment_reminder' as const,
        template_variables: {
          partner_name: data.partnerName,
          company_name: data.companyName,
          total_amount: data.totalAmount?.toLocaleString() || '0',
          due_date: data.dueDate || '',
          loan_count: data.loanCount || 0,
          payment_url: `${emailConfig.appUrl}/partner/payments`,
          support_email: 'support@lend.buffr.ai',
          support_phone: '+12065308433'
        }
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Error sending payment reminder to partner:', error);
      throw error;
    }
  }
}
