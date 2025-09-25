'use client';

// Icons will be imported when needed

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CRMLayout } from '@/components/layout/crm-layout';
import { PipelineView } from '@/components/crm/sales/PipelineView';
import { SalesPipeline, Deal } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SalesPage() {
  const [pipelines, setPipelines] = useState<SalesPipeline[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<SalesPipeline | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchPipelines = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sales_pipelines')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPipelines(data || []);
      
      // Set first pipeline as selected by default
      if (data && data.length > 0) {
        setSelectedPipeline(data[0]);
      }
    } catch (error) {
      console.error('Error fetching pipelines:', error);
    }
  }, [supabase]);

  const fetchDeals = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          contacts (
            first_name,
            last_name,
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPipelines();
    fetchDeals();
  }, [fetchPipelines, fetchDeals]);

  const handleDealUpdate = async (deal: Deal) => {
    // Update deal in database
    console.log('Update deal:', deal);
  };

  const handleDealCreate = () => {
    // Create new deal in database
    console.log('Create new deal');
  };

  const getPipelineStats = () => {
    if (!selectedPipeline) return null;

    const pipelineDeals = deals.filter(deal => deal.pipeline_id === selectedPipeline.id);
    const totalValue = pipelineDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const weightedValue = pipelineDeals.reduce((sum, deal) => {
      return sum + ((deal.value || 0) * (deal.probability || 0) / 100);
    }, 0);

    return {
      totalDeals: pipelineDeals.length,
      totalValue,
      weightedValue,
      closedDeals: pipelineDeals.filter(deal => deal.actual_close_date).length
    };
  };

  const stats = getPipelineStats();

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
            <p className="text-gray-600">Manage your sales opportunities and deals</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleDealCreate}>
              Add Deal
            </Button>
            <Button variant="outline">
              Create Pipeline
            </Button>
          </div>
        </div>

        {/* Pipeline Selector */}
        {pipelines.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Select Pipeline:
              </label>
              <select 
                value={selectedPipeline?.id || ''} 
                onChange={(e) => {
                  const pipeline = pipelines.find(p => p.id === e.target.value);
                  setSelectedPipeline(pipeline || null);
                }}
                className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a pipeline</option>
                {pipelines.map((pipeline) => (
                  <option key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        )}

        {/* Pipeline Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">📊</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Deals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDeals}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">💰</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('en-NA', {
                      style: 'currency',
                      currency: 'NAD'
                    }).format(stats.totalValue)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm font-medium">⚖️</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Weighted Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('en-NA', {
                      style: 'currency',
                      currency: 'NAD'
                    }).format(stats.weightedValue)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-sm font-medium">✅</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Closed Deals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.closedDeals}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Pipeline View */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading pipeline data...</p>
          </div>
        ) : selectedPipeline ? (
          <PipelineView
            pipeline={selectedPipeline}
            deals={deals.filter(deal => deal.pipeline_id === selectedPipeline.id)}
            onDealUpdate={handleDealUpdate}
            onDealCreate={handleDealCreate}
          />
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No active pipelines found</p>
            <Button onClick={() => console.log('Create pipeline')}>
              Create Your First Pipeline
            </Button>
          </Card>
        )}

        {/* Recent Deals */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deals</h3>
          <div className="space-y-4">
            {deals.slice(0, 5).map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{deal.name}</h4>
                  <p className="text-sm text-gray-600">
                    {deal.contact_id ? 'Contact available' : 'No contact info'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {deal.value ? new Intl.NumberFormat('en-NA', {
                      style: 'currency',
                      currency: 'NAD'
                    }).format(deal.value) : 'No value'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {deal.probability}% probability
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </CRMLayout>
  );
}
