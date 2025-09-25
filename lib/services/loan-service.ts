import { createClient } from '@/lib/supabase/client';
import { 
  LoanApplication, 
  LoanApplicationInsert, 
  Loan, 
  Payment, 
  PaymentInsert,
  PartnerCompany,
  KycDocument,
  KycDocumentInsert
} from '@/lib/types';

const supabase = createClient();

export class LoanService {
  // Partner Companies
  static async getPartnerCompanies(): Promise<PartnerCompany[]> {
    const { data, error } = await supabase
      .from('partner_companies')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching partner companies:', error);
      throw new Error('Failed to fetch partner companies');
    }

    return data || [];
  }

  // Loan Applications
  static async createLoanApplication(application: LoanApplicationInsert): Promise<LoanApplication> {
    const { data, error } = await supabase
      .from('loan_applications')
      .insert(application)
      .select()
      .single();

    if (error) {
      console.error('Error creating loan application:', error);
      throw new Error('Failed to create loan application');
    }

    return data;
  }

  static async getLoanApplications(userId: string): Promise<LoanApplication[]> {
    const { data, error } = await supabase
      .from('loan_applications')
      .select(`
        *,
        partner_companies (
          id,
          name,
          code
        )
      `)
      .eq('user_id', userId)
      .order('application_date', { ascending: false });

    if (error) {
      console.error('Error fetching loan applications:', error);
      throw new Error('Failed to fetch loan applications');
    }

    return data || [];
  }

  static async getLoanApplication(id: string): Promise<LoanApplication | null> {
    const { data, error } = await supabase
      .from('loan_applications')
      .select(`
        *,
        partner_companies (
          id,
          name,
          code
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching loan application:', error);
      return null;
    }

    return data;
  }

  static async updateLoanApplication(id: string, updates: Partial<LoanApplication>): Promise<LoanApplication> {
    const { data, error } = await supabase
      .from('loan_applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating loan application:', error);
      throw new Error('Failed to update loan application');
    }

    return data;
  }

  // Loans
  static async getLoans(userId: string): Promise<Loan[]> {
    const { data, error } = await supabase
      .from('loans')
      .select(`
        *,
        loan_applications (
          id,
          purpose,
          partner_companies (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching loans:', error);
      throw new Error('Failed to fetch loans');
    }

    return data || [];
  }

  static async getLoan(id: string): Promise<Loan | null> {
    const { data, error } = await supabase
      .from('loans')
      .select(`
        *,
        loan_applications (
          id,
          purpose,
          partner_companies (
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching loan:', error);
      return null;
    }

    return data;
  }

  static async updateLoan(id: string, updates: Partial<Loan>): Promise<Loan> {
    const { data, error } = await supabase
      .from('loans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating loan:', error);
      throw new Error('Failed to update loan');
    }

    return data;
  }

  // Payments
  static async createPayment(payment: PaymentInsert): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();

    if (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create payment');
    }

    return data;
  }

  static async getPayments(userId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        loans (
          id,
          loan_applications (
            purpose
          )
        )
      `)
      .eq('user_id', userId)
      .order('due_date', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      throw new Error('Failed to fetch payments');
    }

    return data || [];
  }

  static async getPaymentsByLoan(loanId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('loan_id', loanId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching payments by loan:', error);
      throw new Error('Failed to fetch payments');
    }

    return data || [];
  }

  static async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment:', error);
      throw new Error('Failed to update payment');
    }

    return data;
  }

  // KYC Documents
  static async uploadKycDocument(document: KycDocumentInsert): Promise<KycDocument> {
    const { data, error } = await supabase
      .from('kyc_documents')
      .insert(document)
      .select()
      .single();

    if (error) {
      console.error('Error uploading KYC document:', error);
      throw new Error('Failed to upload KYC document');
    }

    return data;
  }

  static async getKycDocuments(userId: string): Promise<KycDocument[]> {
    const { data, error } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching KYC documents:', error);
      throw new Error('Failed to fetch KYC documents');
    }

    return data || [];
  }

  static async getKycDocumentsByApplication(applicationId: string): Promise<KycDocument[]> {
    const { data, error } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('application_id', applicationId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching KYC documents by application:', error);
      throw new Error('Failed to fetch KYC documents');
    }

    return data || [];
  }

  static async updateKycDocument(id: string, updates: Partial<KycDocument>): Promise<KycDocument> {
    const { data, error } = await supabase
      .from('kyc_documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating KYC document:', error);
      throw new Error('Failed to update KYC document');
    }

    return data;
  }

  // Dashboard Statistics
  static async getDashboardStats(userId: string) {
    try {
      // Get loans
      const { data: loans, error: loansError } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', userId);

      if (loansError) throw loansError;

      // Get payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId);

      if (paymentsError) throw paymentsError;

      // Calculate statistics
      const totalLoans = loans?.length || 0;
      const activeLoans = loans?.filter(loan => loan.status === 'active').length || 0;
      const totalBorrowed = loans?.reduce((sum, loan) => sum + loan.amount, 0) || 0;
      const totalPaid = payments?.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) || 0;
      const outstandingBalance = loans?.reduce((sum, loan) => sum + loan.remaining_balance, 0) || 0;

      // Get next payment
      const nextPayment = payments?.find(p => p.status === 'pending' && new Date(p.due_date) >= new Date());
      const nextPaymentAmount = nextPayment?.amount || 0;
      const nextPaymentDate = nextPayment?.due_date || null;

      return {
        total_loans: totalLoans,
        active_loans: activeLoans,
        total_borrowed: totalBorrowed,
        total_repaid: totalPaid,
        outstanding_balance: outstandingBalance,
        next_payment_amount: nextPaymentAmount,
        next_payment_date: nextPaymentDate,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  // Eligibility Check
  static async checkEligibility(userId: string, loanAmount: number, monthlySalary: number): Promise<{
    eligible: boolean;
    reason?: string;
    maxAmount?: number;
  }> {
    try {
      // Get user's active loans
      const { data: activeLoans, error } = await supabase
        .from('loans')
        .select('monthly_payment')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) throw error;

      // Calculate current monthly obligations
      const currentMonthlyPayments = activeLoans?.reduce((sum, loan) => sum + loan.monthly_payment, 0) || 0;

      // Calculate proposed monthly payment (simplified calculation)
      const interestRate = 2.5; // 2.5% monthly
      const termMonths = 3; // Default term
      const proposedMonthlyPayment = (loanAmount * (1 + (interestRate / 100) * termMonths)) / termMonths;

      // Check 1/3 salary rule
      const maxMonthlyPayment = monthlySalary * 0.33;
      const totalMonthlyPayments = currentMonthlyPayments + proposedMonthlyPayment;

      if (totalMonthlyPayments > maxMonthlyPayment) {
        const maxAmount = Math.floor((maxMonthlyPayment - currentMonthlyPayments) * termMonths / (1 + (interestRate / 100) * termMonths));
        return {
          eligible: false,
          reason: 'Monthly payment would exceed 1/3 of your salary',
          maxAmount: Math.max(0, maxAmount)
        };
      }

      return { eligible: true };
    } catch (error) {
      console.error('Error checking eligibility:', error);
      throw new Error('Failed to check eligibility');
    }
  }
}
