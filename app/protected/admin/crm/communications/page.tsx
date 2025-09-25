'use client';

// Icons will be imported when needed

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CRMLayout } from '@/components/layout/crm-layout';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Communication {
  id: string;
  customer_id: string;
  channel: string;
  direction: string;
  message_type: string;
  subject?: string;
  message_content: string;
  status: string;
  response_received: boolean;
  created_at: string;
  updated_at: string;
  // From customer relationships
  customer_name?: string;
  customer_email?: string;
}

export default function CommunicationsPage() {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedDirection, setSelectedDirection] = useState<string>('all');

  const supabase = createClient();

  const fetchCommunications = useCallback(async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('communications')
        .select(`
          id,
          customer_id,
          channel,
          direction,
          message_type,
          subject,
          message_content,
          status,
          response_received,
          created_at,
          updated_at,
          customer_relationships!inner(
            customer_id,
            profiles!inner(
              first_name,
              last_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (selectedChannel !== 'all') {
        query = query.eq('channel', selectedChannel);
      }

      if (selectedDirection !== 'all') {
        query = query.eq('direction', selectedDirection);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformedData = data?.map(item => ({
        id: item.id,
        customer_id: item.customer_id,
        channel: item.channel,
        direction: item.direction,
        message_type: item.message_type,
        subject: item.subject,
        message_content: item.message_content,
        status: item.status,
        response_received: item.response_received,
        created_at: item.created_at,
        updated_at: item.updated_at,
        customer_name: (() => {
          const relationships = item.customer_relationships as unknown as { profiles?: Array<{ first_name?: string; last_name?: string; email?: string }> };
          return relationships?.profiles && Array.isArray(relationships.profiles) && relationships.profiles.length > 0
            ? `${relationships.profiles[0].first_name || ''} ${relationships.profiles[0].last_name || ''}`.trim()
            : 'Unknown Customer';
        })(),
        customer_email: (() => {
          const relationships = item.customer_relationships as unknown as { profiles?: Array<{ first_name?: string; last_name?: string; email?: string }> };
          return relationships?.profiles && Array.isArray(relationships.profiles) && relationships.profiles.length > 0
            ? relationships.profiles[0].email || ''
            : '';
        })()
      })) || [];

      setCommunications(transformedData);

    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedChannel, selectedDirection]);

  useEffect(() => {
    fetchCommunications();
  }, [selectedChannel, selectedDirection, fetchCommunications]);

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

  const getChannelBadge = (channel: string) => {
    const channelConfig = {
      'email': { color: 'bg-blue-100 text-blue-800', label: 'Email' },
      'whatsapp': { color: 'bg-green-100 text-green-800', label: 'WhatsApp' },
      'sms': { color: 'bg-yellow-100 text-yellow-800', label: 'SMS' },
      'phone': { color: 'bg-purple-100 text-purple-800', label: 'Phone' },
      'in_person': { color: 'bg-gray-100 text-gray-800', label: 'In Person' },
      'dashboard': { color: 'bg-indigo-100 text-indigo-800', label: 'Dashboard' }
    };

    const config = channelConfig[channel as keyof typeof channelConfig] || channelConfig.email;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getDirectionBadge = (direction: string) => {
    const directionConfig = {
      'inbound': { color: 'bg-green-100 text-green-800', label: 'Inbound' },
      'outbound': { color: 'bg-blue-100 text-blue-800', label: 'Outbound' }
    };

    const config = directionConfig[direction as keyof typeof directionConfig] || directionConfig.outbound;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'sent': { color: 'bg-green-100 text-green-800', label: 'Sent' },
      'delivered': { color: 'bg-blue-100 text-blue-800', label: 'Delivered' },
      'read': { color: 'bg-purple-100 text-purple-800', label: 'Read' },
      'failed': { color: 'bg-red-100 text-red-800', label: 'Failed' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
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

  const columns = [
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      render: (value: unknown, row: Communication) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.customer_name || 'Unknown'}
          </div>
          <div className="text-sm text-gray-500">{row.customer_email}</div>
        </div>
      )
    },
    {
      key: 'channel',
      header: 'Channel',
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center space-x-2">
          <span>{getChannelIcon(value as string)}</span>
          {getChannelBadge(value as string)}
        </div>
      )
    },
    {
      key: 'direction',
      header: 'Direction',
      sortable: true,
      render: (value: unknown) => getDirectionBadge(value as string)
    },
    {
      key: 'message_type',
      header: 'Type',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-gray-900 capitalize">
          {(value as string).replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'subject',
      header: 'Subject',
      sortable: true,
      render: (value: unknown, row: Communication) => (
        <div className="max-w-xs">
          <div className="font-medium text-gray-900 truncate">
            {(value as string) || row.message_type.replace('_', ' ')}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {row.message_content.substring(0, 50)}...
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value: unknown, row: Communication) => (
        <div className="flex items-center space-x-2">
          {getStatusBadge(value as string)}
          {row.response_received && (
            <Badge className="bg-green-100 text-green-800">Replied</Badge>
          )}
        </div>
      )
    },
    {
      key: 'created_at',
      header: 'Date',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-gray-900">
          {formatDate(value as string)}
        </span>
      )
    }
  ];

  const channelFilters = [
    { key: 'all', label: 'All Channels' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'email', label: 'Email' },
    { key: 'sms', label: 'SMS' },
    { key: 'phone', label: 'Phone' },
    { key: 'dashboard', label: 'Dashboard' }
  ];

  const directionFilters = [
    { key: 'all', label: 'All Directions' },
    { key: 'outbound', label: 'Outbound' },
    { key: 'inbound', label: 'Inbound' }
  ];

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
            <p className="text-gray-600">Track all customer communications across channels</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={fetchCommunications}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button>
              Send Message
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Channel:</span>
                {channelFilters.map((filter) => (
                  <Button
                    key={filter.key}
                    variant={selectedChannel === filter.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedChannel(filter.key)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Direction:</span>
              {directionFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={selectedDirection === filter.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDirection(filter.key)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Communications Table */}
        <DataTable
          columns={columns}
          data={communications}
          loading={loading}
          onRowClick={(row) => {
            // Open communication details modal
            console.log('View communication:', row.id);
          }}
          emptyMessage="No communications found for the selected filters"
        />

        {/* Summary Stats */}
        {!loading && communications.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{communications.length}</p>
                <p className="text-sm text-gray-500">Total Communications</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {communications.filter(c => c.direction === 'outbound').length}
                </p>
                <p className="text-sm text-gray-500">Outbound Messages</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {communications.filter(c => c.direction === 'inbound').length}
                </p>
                <p className="text-sm text-gray-500">Inbound Messages</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {communications.filter(c => c.response_received).length}
                </p>
                <p className="text-sm text-gray-500">With Responses</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </CRMLayout>
  );
}
