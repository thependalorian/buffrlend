'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { LoanService } from '@/lib/services/loan-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Eye,
  Loader2
} from 'lucide-react';

interface Loan {
  id: string;
  amount: number;
  term_months: number;
  monthly_payment: number;
  status: string;
  created_at: string | null;
  next_payment_date?: string | null;
  remaining_balance: number;
  purpose?: string;
}

interface DashboardStats {
  total_loans: number;
  active_loans: number;
  total_borrowed: number;
  total_repaid: number;
  outstanding_balance: number;
  next_payment_amount: number;
  next_payment_date?: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Fetch dashboard statistics
      const dashboardStats = await LoanService.getDashboardStats(user.id);
      setStats(dashboardStats);

      // Fetch user's loans
      const userLoans = await LoanService.getLoans(user.id);
      setLoans(userLoans);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [user, authLoading, fetchDashboardData]);

  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'defaulted':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Loan['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'defaulted':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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
            <h1 className="text-3xl font-bold text-gray-900" data-testid="dashboard-title">
              Welcome back, {user.first_name}!
            </h1>
            <p className="text-gray-600">Here&apos;s your financial overview</p>
          </div>
          <Button 
            onClick={() => router.push('/loan-application')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="apply-loan-btn"
          >
            <Plus className="mr-2 h-4 w-4" />
            Apply for Loan
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="loan-stats">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Loans</p>
                    <p className="text-2xl font-bold" data-testid="total-loans">{stats.total_loans}</p>
                    <p className="text-xs text-gray-500">{stats.active_loans} active loans</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Borrowed</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.total_borrowed)}</p>
                    <p className="text-xs text-gray-500">Across all loans</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Repaid</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.total_repaid)}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((stats.total_repaid / stats.total_borrowed) * 100)}% of total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Outstanding Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.outstanding_balance)}</p>
                    <p className="text-xs text-gray-500">Remaining to pay</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle data-testid="quick-actions">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => router.push('/loan-application')}
                className="h-20 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center"
              >
                <Plus className="h-6 w-6 mb-2" />
                Apply for Loan
              </Button>
              <Button 
                onClick={() => router.push('/payments')}
                className="h-20 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center"
                data-testid="make-payment-btn"
              >
                <CreditCard className="h-6 w-6 mb-2" />
                Make Payment
              </Button>
              <Button 
                onClick={() => router.push('/kyc-verification')}
                className="h-20 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center"
              >
                <FileText className="h-6 w-6 mb-2" />
                Complete KYC
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Payment Alert */}
        {stats?.next_payment_date && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Upcoming Payment:</strong> Your next payment of {formatCurrency(stats.next_payment_amount)} 
              is due on {formatDate(stats.next_payment_date)}. 
              <Button 
                variant="link" 
                className="p-0 h-auto ml-2"
                onClick={() => router.push('/payments')}
              >
                Make payment now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Recent Loans */}
        <Card>
          <CardHeader>
            <CardTitle data-testid="loan-history">Your Loans</CardTitle>
            <CardDescription>Overview of your loan history and status</CardDescription>
          </CardHeader>
          <CardContent>
            {loans.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4" data-testid="no-loans-message">You don&apos;t have any loans yet</p>
                <Button 
                  onClick={() => router.push('/loan-application')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Apply for your first loan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {loans.map((loan) => (
                  <div key={loan.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {formatCurrency(loan.amount)} Loan
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                            {getStatusIcon(loan.status)}
                            <span className="ml-1 capitalize">{loan.status}</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Purpose:</span>
                            <p>{loan.purpose}</p>
                          </div>
                          <div>
                            <span className="font-medium">Monthly Payment:</span>
                            <p>{formatCurrency(loan.monthly_payment)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Remaining Balance:</span>
                            <p>{formatCurrency(loan.remaining_balance)}</p>
                          </div>
                          <div>
                            <span className="font-medium">Created:</span>
                            <p>{loan.created_at ? formatDate(loan.created_at) : 'N/A'}</p>
                          </div>
                        </div>
                        {loan.next_payment_date && loan.status === 'active' && (
                          <div className="mt-2 text-sm text-blue-600">
                            Next payment due: {formatDate(loan.next_payment_date)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/loan-history`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Completion */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Complete your profile to access all features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Profile Information</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">80%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">KYC Verification</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Banking Details</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">20%</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/profile')}
                  className="w-full mt-4"
                >
                  Complete Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}