'use client';

// Icons will be imported when needed

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CRMLayout } from '@/components/layout/crm-layout';
import { ApplicationQueue } from '@/components/crm/application-queue';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  total_customers: number;
  active_leads: number;
  pending_applications: number;
  active_customers: number;
  total_partners: number;
  active_partners: number;
  total_communications: number;
  whatsapp_messages_sent: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  customer_name?: string;
}

interface RecentCustomer {
  id: string;
  customer_id: string;
  relationship_stage: string;
  relationship_score: number;
  created_at: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  company_name?: string;
}

export default function CRMDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch CRM stats using the database function
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_crm_dashboard_metrics');

      if (statsError) throw statsError;

      setStats(statsData);

      // Fetch recent customers
      const { data: customersData, error: customersError } = await supabase
        .from('customer_relationships')
        .select(`
          id,
          customer_id,
          relationship_stage,
          relationship_score,
          created_at,
          profiles!inner(
            first_name,
            last_name,
            email,
            company_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (customersError) throw customersError;

      const transformedCustomers = customersData?.map(item => ({
        id: item.id,
        customer_id: item.customer_id,
        relationship_stage: item.relationship_stage,
        relationship_score: item.relationship_score,
        created_at: item.created_at,
        first_name: item.profiles && Array.isArray(item.profiles) && item.profiles.length > 0 ? item.profiles[0].first_name : '',
        last_name: item.profiles && Array.isArray(item.profiles) && item.profiles.length > 0 ? item.profiles[0].last_name : '',
        email: item.profiles && Array.isArray(item.profiles) && item.profiles.length > 0 ? item.profiles[0].email : '',
        company_name: item.profiles && Array.isArray(item.profiles) && item.profiles.length > 0 ? item.profiles[0].company_name : ''
      })) || [];

      setRecentCustomers(transformedCustomers);

      // Fetch recent activity from API
      try {
        const response = await fetch('/api/crm/activities/recent');
        if (response.ok) {
          const activities = await response.json();
          setRecentActivity(activities);
        } else {
          console.error('Failed to fetch recent activities');
          setRecentActivity([]);
        }
      } catch (error) {
        console.error('Error fetching recent activities:', error);
        setRecentActivity([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getActivityIcon = (type: string) => {
    const icons = {
      'application': '📋',
      'communication': '💬',
      'approval': '✅',
      'payment': '💰',
      'customer': '👤',
      'partner': '🤝'
    };
    return icons[type as keyof typeof icons] || '📝';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CRM Dashboard</h1>
            <p className="text-gray-600">Overview of your customer relationships and business metrics</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={fetchDashboardData}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button>
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_customers}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm font-medium">📋</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Pending Applications</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending_applications}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">✅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.active_customers}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-medium">🤝</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Active Partners</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.active_partners}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Queue */}
          <div className="lg:col-span-2">
            <ApplicationQueue limit={10} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-lg">{getActivityIcon(activity.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      {activity.customer_name && (
                        <p className="text-xs text-gray-500">{activity.customer_name}</p>
                      )}
                      <p className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Customers */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Customers</h3>
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {customer.first_name?.[0]?.toUpperCase() || 'C'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {customer.first_name} {customer.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {customer.company_name || 'No employer'}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        customer.relationship_stage === 'customer' ? 'bg-green-100 text-green-800' :
                        customer.relationship_stage === 'applicant' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.relationship_stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">📧</span>
                  Send Bulk WhatsApp Message
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">📊</span>
                  Generate Monthly Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">🤝</span>
                  Review Partner Performance
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">👥</span>
                  Add New Customer
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </CRMLayout>
  );
}
