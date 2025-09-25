'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CustomerProfileCardProps {
  customerId: string;
  showActions?: boolean;
  className?: string;
}

interface CustomerData {
  id: string;
  customer_id: string;
  relationship_stage: string;
  relationship_score: number;
  customer_lifetime_value: number;
  total_loans: number;
  total_amount_borrowed: number;
  total_amount_repaid: number;
  average_loan_amount: number;
  last_loan_date: string;
  next_loan_probability: number;
  churn_probability: number;
  satisfaction_score: number;
  communication_preferences: string[];
  created_at: string;
  updated_at: string;
  // From profiles table
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
}

export const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({ 
  customerId, 
  showActions = true,
  className = ""
}) => {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch customer relationship data
        const { data: relationshipData, error: relationshipError } = await supabase
          .from('customer_relationships')
          .select('*')
          .eq('customer_id', customerId)
          .single();

        if (relationshipError) throw relationshipError;

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, phone, company_name')
          .eq('id', customerId)
          .single();

        if (profileError) throw profileError;

        // Combine the data
        const combinedData: CustomerData = {
          ...relationshipData,
          ...profileData
        };

        setCustomer(combinedData);
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError('Failed to load customer data');
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId, supabase]);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStageBadge = (stage: string) => {
    const stageConfig = {
      'prospect': { color: 'bg-gray-100 text-gray-800', label: 'Prospect' },
      'lead': { color: 'bg-blue-100 text-blue-800', label: 'Lead' },
      'applicant': { color: 'bg-yellow-100 text-yellow-800', label: 'Applicant' },
      'customer': { color: 'bg-green-100 text-green-800', label: 'Customer' },
      'repeat_customer': { color: 'bg-purple-100 text-purple-800', label: 'Repeat Customer' },
      'at_risk': { color: 'bg-red-100 text-red-800', label: 'At Risk' },
      'churned': { color: 'bg-gray-100 text-gray-800', label: 'Churned' }
    };

    const config = stageConfig[stage as keyof typeof stageConfig] || stageConfig.prospect;
    return <Badge className={config.color}>{config.label}</Badge>;
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`bg-white shadow rounded-lg p-6 animate-pulse ${className}`}>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
        <div className="text-center text-red-600">
          {error || 'Customer not found'}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {customer.first_name?.[0]?.toUpperCase() || customer.last_name?.[0]?.toUpperCase() || 'C'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {customer.first_name} {customer.last_name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {customer.email}
            </p>
            {customer.phone && (
              <p className="text-sm text-gray-500 truncate">
                {customer.phone}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <Badge className={getHealthScoreColor(customer.relationship_score || 0)}>
            Health: {customer.relationship_score || 0}%
          </Badge>
          {getStageBadge(customer.relationship_stage)}
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Employment</h4>
          <p className="text-sm text-gray-900 mt-1">
            {customer.company_name || 'Not specified'}
          </p>
        </div>
        
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer Since</h4>
          <p className="text-sm text-gray-900 mt-1">
            {formatDate(customer.created_at)}
          </p>
        </div>
        
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Loans</h4>
          <p className="text-sm text-gray-900 mt-1">
            {customer.total_loans || 0}
          </p>
        </div>
        
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lifetime Value</h4>
          <p className="text-sm text-gray-900 mt-1">
            {customer.customer_lifetime_value ? formatCurrency(customer.customer_lifetime_value) : 'N/A'}
          </p>
        </div>
      </div>

      {customer.total_loans > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Borrowed:</span>
              <p className="font-medium">
                {customer.total_amount_borrowed ? formatCurrency(customer.total_amount_borrowed) : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Total Repaid:</span>
              <p className="font-medium">
                {customer.total_amount_repaid ? formatCurrency(customer.total_amount_repaid) : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Avg Loan:</span>
              <p className="font-medium">
                {customer.average_loan_amount ? formatCurrency(customer.average_loan_amount) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {customer.churn_probability && customer.churn_probability > 70 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                High Churn Risk
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>This customer has a {customer.churn_probability}% probability of churning.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showActions && (
        <div className="mt-6 flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.location.href = `/protected/admin/crm/customer/${customer.customer_id}`;
            }}
          >
            View Details
          </Button>
          <Button
            size="sm"
            onClick={() => {
              // Navigate to WhatsApp conversation or open messaging interface
              window.open(`https://wa.me/${customer.phone}`, '_blank');
            }}
          >
            Send Message
          </Button>
        </div>
      )}
    </div>
  );
};
