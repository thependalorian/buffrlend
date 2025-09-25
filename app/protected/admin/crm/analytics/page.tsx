'use client';

// Icons will be imported when needed

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CRMLayout } from '@/components/layout/crm-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  total_customers: number;
  active_leads: number;
  pending_applications: number;
  active_customers: number;
  total_partners: number;
  active_partners: number;
  total_communications: number;
  whatsapp_messages_sent: number;
}



type TimeRange = '7d' | '30d' | '90d' | '1y';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const supabase = createClient();

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch CRM metrics
      const { data: metricsData, error: metricsError } = await supabase
        .rpc('get_crm_dashboard_metrics');

      if (metricsError) throw metricsError;

      setAnalyticsData(metricsData);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, fetchAnalyticsData]);

  const timeRangeFilters = [
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '90d', label: 'Last 90 Days' },
    { key: '1y', label: 'Last Year' }
  ];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into your CRM performance</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={fetchAnalyticsData}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button>
              Export Report
            </Button>
          </div>
        </div>

        {/* Time Range Filters */}
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            {timeRangeFilters.map((filter) => (
              <Button
                key={filter.key}
                variant={timeRange === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(filter.key as TimeRange)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Key Metrics */}
        {analyticsData && (
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
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.total_customers)}</p>
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
                  <h3 className="text-sm font-medium text-gray-500">Active Leads</h3>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.active_leads)}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.active_customers)}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.active_partners)}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Journey Funnel */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Journey Funnel</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Prospects</span>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData ? formatNumber(analyticsData.total_customers - analyticsData.active_customers - analyticsData.pending_applications) : 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-400 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Leads</span>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData ? formatNumber(analyticsData.active_leads) : 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Applicants</span>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData ? formatNumber(analyticsData.pending_applications) : 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Customers</span>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData ? formatNumber(analyticsData.active_customers) : 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </Card>

          {/* Communication Channels */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Channels</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>💬</span>
                  <span className="text-sm text-gray-600">WhatsApp</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData ? formatNumber(analyticsData.whatsapp_messages_sent) : 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>📧</span>
                  <span className="text-sm text-gray-600">Email</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData ? formatNumber(Math.floor(analyticsData.total_communications * 0.3)) : 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>📱</span>
                  <span className="text-sm text-gray-600">SMS</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData ? formatNumber(Math.floor(analyticsData.total_communications * 0.1)) : 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rates</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lead to Applicant</span>
                <span className="text-sm font-medium text-gray-900">65%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Applicant to Customer</span>
                <span className="text-sm font-medium text-gray-900">78%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer Retention</span>
                <span className="text-sm font-medium text-gray-900">85%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Times</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">WhatsApp Response</span>
                <span className="text-sm font-medium text-gray-900">2.3 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email Response</span>
                <span className="text-sm font-medium text-gray-900">4.2 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Application Review</span>
                <span className="text-sm font-medium text-gray-900">18 hours</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Partner Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Partnerships</span>
                <span className="text-sm font-medium text-gray-900">
                  {analyticsData ? formatNumber(analyticsData.active_partners) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Utilization</span>
                <span className="text-sm font-medium text-gray-900">42%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Partner Satisfaction</span>
                <span className="text-sm font-medium text-gray-900">4.2/5</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+12%</div>
              <div className="text-sm text-gray-500">New Customers</div>
              <div className="text-xs text-gray-400">vs last month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">+8%</div>
              <div className="text-sm text-gray-500">Communication Volume</div>
              <div className="text-xs text-gray-400">vs last month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">-5%</div>
              <div className="text-sm text-gray-500">Response Time</div>
              <div className="text-xs text-gray-400">vs last month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">+15%</div>
              <div className="text-sm text-gray-500">Partner Engagement</div>
              <div className="text-xs text-gray-400">vs last month</div>
            </div>
          </div>
        </Card>
      </div>
    </CRMLayout>
  );
}
