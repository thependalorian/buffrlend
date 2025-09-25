'use client';

// Icons will be imported when needed

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Application {
  id: string;
  application_id: string;
  user_id: string;
  loan_amount: number;
  loan_term: number;
  status: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  company_name?: string;
  relationship_stage?: string;
  health_score?: number;
}

interface CRMStats {
  total_applications: number;
  pending_review: number;
  kyc_pending: number;
  approved: number;
  declined: number;
  avg_processing_time: number;
}

export default function CRMDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const supabase = createClient();

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch applications with customer and company data
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('loan_applications')
        .select(`
          id,
          application_id,
          user_id,
          loan_amount,
          loan_term,
          status,
          created_at,
          updated_at,
          company_id,
          profiles!inner(
            first_name,
            last_name,
            email
          ),
          partner_companies(
            company_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (applicationsError) throw applicationsError;

      // Fetch customer relationship data
      const userIds = applicationsData?.map(app => app.user_id) || [];
      const { data: relationshipsData } = await supabase
        .from('customer_relationships')
        .select('customer_id, relationship_stage, relationship_score')
        .in('customer_id', userIds);

      // Combine the data
      const enrichedApplications = applicationsData?.map(app => ({
        id: app.id,
        application_id: app.application_id,
        user_id: app.user_id,
        loan_amount: app.loan_amount,
        loan_term: app.loan_term,
        status: app.status,
        created_at: app.created_at,
        updated_at: app.updated_at,
        user_name: app.profiles && Array.isArray(app.profiles) && app.profiles.length > 0 
          ? `${app.profiles[0].first_name} ${app.profiles[0].last_name}` 
          : 'Unknown User',
        user_email: app.profiles && Array.isArray(app.profiles) && app.profiles.length > 0 
          ? app.profiles[0].email 
          : '',
        company_name: app.partner_companies && Array.isArray(app.partner_companies) && app.partner_companies.length > 0 
          ? app.partner_companies[0].company_name 
          : '',
        relationship_stage: relationshipsData?.find(r => r.customer_id === app.user_id)?.relationship_stage,
        health_score: relationshipsData?.find(r => r.customer_id === app.user_id)?.relationship_score
      })) || [];

      // Filter by status if selected
      const filteredApplications = selectedStatus === 'all' 
        ? enrichedApplications 
        : enrichedApplications.filter(app => app.status === selectedStatus);

      setApplications(filteredApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedStatus]);

  const fetchCRMStats = useCallback(async () => {
    try {
      // Use the CRM analytics function we created
      const { error } = await supabase
        .rpc('get_crm_dashboard_metrics');

      if (error) throw error;

      // Get additional application stats
      const { data: applicationStats, error: appError } = await supabase
        .from('loan_applications')
        .select('status, created_at, updated_at');

      if (appError) throw appError;

      const stats: CRMStats = {
        total_applications: applicationStats?.length || 0,
        pending_review: applicationStats?.filter(app => app.status === 'under_review').length || 0,
        kyc_pending: applicationStats?.filter(app => app.status === 'submitted').length || 0,
        approved: applicationStats?.filter(app => app.status === 'approved').length || 0,
        declined: applicationStats?.filter(app => app.status === 'rejected').length || 0,
        avg_processing_time: 2.5 // This would be calculated from actual data
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching CRM stats:', error);
    }
  }, [supabase]);

  useEffect(() => {
    fetchApplications();
    fetchCRMStats();
  }, [selectedStatus, fetchApplications, fetchCRMStats]);

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

  const getRelationshipStageBadge = (stage?: string) => {
    if (!stage) return null;
    
    const stageConfig = {
      'prospect': { color: 'bg-gray-100 text-gray-600', label: 'Prospect' },
      'lead': { color: 'bg-blue-100 text-blue-600', label: 'Lead' },
      'applicant': { color: 'bg-yellow-100 text-yellow-600', label: 'Applicant' },
      'customer': { color: 'bg-green-100 text-green-600', label: 'Customer' },
      'repeat_customer': { color: 'bg-purple-100 text-purple-600', label: 'Repeat' },
      'at_risk': { color: 'bg-red-100 text-red-600', label: 'At Risk' }
    };

    const config = stageConfig[stage as keyof typeof stageConfig] || stageConfig.prospect;
    return <Badge className={`${config.color} text-xs`}>{config.label}</Badge>;
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

  const statusFilters = [
    { key: 'all', label: 'All Applications', count: stats?.total_applications || 0 },
    { key: 'submitted', label: 'KYC Pending', count: stats?.kyc_pending || 0 },
    { key: 'under_review', label: 'Under Review', count: stats?.pending_review || 0 },
    { key: 'approved', label: 'Approved', count: stats?.approved || 0 },
    { key: 'rejected', label: 'Declined', count: stats?.declined || 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
            <p className="text-gray-600">Unified Application Queue & Customer Management</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Export Data
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              New Campaign
            </Button>
          </div>
        </div>

        {/* CRM Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.total_applications}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">KYC Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats.kyc_pending}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Under Review</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.pending_review}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Avg. Processing</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.avg_processing_time}d</p>
            </Card>
          </div>
        )}

        {/* Status Filters */}
        <Card className="p-4">
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
        </Card>

        {/* Applications Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Application Queue</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={fetchApplications}>
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{app.user_name}</h3>
                        <p className="text-sm text-gray-600">{app.user_email}</p>
                      </div>
                      {getRelationshipStageBadge(app.relationship_stage)}
                      {app.health_score && (
                        <Badge className="bg-blue-100 text-blue-600">
                          Health: {app.health_score}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>App ID: {app.application_id}</span>
                      <span>Amount: {formatCurrency(app.loan_amount)}</span>
                      <span>Term: {app.loan_term} months</span>
                      {app.company_name && <span>Company: {app.company_name}</span>}
                      <span>Created: {formatDate(app.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(app.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate to application details
                        window.location.href = `/protected/admin/crm/customer/${app.user_id}`;
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate to customer 360 profile
                        window.location.href = `/protected/admin/crm/customer/${app.user_id}`;
                      }}
                    >
                      Customer 360
                    </Button>
                  </div>
                </div>
              ))}
              
              {applications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No applications found for the selected status.
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-lg">📊</span>
              <span>Analytics Dashboard</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-lg">👥</span>
              <span>Partner Management</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-lg">📧</span>
              <span>Communication Center</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
