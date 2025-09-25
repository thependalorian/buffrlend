/**
 * WhatsApp Management Dashboard
 * 
 * This page provides a comprehensive dashboard for managing WhatsApp Business API
 * including message sending, template management, analytics, and customer communications.
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Send, 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Phone
} from 'lucide-react';


interface Template {
  id: string;
  name: string;
  category: string;
  language: string;
  components: Array<{ type: string; text: string; }>;
  status: string;
}

interface WhatsAppMessage {
  id: string;
  to: string;
  body: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  templateName?: string;
  customerId?: string;
}

interface Analytics {
  total: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  deliveryRate: number;
  readRate: number;
  failureRate: number;
}

export default function WhatsAppDashboard() {
  const [messages] = useState<WhatsAppMessage[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [sendForm, setSendForm] = useState({
    to: '',
    message: '',
    templateName: '',
    parameters: {}
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load templates
      const templatesResponse = await fetch('/api/whatsapp/templates');
      const templatesData = await templatesResponse.json();
      if (templatesData.success) {
        setTemplates(templatesData.data);
      }

      // Load analytics
      const analyticsResponse = await fetch('/api/whatsapp/analytics');
      const analyticsData = await analyticsResponse.json();
      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!sendForm.to || (!sendForm.message && !sendForm.templateName)) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendForm),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Message sent successfully!');
        setSendForm({ to: '', message: '', templateName: '', parameters: {} });
        loadData(); // Refresh data
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'read':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'default',
      delivered: 'secondary',
      read: 'default',
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">WhatsApp Management</h1>
          <p className="text-muted-foreground">
            Manage WhatsApp Business API communications and analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            WhatsApp Business API
          </span>
        </div>
      </div>

      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">Send Message</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">Message History</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Send WhatsApp Message</span>
              </CardTitle>
              <CardDescription>
                Send a message using a template or custom text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="to">Phone Number</Label>
                  <Input
                    id="to"
                    placeholder="+264 81 123 4567"
                    value={sendForm.to}
                    onChange={(e) => setSendForm({ ...sendForm, to: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template">Template (Optional)</Label>
                  <Select
                    value={sendForm.templateName}
                    onChange={(e) => setSendForm({ ...sendForm, templateName: e.target.value })}
                    options={[{ value: '', label: 'Select a template' }, { value: 'template1', label: 'Template 1' }, { value: 'template2', label: 'Template 2' }]} // Placeholder options
                  >
                    {/* <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger> */}
                    {/* The Select component from components/ui/select.tsx does not use children for options, it expects an options prop */}
                    {/* Remove SelectTrigger, SelectValue, SelectContent, SelectItem if using the simple Select component */}
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message here..."
                  value={sendForm.message}
                  onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                  rows={4}
                />
              </div>

              <Button 
                onClick={sendMessage} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Message Templates</span>
              </CardTitle>
              <CardDescription>
                Manage WhatsApp message templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant={template.status === 'APPROVED' ? 'default' : 'secondary'}>
                        {template.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Category: {template.category} | Language: {template.language}
                    </p>

                    <div className="text-sm">
                      {typeof template.components === 'string' ? 
                        JSON.parse(template.components).map((component: { type: string; text: string; }, index: number) => (
                          <div key={index} className="mb-1">
                            <strong>{component.type}:</strong> {component.text}
                          </div>
                        ))
                        : template.components && template.components.map((component, index) => (
                        <div key={index} className="mb-1">
                          <strong>{component.type}:</strong> {component.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.deliveryRate.toFixed(1)}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Read Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.readRate.toFixed(1)}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failure Rate</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.failureRate.toFixed(1)}%</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Message Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{analytics.sent}</div>
                      <div className="text-sm text-muted-foreground">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{analytics.delivered}</div>
                      <div className="text-sm text-muted-foreground">Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">{analytics.read}</div>
                      <div className="text-sm text-muted-foreground">Read</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{analytics.failed}</div>
                      <div className="text-sm text-muted-foreground">Failed</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No analytics data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Message History</span>
              </CardTitle>
              <CardDescription>
                Recent WhatsApp messages and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(message.status)}
                          <span className="font-medium">{message.to}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(message.status)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {message.templateName && (
                          <Badge variant="outline" className="mr-2">
                            {message.templateName}
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm">{message.body}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No messages found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
