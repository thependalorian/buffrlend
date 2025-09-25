'use client';

// Icons will be imported when needed

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Partner {
  id: string;
  company_name: string;
  partnership_status: string;
  partnership_tier: string;
  total_employees: number;
  active_borrowers: number;
  utilization_rate: number;
  total_loans_disbursed: number;
  default_rate: number;
  created_at: string;
  health_score?: number;
  satisfaction_score?: number;
  last_contact_date?: string;
  revenue_contribution?: number;
}

interface PartnerStats {
  total_partners: number;
  active_partners: number;
  total_employees: number;
  total_active_borrowers: number;
  average_utilization: number;
  total_revenue: number;
}

export default function PartnersDashboard() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const supabase = createClient();

  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch partners with relationship data
      const { data: partnersData, error: partnersError } = await supabase
        .from('partner_companies')
        .select(`
          id,
          company_name,
          partnership_status,
          partnership_tier,
          total_employees,
          active_borrowers,
          total_loans_disbursed,
          default_rate,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (partnersError) throw partnersError;

      // Fetch partner relationship data
      const partnerIds = partnersData?.map(p => p.id) || [];
      const { data: relationshipsData } = await supabase
        .from('partner_relationships')
        .select('partner_id, health_score, satisfaction_score, last_contact_date, revenue_contribution')
        .in('partner_id', partnerIds);

      // Calculate utilization rates and combine data
      const enrichedPartners = partnersData?.map(partner => {
        const relationship = relationshipsData?.find(r => r.partner_id === partner.id);
        const utilizationRate = partner.total_employees > 0 
          ? (partner.active_borrowers / partner.total_employees) * 100 
          : 0;

        return {
          ...partner,
          utilization_rate: utilizationRate,
          health_score: relationship?.health_score,
          satisfaction_score: relationship?.satisfaction_score,
          last_contact_date: relationship?.last_contact_date,
          revenue_contribution: relationship?.revenue_contribution
        };
      }) || [];

      // Apply filters
      let filteredPartners = enrichedPartners;
      
      if (selectedTier !== 'all') {
        filteredPartners = filteredPartners.filter(p => p.partnership_tier === selectedTier);
      }
      
      if (selectedStatus !== 'all') {
        filteredPartners = filteredPartners.filter(p => p.partnership_status === selectedStatus);
      }

      setPartners(filteredPartners);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedTier, selectedStatus]);

  const fetchPartnerStats = useCallback(async () => {
    try {
      const { data: partnersData, error } = await supabase
        .from('partner_companies')
        .select('partnership_status, total_employees, active_borrowers, total_loans_disbursed');

      if (error) throw error;

      const stats: PartnerStats = {
        total_partners: partnersData?.length || 0,
        active_partners: partnersData?.filter(p => p.partnership_status === 'active').length || 0,
        total_employees: partnersData?.reduce((sum, p) => sum + (p.total_employees || 0), 0) || 0,
        total_active_borrowers: partnersData?.reduce((sum, p) => sum + (p.active_borrowers || 0), 0) || 0,
        average_utilization: 0, // This would be calculated
        total_revenue: partnersData?.reduce((sum, p) => sum + (p.total_loans_disbursed || 0), 0) || 0
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching partner stats:', error);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPartners();
    fetchPartnerStats();
  }, [selectedTier, selectedStatus, fetchPartners, fetchPartnerStats]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'prospective': { color: 'bg-gray-100 text-gray-800', label: 'Prospective' },
      'under_review': { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review' },
      'active': { color: 'bg-green-100 text-green-800', label: 'Active' },
      'suspended': { color: 'bg-red-100 text-red-800', label: 'Suspended' },
      'terminated': { color: 'bg-gray-100 text-gray-800', label: 'Terminated' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.prospective;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      'basic': { color: 'bg-blue-100 text-blue-800', label: 'Basic' },
      'premium': { color: 'bg-purple-100 text-purple-800', label: 'Premium' },
      'enterprise': { color: 'bg-gold-100 text-gold-800', label: 'Enterprise' }
    };

    const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.basic;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getHealthScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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

  const tierFilters = [
    { key: 'all', label: 'All Tiers' },
    { key: 'basic', label: 'Basic' },
    { key: 'premium', label: 'Premium' },
    { key: 'enterprise', label: 'Enterprise' }
  ];

  const statusFilters = [
    { key: 'all', label: 'All Status' },
    { key: 'active', label: 'Active' },
    { key: 'prospective', label: 'Prospective' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'suspended', label: 'Suspended' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partner Management</h1>
            <p className="text-gray-600">Manage partner relationships and performance</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Add Partner
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Export Report
            </Button>
          </div>
        </div>

        {/* Partner Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Partners</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.total_partners}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Active Partners</h3>
              <p className="text-2xl font-bold text-green-600">{stats.active_partners}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.total_employees.toLocaleString()}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Active Borrowers</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.total_active_borrowers}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Volume</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_revenue)}</p>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Partnership Tier</label>
              <div className="flex space-x-2">
                {tierFilters.map((filter) => (
                  <Button
                    key={filter.key}
                    variant={selectedTier === filter.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTier(filter.key)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <div className="flex space-x-2">
                {statusFilters.map((filter) => (
                  <Button
                    key={filter.key}
                    variant={selectedStatus === filter.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(filter.key)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Partners Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Partner Companies</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={fetchPartners}>
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
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{partner.company_name}</h3>
                      {getStatusBadge(partner.partnership_status)}
                      {getTierBadge(partner.partnership_tier)}
                      {partner.health_score && (
                        <Badge className={`${getHealthScoreColor(partner.health_score)} bg-opacity-20`}>
                          Health: {partner.health_score}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Employees:</span> {partner.total_employees}
                      </div>
                      <div>
                        <span className="font-medium">Active Borrowers:</span> {partner.active_borrowers}
                      </div>
                      <div>
                        <span className="font-medium">Utilization:</span> {partner.utilization_rate.toFixed(1)}%
                      </div>
                      <div>
                        <span className="font-medium">Default Rate:</span> {partner.default_rate.toFixed(1)}%
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Partner since: {formatDate(partner.created_at)}</span>
                      {partner.last_contact_date && (
                        <span>Last contact: {formatDate(partner.last_contact_date)}</span>
                      )}
                      {partner.revenue_contribution && (
                        <span>Revenue: {formatCurrency(partner.revenue_contribution)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate to partner details
                        window.location.href = `/protected/admin/crm/partners/${partner.id}`;
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate to partner performance
                        window.location.href = `/protected/admin/crm/partners/${partner.id}/performance`;
                      }}
                    >
                      Performance
                    </Button>
                  </div>
                </div>
              ))}
              
              {partners.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No partners found for the selected filters.
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-lg">📊</span>
              <span>Performance Analytics</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-lg">📧</span>
              <span>Partner Communications</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-lg">📋</span>
              <span>Onboarding Queue</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-lg">💰</span>
              <span>Revenue Reports</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
