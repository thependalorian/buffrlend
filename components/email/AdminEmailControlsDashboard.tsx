'use client';

/**
 * Admin Email Controls Dashboard Component
 * 
 * Dashboard for managing admin manual email sending with conflict prevention
 * Founder: George Nekwaya (george@buffr.ai +12065308433)
 */

import { useState, useEffect } from 'react';
import { useAdminEmailControls, EmailConflict, ManualEmailRequest } from '@/lib/hooks/useAdminEmailControls';
// Icons will be imported when needed

interface AdminUser {
  id: string;
  name: string;
  role: 'admin' | 'super_admin';
}

export default function AdminEmailControlsDashboard() {
  const {
    loading,
    error,
    pendingRequests,
    queueStatus,
    adminActivity,
    submitManualEmailRequest,
    approveManualEmailRequest,
    rejectManualEmailRequest,
    sendManualEmailImmediate,
    cancelManualEmail,
    loadPendingRequests,
    loadQueueStatus,
    loadAdminActivity
  } = useAdminEmailControls();

  const [currentAdmin] = useState<AdminUser>({
    id: 'admin-1',
    name: 'Admin User',
    role: 'admin'
  });

  const [activeTab, setActiveTab] = useState<'send' | 'approve' | 'monitor'>('send');
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflicts, setConflicts] = useState<EmailConflict[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ManualEmailRequest | null>(null);

  // Form state for manual email sending
  const [emailForm, setEmailForm] = useState({
    emailType: 'custom' as const,
    recipients: {
      type: 'custom' as const,
      ids: [] as string[],
      emails: [] as string[]
    },
    subject: '',
    content: {
      html: '',
      text: ''
    },
    scheduledFor: '',
    priority: 'normal' as const,
    reason: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadPendingRequests();
    loadQueueStatus();
    loadAdminActivity();
  }, [loadPendingRequests, loadQueueStatus, loadAdminActivity]);

  const handleSubmitEmailRequest = async () => {
    try {
      const request = await submitManualEmailRequest({
        adminId: currentAdmin.id,
        adminName: currentAdmin.name,
        ...emailForm,
        scheduledFor: emailForm.scheduledFor ? new Date(emailForm.scheduledFor) : undefined
      });

      // Check for conflicts
      if (request.conflicts.length > 0) {
        setConflicts(request.conflicts);
        setShowConflictModal(true);
      } else {
        alert('Email request submitted successfully!');
        resetForm();
      }
    } catch {
      alert('Failed to submit email request');
    }
  };

  const handleSendImmediate = async () => {
    try {
      await sendManualEmailImmediate({
        adminId: currentAdmin.id,
        adminName: currentAdmin.name,
        ...emailForm,
        scheduledFor: emailForm.scheduledFor ? new Date(emailForm.scheduledFor) : undefined
      }, currentAdmin.id);

      alert('Email sent immediately!');
      resetForm();
    } catch {
      alert('Failed to send email immediately');
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      await approveManualEmailRequest(requestId, currentAdmin.id, currentAdmin.name);
      alert('Request approved successfully!');
    } catch {
      alert('Failed to approve request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      try {
        await rejectManualEmailRequest(requestId, currentAdmin.id, reason);
        alert('Request rejected successfully!');
      } catch {
        alert('Failed to reject request');
      }
    }
  };

  const _handleCancelRequest = async (requestId: string) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (reason) {
      try {
        await cancelManualEmail(requestId, currentAdmin.id, reason);
        alert('Request cancelled successfully!');
      } catch {
        alert('Failed to cancel request');
      }
    }
  };

  const resetForm = () => {
    setEmailForm({
      emailType: 'custom',
      recipients: {
        type: 'custom',
        ids: [],
        emails: []
      },
      subject: '',
      content: {
        html: '',
        text: ''
      },
      scheduledFor: '',
      priority: 'normal',
      reason: ''
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Email Controls Dashboard
        </h1>
        <p className="text-gray-600">
          Manage manual email sending with conflict prevention and approval workflows
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Queue Status Overview */}
      {queueStatus && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{queueStatus.total}</div>
            <div className="text-sm text-gray-600">Total Queue</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{queueStatus.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{queueStatus.sending}</div>
            <div className="text-sm text-gray-600">Sending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{queueStatus.failed}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{queueStatus.manual}</div>
            <div className="text-sm text-gray-600">Manual</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{queueStatus.automated}</div>
            <div className="text-sm text-gray-600">Automated</div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'send', label: 'Send Manual Email', icon: '📧' },
            { id: 'approve', label: 'Approve Requests', icon: '✅' },
            { id: 'monitor', label: 'Monitor Activity', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'send' | 'approve' | 'monitor')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Send Manual Email Tab */}
      {activeTab === 'send' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Send Manual Email
          </h2>

          <div className="space-y-6">
            {/* Email Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Type
              </label>
              <select
                value={emailForm.emailType}
                onChange={(e) => setEmailForm({ ...emailForm, emailType: e.target.value as 'custom' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="custom">Custom Email</option>
                <option value="partner_summary">Partner Summary</option>
                <option value="employee_confirmation">Employee Confirmation</option>
                <option value="authorization_request">Authorization Request</option>
                <option value="payment_reminder">Payment Reminder</option>
              </select>
            </div>

            {/* Recipients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients (comma-separated emails)
              </label>
              <input
                type="text"
                value={emailForm.recipients.emails.join(', ')}
                onChange={(e) => setEmailForm({
                  ...emailForm,
                  recipients: {
                    ...emailForm.recipients,
                    emails: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                  }
                })}
                placeholder="email1@example.com, email2@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                placeholder="Email subject line"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTML Content
              </label>
              <textarea
                value={emailForm.content.html}
                onChange={(e) => setEmailForm({
                  ...emailForm,
                  content: { ...emailForm.content, html: e.target.value }
                })}
                rows={8}
                placeholder="HTML email content"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Priority and Scheduling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={emailForm.priority}
                  onChange={(e) => setEmailForm({ ...emailForm, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule For (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={emailForm.scheduledFor}
                  onChange={(e) => setEmailForm({ ...emailForm, scheduledFor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Manual Email
              </label>
              <textarea
                value={emailForm.reason}
                onChange={(e) => setEmailForm({ ...emailForm, reason: e.target.value })}
                rows={3}
                placeholder="Explain why this manual email is necessary"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleSubmitEmailRequest}
                disabled={loading || !emailForm.subject || !emailForm.content.html || !emailForm.reason}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit for Approval'}
              </button>

              <button
                onClick={handleSendImmediate}
                disabled={loading || !emailForm.subject || !emailForm.content.html || !emailForm.reason}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Immediately (Urgent)'}
              </button>

              <button
                onClick={resetForm}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Requests Tab */}
      {activeTab === 'approve' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Email Requests ({pendingRequests.length})
          </h2>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending email requests
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{request.subject}</h3>
                      <p className="text-sm text-gray-600">
                        By {request.adminName} • {request.emailType} • {request.priority} priority
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <p><strong>Recipients:</strong> {request.recipients.emails.join(', ')}</p>
                    <p><strong>Reason:</strong> {request.reason}</p>
                    {request.scheduledFor && (
                      <p><strong>Scheduled:</strong> {new Date(request.scheduledFor).toLocaleString()}</p>
                    )}
                  </div>

                  {request.conflicts.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">⚠️ Conflicts Detected:</h4>
                      <div className="space-y-2">
                        {request.conflicts.map((conflict, index) => (
                          <div key={index} className={`p-2 rounded border ${getSeverityColor(conflict.severity)}`}>
                            <p className="text-sm font-medium">{conflict.message}</p>
                            <p className="text-xs mt-1">{conflict.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveRequest(request.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowConflictModal(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Monitor Activity Tab */}
      {activeTab === 'monitor' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Admin Email Activity
          </h2>

          {adminActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No admin activity recorded
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminActivity.map((activity, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {String(activity.admin_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {String(activity.action).replace(/_/g, ' ')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {JSON.stringify(activity.details)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(String(activity.created_at)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Conflict Modal */}
      {showConflictModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Email Conflicts Detected
              </h3>
              
              <div className="space-y-3 mb-4">
                {conflicts.map((conflict, index) => (
                  <div key={index} className={`p-3 rounded border ${getSeverityColor(conflict.severity)}`}>
                    <p className="font-medium">{conflict.message}</p>
                    <p className="text-sm mt-1">{conflict.recommendation}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConflictModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConflictModal(false);
                    alert('Email request submitted with conflicts noted');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Proceed Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
