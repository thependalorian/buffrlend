'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { LoanService } from '@/lib/services/loan-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  TrendingUp,
  Loader2,
  Banknote,
  Smartphone
} from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  created_at: string | null;
  invoice_id: string | null;
  notes: string | null;
  payment_date: string;
  payment_method: string | null;
  reference_number: string | null;
  updated_at: string | null;
}

interface Loan {
  id: string;
  amount: number;
  monthly_payment: number;
  remaining_balance: number;
  next_payment_date: string | null;
  purpose?: string;
  status: string;
}

interface PaymentMethod {
  id: string;
  type: 'salary_deduction' | 'bank_transfer' | 'mobile_money' | 'cash_deposit';
  name: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'salary_deduction',
    type: 'salary_deduction',
    name: 'Salary Deduction',
    description: 'Automatic deduction from your salary',
    icon: <TrendingUp className="h-6 w-6" />,
    available: true,
  },
  {
    id: 'bank_transfer',
    type: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Transfer from your bank account',
    icon: <CreditCard className="h-6 w-6" />,
    available: true,
  },
  {
    id: 'mobile_money',
    type: 'mobile_money',
    name: 'Mobile Money',
    description: 'Pay via mobile money services',
    icon: <Smartphone className="h-6 w-6" />,
    available: true,
  },
  {
    id: 'cash_deposit',
    type: 'cash_deposit',
    name: 'Cash Deposit',
    description: 'Deposit cash at our offices',
    icon: <Banknote className="h-6 w-6" />,
    available: false,
  },
];

export default function PaymentsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const fetchPaymentData = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Fetch user's loans and payments
      const [userLoans, userPayments] = await Promise.all([
        LoanService.getLoans(user.id),
        LoanService.getPayments(user.id)
      ]);

      setLoans(userLoans);
      setPayments(userPayments);
    } catch (err) {
      setError('Failed to load payment data');
      console.error('Payment data error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchPaymentData();
    }
  }, [user, authLoading, fetchPaymentData]);

  const handleMakePayment = (loan: Loan) => {
    setSelectedLoan(loan);
    setPaymentAmount(loan.monthly_payment);
    setShowPaymentForm(true);
    setError(null);
    setSuccess(null);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedLoan || !selectedMethod || paymentAmount <= 0 || !user) {
      setError('Please select a loan, payment method, and enter a valid amount');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Create payment record
      const paymentData = {
        amount: paymentAmount,
        payment_date: new Date().toISOString(),
        payment_method: selectedMethod.type,
        reference_number: `PAY-${Date.now()}`,
        notes: `Payment for loan ${selectedLoan.id}`,
      };

      await LoanService.createPayment(paymentData);
      setSuccess(`Payment of ${formatCurrency(paymentAmount)} processed successfully!`);
      
      // Reset form
      setShowPaymentForm(false);
      setSelectedLoan(null);
      setSelectedMethod(null);
      setPaymentAmount(0);

      // Refresh data
      await fetchPaymentData();

    } catch (err) {
      setError('Payment processing failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentStatusColor = (payment: Payment) => {
    // Since the new Payment interface doesn't have status, we'll determine it based on payment_date
    const paymentDate = new Date(payment.payment_date);
    const now = new Date();
    
    if (paymentDate <= now) {
      return 'text-green-600 bg-green-100'; // Paid
    } else {
      return 'text-yellow-600 bg-yellow-100'; // Pending
    }
  };

  const getPaymentStatusIcon = (payment: Payment) => {
    // Since the new Payment interface doesn't have status, we'll determine it based on payment_date
    const paymentDate = new Date(payment.payment_date);
    const now = new Date();
    
    if (paymentDate <= now) {
      return <CheckCircle className="h-4 w-4" />; // Paid
    } else {
      return <Clock className="h-4 w-4" />; // Pending
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

  const getUpcomingPayments = () => {
    return payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      const now = new Date();
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      return paymentDate > now && paymentDate <= nextWeek;
    });
  };

  const getOverduePayments = () => {
    return payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      const now = new Date();
      
      return paymentDate < now;
    });
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

  const upcomingPayments = getUpcomingPayments();
  const overduePayments = getOverduePayments();
  const activeLoans = loans.filter(loan => loan.status === 'active');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600">Manage your loan payments and view payment history</p>
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

        {/* Success Alert */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Overdue Payments Alert */}
        {overduePayments.length > 0 && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Overdue Payments:</strong> You have {overduePayments.length} overdue payment{overduePayments.length > 1 ? 's' : ''}. 
              Please make payment immediately to avoid additional charges.
            </AlertDescription>
          </Alert>
        )}

        {/* Upcoming Payments Alert */}
        {upcomingPayments.length > 0 && (
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              <strong>Upcoming Payments:</strong> You have {upcomingPayments.length} payment{upcomingPayments.length > 1 ? 's' : ''} due in the next 7 days.
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Loans</p>
                  <p className="text-2xl font-bold">{activeLoans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                  <p className="text-2xl font-bold">
                    {payments.filter(p => new Date(p.payment_date) > new Date()).length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-500">Total Paid</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(payments.filter(p => new Date(p.payment_date) <= new Date()).reduce((sum, p) => sum + p.amount, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Overdue</p>
                  <p className="text-2xl font-bold">{overduePayments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Loans */}
        {activeLoans.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Active Loans</CardTitle>
              <CardDescription>Make payments for your active loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeLoans.map((loan) => (
                  <div key={loan.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {formatCurrency(loan.amount)} - {loan.purpose}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Monthly Payment:</span>
                            <p>{formatCurrency(loan.monthly_payment)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Remaining Balance:</span>
                            <p>{formatCurrency(loan.remaining_balance)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Next Payment Due:</span>
                            <p>{loan.next_payment_date ? formatDate(loan.next_payment_date) : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button 
                          onClick={() => handleMakePayment(loan)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Make Payment
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Form Modal */}
        {showPaymentForm && selectedLoan && (
          <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Make Payment</CardTitle>
                <CardDescription>
                  Pay {formatCurrency(selectedLoan.monthly_payment)} for {selectedLoan.purpose}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">Payment Amount (N$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    max={selectedLoan.remaining_balance}
                    value={paymentAmount || ''}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    placeholder="Enter payment amount"
                  />
                </div>

                <div>
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => handlePaymentMethodSelect(method)}
                        disabled={!method.available}
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          selectedMethod?.id === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : method.available
                            ? 'border-gray-300 hover:border-gray-400'
                            : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`${selectedMethod?.id === method.id ? 'text-blue-600' : 'text-gray-600'}`}>
                            {method.icon}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{method.name}</p>
                            <p className="text-xs text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowPaymentForm(false)}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePaymentSubmit}
                    disabled={!selectedMethod || paymentAmount <= 0 || isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Process Payment'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Card>
        )}

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>View all your payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No payment history available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => {
                  const paymentDate = new Date(payment.payment_date);
                  const now = new Date();
                  const status = paymentDate <= now ? 'paid' : 'pending';
                  
                  return (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment)}`}>
                          {getPaymentStatusIcon(payment)}
                          <span className="ml-1 capitalize">{status}</span>
                        </span>
                        <div>
                          <p className="font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-gray-500">
                            Payment Date: {formatDate(payment.payment_date)}
                          </p>
                          {payment.reference_number && (
                            <p className="text-xs text-gray-400">Ref: {payment.reference_number}</p>
                          )}
                        </div>
                      </div>
                      {payment.payment_method && (
                        <span className="text-sm text-gray-500 capitalize">
                          {payment.payment_method.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}