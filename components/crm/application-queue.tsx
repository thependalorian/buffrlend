'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Application {
  id: string;
  customer_id: string;
  relationship_stage: string;
  relationship_score: number;
  created_at: string;
  updated_at: string;
  // From profiles table
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
}

interface ApplicationQueueProps {
  className?: string;
  limit?: number;
}

export const ApplicationQueue: React.FC<ApplicationQueueProps> = ({ 
  className = "",
  limit = 50
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0
  });

  const supabase = createClient();

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch customer relationships with profile data
      let query = supabase
        .from('customer_relationships')
        .select(`
          id,
          customer_id,
          relationship_stage,
          relationship_score,
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
        .order('created_at', { ascending: false })
        .limit(limit);

      // Apply status filter
      if (selectedStatus !== 'all') {
        query = query.eq('relationship_stage', selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to flatten the profile information
      const transformedData = data?.map(item => ({
        id: item.id,
        customer_id: item.customer_id,
        relationship_stage: item.relationship_stage,
        relationship_score: item.relationship_score,
        created_at: item.created_at,
        updated_at: item.updated_at,
        first_name: item.profiles?.[0]?.first_name,
        last_name: item.profiles?.[0]?.last_name,
        email: item.profiles?.[0]?.email,
        phone: item.profiles?.[0]?.phone,
        company_name: item.profiles?.[0]?.company_name
      })) || [];

      setApplications(transformedData);

      // Calculate stats
      const total = transformedData.length;
      const pending = transformedData.filter(app => app.relationship_stage === 'prospect').length;
      const under_review = transformedData.filter(app => app.relationship_stage === 'applicant').length;
      const approved = transformedData.filter(app => app.relationship_stage === 'customer').length;
      const rejected = transformedData.filter(app => app.relationship_stage === 'churned').length;

      setStats({ total, pending, under_review, approved, rejected });

    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, limit, selectedStatus]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getStatusBadge = (stage: string) => {
    const statusConfig = {
      'prospect': { color: 'bg-gray-100 text-gray-800', label: 'Prospect' },
      'lead': { color: 'bg-blue-100 text-blue-800', label: 'Lead' },
      'applicant': { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review' },
      'customer': { color: 'bg-green-100 text-green-800', label: 'Customer' },
      'repeat_customer': { color: 'bg-purple-100 text-purple-800', label: 'Repeat Customer' },
      'at_risk': { color: 'bg-red-100 text-red-800', label: 'At Risk' },
      'churned': { color: 'bg-gray-100 text-gray-800', label: 'Churned' }
    };

    const config = statusConfig[stage as keyof typeof statusConfig] || statusConfig.prospect;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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
      render: (value: unknown, row: Application) => (
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
          {String(value) || 'Not specified'}
        </span>
      )
    },
    {
      key: 'relationship_stage',
      header: 'Status',
      sortable: true,
      render: (value: unknown) => getStatusBadge(String(value))
    },
    {
      key: 'relationship_score',
      header: 'Health Score',
      sortable: true,
      render: (value: unknown) => (
        <Badge className={getHealthScoreColor(Number(value) || 0)}>
          {Number(value) || 0}%
        </Badge>
      )
    },
    {
      key: 'created_at',
      header: 'Applied',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-gray-900">
          {formatDate(String(value))}
        </span>
      )
    }
  ];

  const statusFilters = [
    { key: 'all', label: 'All Applications', count: stats.total },
    { key: 'prospect', label: 'Prospects', count: stats.pending },
    { key: 'applicant', label: 'Under Review', count: stats.under_review },
    { key: 'customer', label: 'Customers', count: stats.approved },
    { key: 'churned', label: 'Churned', count: stats.rejected }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Application Queue</h2>
          <p className="text-sm text-gray-600">Manage and review loan applications</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchApplications}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <Button
            key={filter.key}
            variant={selectedStatus === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus(filter.key)}
            className="flex items-center space-x-2"
          >
            <span>{filter.label}</span>
            <Badge variant="secondary" className="ml-1">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={applications}
        loading={loading}
        onRowClick={(row) => {
          window.location.href = `/protected/admin/crm/customer/${row.customer_id}`;
        }}
        emptyMessage="No applications found for the selected status"
      />

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            Send Bulk WhatsApp Message
          </Button>
          <Button size="sm" variant="outline">
            Generate Report
          </Button>
          <Button size="sm" variant="outline">
            Export to CSV
          </Button>
          <Button size="sm" variant="outline">
            Schedule Follow-ups
          </Button>
        </div>
      </div>
    </div>
  );
};
