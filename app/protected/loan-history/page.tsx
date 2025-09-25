'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { LoanService } from '@/lib/services/loan-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  Calendar,
  TrendingUp,
  Download,
  Eye,
  Loader2
} from 'lucide-react';

interface Loan {
  id: string;
  amount: number;
  term_months: number;
  monthly_payment: number;
  status: 'active' | 'completed' | 'pending' | 'defaulted' | 'approved' | 'rejected';
  created_at: string;
  approved_at?: string;
  next_payment_date?: string | null;
  remaining_balance: number;
  total_paid: number;
  purpose: string;
  interest_rate: number;
  application_status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'funded';
  rejection_reason?: string;
}

interface Payment {
  id: string;
  loan_id: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: 'pending' | 'paid' | 'late' | 'defaulted';
  payment_method?: string;
}

export default function LoanHistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoanHistory = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Fetch loan applications and loans
      const [applications, userLoans, userPayments] = await Promise.all([
        LoanService.getLoanApplications(user.id),
        LoanService.getLoans(user.id),
        LoanService.getPayments(user.id)
      ]);

      // Combine applications and loans for display
      const combinedLoans = applications.map(app => ({
        id: app.id,
        amount: app.loan_amount,
        term_months: app.loan_term_months || 12,
        monthly_payment: app.monthly_payment || 0,
        status: app.status as Loan['status'],
        created_at: app.created_at || '',
        approved_at: app.approved_at || undefined,
        next_payment_date: userLoans.find(loan => loan.application_id === app.id)?.next_payment_date,
        remaining_balance: userLoans.find(loan => loan.application_id === app.id)?.remaining_balance || app.loan_amount,
        total_paid: userLoans.find(loan => loan.application_id === app.id)?.total_paid || 0,
        purpose: app.loan_purpose || 'Personal',
        interest_rate: app.interest_rate || 2.5,
        application_status: app.status as Loan['application_status'],
        rejection_reason: app.admin_notes || undefined,
      }));

      setLoans(combinedLoans);
      setPayments(userPayments.map(payment => ({
        ...payment,
        loan_id: payment.invoice_id || '',
        due_date: payment.payment_date,
        status: 'paid' as const,
        created_at: payment.created_at || undefined,
        updated_at: payment.updated_at || undefined,
        notes: payment.notes || undefined,
        reference_number: payment.reference_number || undefined,
        payment_method: payment.payment_method || undefined,
        invoice_id: payment.invoice_id || undefined,
      })));
    } catch (err) {
      setError('Failed to load loan history');
      console.error('Loan history error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchLoanHistory();
    }
  }, [user, authLoading, fetchLoanHistory]);

  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'defaulted':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Loan['status']) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
      case 'defaulted':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getApplicationStatusColor = (status: Loan['application_status']) => {
    switch (status) {
      case 'funded':
        return 'text-green-600 bg-green-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'under_review':
        return 'text-yellow-600 bg-yellow-100';
      case 'submitted':
        return 'text-blue-600 bg-blue-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  const getLoanPayments = (loanId: string) => {
    return payments.filter(payment => payment.loan_id === loanId);
  };

  const getPaymentStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'late':
        return 'text-orange-600 bg-orange-100';
      case 'defaulted':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loan History</h1>
            <p className="text-gray-600">Track your loan applications and payments</p>
          </div>
          <Button 
            onClick={() => router.push('/loan-application')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply for New Loan
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Applications</p>
                  <p className="text-2xl font-bold">{loans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Loans</p>
                  <p className="text-2xl font-bold">
                    {loans.filter(loan => loan.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Borrowed</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(loans.reduce((sum, loan) => sum + loan.amount, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Repaid</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(loans.reduce((sum, loan) => sum + loan.total_paid, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loans List */}
        <div className="space-y-4">
          {loans.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Loans Yet</h3>
                <p className="text-gray-500 mb-4">You haven&apos;t applied for any loans yet.</p>
                <Button 
                  onClick={() => router.push('/loan-application')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Apply for Your First Loan
                </Button>
              </CardContent>
            </Card>
          ) : (
            loans.map((loan) => (
              <Card key={loan.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {formatCurrency(loan.amount)} Loan - {loan.purpose}
                      </CardTitle>
                      <CardDescription>
                        Applied on {formatDate(loan.created_at)}
                        {loan.approved_at && ` • Approved on ${formatDate(loan.approved_at)}`}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {getStatusIcon(loan.status)}
                        <span className="ml-1 capitalize">{loan.status}</span>
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApplicationStatusColor(loan.application_status)}`}>
                        <span className="capitalize">{loan.application_status.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                      <p className="text-lg font-semibold">{formatCurrency(loan.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Monthly Payment</p>
                      <p className="text-lg font-semibold">{formatCurrency(loan.monthly_payment)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Remaining Balance</p>
                      <p className="text-lg font-semibold">{formatCurrency(loan.remaining_balance)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Paid</p>
                      <p className="text-lg font-semibold">{formatCurrency(loan.total_paid)}</p>
                    </div>
                  </div>

                  {loan.rejection_reason && (
                    <Alert variant="error" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Rejection Reason:</strong> {loan.rejection_reason}
                      </AlertDescription>
                    </Alert>
                  )}

                  {loan.next_payment_date && loan.status === 'active' && (
                    <Alert className="mb-4">
                      <Calendar className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Next Payment:</strong> {formatCurrency(loan.monthly_payment)} due on {formatDate(loan.next_payment_date)}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Payment History */}
                  {loan.status === 'active' || loan.status === 'completed' ? (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-3">Payment History</h4>
                      <div className="space-y-2">
                        {getLoanPayments(loan.id).map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                              <div>
                                <p className="font-medium">{formatCurrency(payment.amount)}</p>
                                <p className="text-sm text-gray-500">
                                  Due: {formatDate(payment.due_date)}
                                  {payment.paid_date && ` • Paid: ${formatDate(payment.paid_date)}`}
                                </p>
                              </div>
                            </div>
                            {payment.payment_method && (
                              <span className="text-sm text-gray-500">{payment.payment_method}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Statement
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}