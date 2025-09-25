'use client';

// Icons will be imported when needed

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  last_login_at: string;
  company_name?: string;
  relationship_stage?: string;
  relationship_score?: number;
  customer_lifetime_value?: number;
  total_loans?: number;
  total_amount_borrowed?: number;
  total_amount_repaid?: number;
  average_loan_amount?: number;
  last_loan_date?: string;
  next_loan_probability?: number;
  churn_probability?: number;
  satisfaction_score?: number;
  communication_preferences?: string[];
}

interface LoanApplication {
  id: string;
  application_id: string;
  loan_amount: number;
  loan_term: number;
  status: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  funded_at?: string;
  completed_at?: string;
}

interface Communication {
  id: string;
  channel: string;
  direction: string;
  message_type: string;
  subject?: string;
  message_content: string;
  status: string;
  response_received: boolean;
  created_at: string;
}

interface CustomerJourney {
  id: string;
  stage: string;
  stage_entry_date: string;
  stage_exit_date?: string;
  time_in_stage_hours?: number;
  touchpoints: string[];
  conversion_actions: string[];
}

export default function Customer360Profile() {
  const params = useParams();
  const customerId = params.id as string;
  
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [journey, setJourney] = useState<CustomerJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const supabase = createClient();

  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch customer profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          created_at,
          last_login_at,
          company_name
        `)
        .eq('id', customerId)
        .single();

      if (profileError) throw profileError;

      // Fetch customer relationship data
      const { data: relationshipData } = await supabase
        .from('customer_relationships')
        .select('*')
        .eq('customer_id', customerId)
        .single();

      // Fetch loan applications
      const { data: loansData, error: loansError } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });

      if (loansError) throw loansError;

      // Fetch communications
      const { data: commsData, error: commsError } = await supabase
        .from('communications')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (commsError) throw commsError;

      // Fetch customer journey
      const { data: journeyData, error: journeyError } = await supabase
        .from('customer_journey')
        .select('*')
        .eq('customer_id', customerId)
        .order('stage_entry_date', { ascending: false });

      if (journeyError) throw journeyError;

      // Combine customer data
      const customerProfile: CustomerProfile = {
        ...profileData,
        ...relationshipData,
        company_name: profileData.company_name
      };

      setCustomer(customerProfile);
      setLoans(loansData || []);
      setCommunications(commsData || []);
      setJourney(journeyData || []);

    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  }, [customerId, supabase]);

  useEffect(() => {
    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId, fetchCustomerData]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      'submitted': { color: 'bg-blue-100 text-blue-800', label: 'KYC Pending' },
      'under_review': { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review' },
      'approved': { color: 'bg-green-100 text-green-800', label: 'Approved' },
      'rejected': { color: 'bg-red-100 text-red-800', label: 'Declined' },
      'funded': { color: 'bg-purple-100 text-purple-800', label: 'Funded' },
      'active': { color: 'bg-indigo-100 text-indigo-800', label: 'Active' },
      'completed': { color: 'bg-green-100 text-green-800', label: 'Completed' },
      'defaulted': { color: 'bg-red-100 text-red-800', label: 'Defaulted' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getChannelIcon = (channel: string) => {
    const icons = {
      'email': '📧',
      'whatsapp': '💬',
      'sms': '📱',
      'phone': '📞',
      'in_person': '👤',
      'dashboard': '🖥️'
    };
    return icons[channel as keyof typeof icons] || '📧';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHealthScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">Customer Not Found</h1>
            <p className="text-gray-600 mt-2">The requested customer profile could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {customer.first_name} {customer.last_name}
              </h1>
              <p className="text-gray-600">{customer.email}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Send Message
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Schedule Call
            </Button>
          </div>
        </div>

        {/* Customer Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Customer Since</h3>
            <p className="text-2xl font-bold text-gray-900">
              {new Date(customer.created_at).toLocaleDateString('en-NA', { month: 'short', year: 'numeric' })}
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Health Score</h3>
            <p className={`text-2xl font-bold ${getHealthScoreColor(customer.relationship_score)}`}>
              {customer.relationship_score || 'N/A'}
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Loans</h3>
            <p className="text-2xl font-bold text-gray-900">{customer.total_loans || 0}</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Lifetime Value</h3>
            <p className="text-2xl font-bold text-gray-900">
              {customer.customer_lifetime_value ? formatCurrency(customer.customer_lifetime_value) : 'N/A'}
            </p>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="p-4">
          <div className="flex space-x-1">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'loans', label: 'Loan History' },
              { key: 'communications', label: 'Communications' },
              { key: 'journey', label: 'Customer Journey' }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full Name:</span>
                  <span className="font-medium">{customer.first_name} {customer.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{customer.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">{customer.company_name || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Relationship Stage:</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {customer.relationship_stage || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Login:</span>
                  <span className="font-medium">
                    {customer.last_login_at ? formatDate(customer.last_login_at) : 'Never'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Financial Summary */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Borrowed:</span>
                  <span className="font-medium">
                    {customer.total_amount_borrowed ? formatCurrency(customer.total_amount_borrowed) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Repaid:</span>
                  <span className="font-medium">
                    {customer.total_amount_repaid ? formatCurrency(customer.total_amount_repaid) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Loan:</span>
                  <span className="font-medium">
                    {customer.average_loan_amount ? formatCurrency(customer.average_loan_amount) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Loan:</span>
                  <span className="font-medium">
                    {customer.last_loan_date ? formatDate(customer.last_loan_date) : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Loan Probability:</span>
                  <span className="font-medium">
                    {customer.next_loan_probability ? `${customer.next_loan_probability}%` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Churn Risk:</span>
                  <span className={`font-medium ${customer.churn_probability && customer.churn_probability > 70 ? 'text-red-600' : 'text-green-600'}`}>
                    {customer.churn_probability ? `${customer.churn_probability}%` : 'Low'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'loans' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Loan History</h2>
            {loans.length > 0 ? (
              <div className="space-y-3">
                {loans.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">Application {loan.application_id}</h3>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(loan.loan_amount)} • {loan.loan_term} months
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {formatDate(loan.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(loan.status)}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No loan applications found for this customer.
              </div>
            )}
          </Card>
        )}

        {activeTab === 'communications' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Communication History</h2>
            {communications.length > 0 ? (
              <div className="space-y-3">
                {communications.map((comm) => (
                  <div
                    key={comm.id}
                    className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="text-2xl">{getChannelIcon(comm.channel)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {comm.direction}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800">
                          {comm.message_type}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          {comm.status}
                        </Badge>
                      </div>
                      {comm.subject && (
                        <h4 className="font-medium mb-1">{comm.subject}</h4>
                      )}
                      <p className="text-sm text-gray-600 mb-2">{comm.message_content}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comm.created_at)}
                        {comm.response_received && (
                          <span className="ml-2 text-green-600">• Response received</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No communications found for this customer.
              </div>
            )}
          </Card>
        )}

        {activeTab === 'journey' && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Journey</h2>
            {journey.length > 0 ? (
              <div className="space-y-4">
                {journey.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium capitalize">{stage.stage.replace('_', ' ')}</h3>
                      <p className="text-sm text-gray-600">
                        Entered: {formatDate(stage.stage_entry_date)}
                        {stage.stage_exit_date && (
                          <span> • Exited: {formatDate(stage.stage_exit_date)}</span>
                        )}
                      </p>
                      {stage.time_in_stage_hours && (
                        <p className="text-xs text-gray-500">
                          Time in stage: {stage.time_in_stage_hours} hours
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No journey data found for this customer.
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
