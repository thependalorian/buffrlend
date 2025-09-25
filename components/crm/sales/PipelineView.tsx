import { useState, useEffect } from 'react';
import { Deal, SalesPipeline } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Icons will be imported when needed

interface PipelineViewProps {
  pipeline: SalesPipeline;
  deals: Deal[];
  onDealUpdate?: (deal: Deal) => void;
  onDealCreate?: () => void;
}

interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number;
  color: string;
}

export function PipelineView({ 
  pipeline, 
  deals, 
  onDealUpdate, 
  onDealCreate 
}: PipelineViewProps) {
  const [stages, setStages] = useState<PipelineStage[]>([]);

  useEffect(() => {
    if (pipeline.stages && typeof pipeline.stages === 'object') {
      const pipelineStages = Array.isArray(pipeline.stages) 
        ? pipeline.stages 
        : Object.values(pipeline.stages);
      
      setStages(pipelineStages.map((stage: unknown, index: number) => ({
        id: (stage as { id?: string })?.id || `stage-${index}`,
        name: (stage as { name?: string })?.name || `Stage ${index + 1}`,
        order: (stage as { order?: number })?.order || index,
        probability: (stage as { probability?: number })?.probability || 0,
        color: (stage as { color?: string })?.color || getDefaultStageColor(index)
      })));
    }
  }, [pipeline.stages]);

  const getDefaultStageColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-yellow-100 text-yellow-800',
      'bg-orange-100 text-orange-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-red-100 text-red-800'
    ];
    return colors[index % colors.length];
  };

  const getDealsForStage = (stageId: string) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getTotalValue = (stageId: string) => {
    return getDealsForStage(stageId).reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  const getWeightedValue = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return 0;
    
    return getDealsForStage(stageId).reduce((sum, deal) => {
      return sum + ((deal.value || 0) * (deal.probability || 0) / 100);
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD'
    }).format(amount);
  };

  

  return (
    <div className="space-y-6">
      {/* Pipeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{pipeline.name}</h2>
          {pipeline.description && (
            <p className="text-gray-600">{pipeline.description}</p>
          )}
        </div>
        {onDealCreate && (
          <Button onClick={onDealCreate}>
            Add Deal
          </Button>
        )}
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.id);
          const totalValue = getTotalValue(stage.id);
          const weightedValue = getWeightedValue(stage.id);

          return (
            <Card key={stage.id} className="p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{stage.name}</h3>
                  <Badge className={stage.color}>
                    {stage.probability}%
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{stageDeals.length} deals</p>
                  <p>Total: {formatCurrency(totalValue)}</p>
                  <p>Weighted: {formatCurrency(weightedValue)}</p>
                </div>
              </div>

              {/* Deals in this stage */}
              <div className="space-y-2">
                {stageDeals.map((deal) => (
                  <Card key={deal.id} className="p-3 bg-gray-50">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {deal.name}
                        </h4>
                        {deal.probability && (
                          <Badge variant="outline" className="text-xs">
                            {deal.probability}%
                          </Badge>
                        )}
                      </div>
                      
                      {deal.value && (
                        <p className="text-sm font-medium text-gray-700">
                          {formatCurrency(deal.value)}
                        </p>
                      )}
                      
                      {deal.expected_close_date && (
                        <p className="text-xs text-gray-500">
                          Expected: {new Date(deal.expected_close_date).toLocaleDateString()}
                        </p>
                      )}
                      
                      {deal.assigned_to && (
                        <p className="text-xs text-gray-500">
                          Assigned to: {deal.assigned_to}
                        </p>
                      )}
                      
                      {deal.tags && deal.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {deal.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {deal.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{deal.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {onDealUpdate && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => onDealUpdate(deal)}
                        >
                          Update Deal
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
                
                {stageDeals.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No deals in this stage
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pipeline Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {deals.length}
            </p>
            <p className="text-sm text-gray-600">Total Deals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(deals.reduce((sum, deal) => sum + (deal.value || 0), 0))}
            </p>
            <p className="text-sm text-gray-600">Total Value</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(deals.reduce((sum, deal) => {
                return sum + ((deal.value || 0) * (deal.probability || 0) / 100);
              }, 0))}
            </p>
            <p className="text-sm text-gray-600">Weighted Value</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
