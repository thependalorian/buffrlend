'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CRMLayout } from '@/components/layout/crm-layout';
import { CustomerProfileCard } from '@/components/crm/customer-profile-card';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Customer {
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
  created_at: string;
  updated_at: string;
  // From profiles table
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const supabase = createClient();

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('customer_relationships')
        .select(`
          id,
          customer_id,
          relationship_stage,
          relationship_score,
          customer_lifetime_value,
          total_loans,
          total_amount_borrowed,
          total_amount_repaid,
          average_loan_amount,
          last_loan_date,
          next_loan_probability,
          churn_probability,
          satisfaction_score,
          created_at,
          updated_at,
          profiles!inner(
            first_name,
            last_name,
            email,
            phone,
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedStage !== 'all') {
        query = query.eq('relationship_stage', selectedStage);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformedData = data?.map(item => ({
        id: item.id,
        customer_id: item.customer_id,
        relationship_stage: item.relationship_stage,
        relationship_score: item.relationship_score,
        customer_lifetime_value: item.customer_lifetime_value,
        total_loans: item.total_loans,
        total_amount_borrowed: item.total_amount_borrowed,
        total_amount_repaid: item.total_amount_repaid,
        average_loan_amount: item.average_loan_amount,
        last_loan_date: item.last_loan_date,
        next_loan_probability: item.next_loan_probability,
        churn_probability: item.churn_probability,
        satisfaction_score: item.satisfaction_score,
        created_at: item.created_at,
        updated_at: item.updated_at,
        first_name: item.profiles && Array.isArray(item.profiles) && item.profiles.length > 0 ? item.profiles[0].first_name : '',
        last_name: item.profiles && Array.isArray(item.profiles) && item.profiles.length > 0 ? item.profiles[0].last_name : '',
        email: item.profiles && Array.isArray(item.profiles) && item.profiles.length > 0 ? item.profiles[0].email : '',
        phone: item.profiles && Array.isArray(item.profiles) && item.profiles.length > 0 ? item.profiles[0].phone : '',
        company_name: item.profiles && Array.isArray(item.profiles) && item.profiles.length > 0 ? item.profiles[0].company_name : ''
      })) || [];

      setCustomers(transformedData);

    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedStage]);

  useEffect(() => {
    fetchCustomers();
  }, [selectedStage, fetchCustomers]);

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

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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

  const columns = [
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      render: (value: unknown, row: Customer) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.first_name} {row.last_name}
          </div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'company_name',
      header: 'Employer',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-gray-900">
          {(value as string) || 'Not specified'}
        </span>
      )
    },
    {
      key: 'relationship_stage',
      header: 'Stage',
      sortable: true,
      render: (value: unknown) => getStageBadge(value as string)
    },
    {
      key: 'relationship_score',
      header: 'Health Score',
      sortable: true,
      render: (value: unknown) => (
        <Badge className={getHealthScoreColor((value as number) || 0)}>
          {(value as number) || 0}%
        </Badge>
      )
    },
    {
      key: 'total_loans',
      header: 'Loans',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-gray-900">
          {(value as number) || 0}
        </span>
      )
    },
    {
      key: 'customer_lifetime_value',
      header: 'Lifetime Value',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-gray-900">
          {(value as number) ? formatCurrency(value as number) : 'N/A'}
        </span>
      )
    },
    {
      key: 'created_at',
      header: 'Customer Since',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-gray-900">
          {formatDate(value as string)}
        </span>
      )
    }
  ];

  const stageFilters = [
    { key: 'all', label: 'All Customers' },
    { key: 'prospect', label: 'Prospects' },
    { key: 'lead', label: 'Leads' },
    { key: 'applicant', label: 'Applicants' },
    { key: 'customer', label: 'Customers' },
    { key: 'repeat_customer', label: 'Repeat Customers' },
    { key: 'at_risk', label: 'At Risk' },
    { key: 'churned', label: 'Churned' }
  ];

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600">Manage your customer relationships and track their journey</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={fetchCustomers}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button>
              Add Customer
            </Button>
          </div>
        </div>

        {/* Filters and View Controls */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              {stageFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={selectedStage === filter.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStage(filter.key)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">View:</span>
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
            </div>
          </div>
        </Card>

        {/* Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white shadow rounded-lg p-6 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              customers.map((customer) => (
                <CustomerProfileCard
                  key={customer.id}
                  customerId={customer.customer_id}
                  showActions={true}
                />
              ))
            )}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={customers}
            loading={loading}
            onRowClick={(row) => {
              window.location.href = `/protected/admin/crm/customer/${row.customer_id}`;
            }}
            emptyMessage="No customers found for the selected stage"
          />
        )}

        {/* Summary Stats */}
        {!loading && customers.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                <p className="text-sm text-gray-500">Total Customers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {customers.filter(c => c.relationship_stage === 'customer').length}
                </p>
                <p className="text-sm text-gray-500">Active Customers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(customers.reduce((sum, c) => sum + (c.customer_lifetime_value || 0), 0))}
                </p>
                <p className="text-sm text-gray-500">Total Lifetime Value</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {Math.round(customers.reduce((sum, c) => sum + (c.relationship_score || 0), 0) / customers.length)}%
                </p>
                <p className="text-sm text-gray-500">Avg Health Score</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </CRMLayout>
  );
}
