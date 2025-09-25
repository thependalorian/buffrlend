'use client';

// Icons will be imported when needed

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CRMLayout } from '@/components/layout/crm-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WhatsAppTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  approved: boolean;
  created_at: string;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger_event: string;
  enabled: boolean;
  created_at: string;
}

export default function SettingsPage() {
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>([]);
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'templates' | 'workflows' | 'integrations' | 'notifications'>('templates');

  const supabase = createClient();

  const fetchSettingsData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch WhatsApp templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (templatesError) throw templatesError;

      setWhatsappTemplates(templatesData || []);

      // Fetch automation workflows
      const { data: workflowsData, error: workflowsError } = await supabase
        .from('automation_workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (workflowsError) throw workflowsError;

      setAutomationWorkflows(workflowsData || []);

    } catch (error) {
      console.error('Error fetching settings data:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchSettingsData();
  }, [fetchSettingsData]);

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      'onboarding': { color: 'bg-blue-100 text-blue-800', label: 'Onboarding' },
      'application': { color: 'bg-yellow-100 text-yellow-800', label: 'Application' },
      'payment': { color: 'bg-green-100 text-green-800', label: 'Payment' },
      'marketing': { color: 'bg-purple-100 text-purple-800', label: 'Marketing' },
      'compliance': { color: 'bg-red-100 text-red-800', label: 'Compliance' }
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.onboarding;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tabs = [
    { key: 'templates', label: 'WhatsApp Templates', icon: '💬' },
    { key: 'workflows', label: 'Automation Workflows', icon: '⚙️' },
    { key: 'integrations', label: 'Integrations', icon: '🔗' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CRM Settings</h1>
            <p className="text-gray-600">Configure your CRM system settings and preferences</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={fetchSettingsData}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button>
              Save Changes
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <Card className="p-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.key as 'templates' | 'workflows' | 'integrations' | 'notifications')}
                className="flex items-center space-x-2"
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Tab Content */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">WhatsApp Templates</h2>
              <Button size="sm">
                Add Template
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </Card>
                ))
              ) : (
                whatsappTemplates.map((template) => (
                  <Card key={template.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                          {getCategoryBadge(template.category)}
                          {template.approved ? (
                            <Badge className="bg-green-100 text-green-800">Approved</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{template.content}</p>
                        <p className="text-xs text-gray-500">Created: {formatDate(template.created_at)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Test
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Automation Workflows</h2>
              <Button size="sm">
                Add Workflow
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </Card>
                ))
              ) : (
                automationWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{workflow.name}</h3>
                          {workflow.enabled ? (
                            <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{workflow.description}</p>
                        <p className="text-xs text-gray-500">
                          Trigger: {workflow.trigger_event} • Created: {formatDate(workflow.created_at)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Toggle workflow enabled status
                            console.log('Toggle workflow:', workflow.id);
                          }}
                        >
                          {workflow.enabled ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💬</span>
                    <h3 className="text-lg font-medium text-gray-900">WhatsApp Business API</h3>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Send automated messages and receive customer communications through WhatsApp.
                </p>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📧</span>
                    <h3 className="text-lg font-medium text-gray-900">Email Service</h3>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Send transactional emails and marketing campaigns to customers.
                </p>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📱</span>
                    <h3 className="text-lg font-medium text-gray-900">SMS Service</h3>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Send SMS notifications and alerts to customers.
                </p>
                <Button variant="outline" size="sm">
                  Setup
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🤖</span>
                    <h3 className="text-lg font-medium text-gray-900">AI Services</h3>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  AI-powered customer insights and automated responses.
                </p>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">New Application Alerts</h4>
                    <p className="text-sm text-gray-500">Get notified when new loan applications are submitted</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Payment Reminders</h4>
                    <p className="text-sm text-gray-500">Receive alerts for upcoming payment due dates</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">System Updates</h4>
                    <p className="text-sm text-gray-500">Notifications about system maintenance and updates</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dashboard Alerts</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">High Priority Applications</h4>
                    <p className="text-sm text-gray-500">Show alerts for applications requiring immediate attention</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Overdue Payments</h4>
                    <p className="text-sm text-gray-500">Display alerts for customers with overdue payments</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Partner Issues</h4>
                    <p className="text-sm text-gray-500">Alert for partner-related issues or concerns</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </CRMLayout>
  );
}
