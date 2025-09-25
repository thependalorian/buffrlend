'use client';

/**
 * Admin Email Controls Hook
 * 
 * React hook for managing admin manual email sending with conflict prevention
 * Founder: George Nekwaya (george@buffr.ai +12065308433)
 */

import { useState, useCallback } from 'react';

export interface EmailConflict {
  type: 'duplicate' | 'timing' | 'content' | 'frequency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendation: string;
  affectedRecipients?: string[];
  lastAutomatedEmail?: Date;
}

export interface ManualEmailRequest {
  id: string;
  adminId: string;
  adminName: string;
  emailType: 'partner_summary' | 'employee_confirmation' | 'authorization_request' | 'payment_reminder' | 'custom';
  recipients: {
    type: 'partner' | 'employee' | 'custom';
    ids: string[];
    emails: string[];
  };
  subject: string;
  content: {
    html: string;
    text: string;
  };
  scheduledFor?: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'sent' | 'failed';
  conflicts: EmailConflict[];
  createdAt: Date;
  approvedAt?: Date;
  sentAt?: Date;
}

export interface EmailQueueStatus {
  total: number;
  pending: number;
  sending: number;
  failed: number;
  manual: number;
  automated: number;
}

export interface UseAdminEmailControlsReturn {
  // State
  loading: boolean;
  error: string | null;
  pendingRequests: ManualEmailRequest[];
  queueStatus: EmailQueueStatus | null;
  adminActivity: Array<Record<string, unknown>>;

  // Actions
  submitManualEmailRequest: (request: Omit<ManualEmailRequest, 'id' | 'status' | 'conflicts' | 'createdAt'>) => Promise<ManualEmailRequest>;
  approveManualEmailRequest: (requestId: string, approverId: string, approverName: string) => Promise<void>;
  rejectManualEmailRequest: (requestId: string, approverId: string, reason: string) => Promise<void>;
  sendManualEmailImmediate: (request: Omit<ManualEmailRequest, 'id' | 'status' | 'conflicts' | 'createdAt'>, adminId: string) => Promise<void>;
  cancelManualEmail: (requestId: string, adminId: string, reason: string) => Promise<void>;
  loadPendingRequests: () => Promise<void>;
  loadQueueStatus: () => Promise<void>;
  loadAdminActivity: (adminId?: string) => Promise<void>;
}

export function useAdminEmailControls(): UseAdminEmailControlsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<ManualEmailRequest[]>([]);
  const [queueStatus, setQueueStatus] = useState<EmailQueueStatus | null>(null);
  const [adminActivity, setAdminActivity] = useState<Array<Record<string, unknown>>>([]);

  const handleApiCall = useCallback(async (
    apiCall: () => Promise<Response>,
    successMessage?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API call failed');
      }

      if (successMessage) {
        console.log(successMessage);
      }

      return data;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPendingRequests = useCallback(async (): Promise<void> => {
    const data = await handleApiCall(
      () => fetch('/api/admin/email/manual?action=pending_requests')
    );

    setPendingRequests(data.data);
  }, [handleApiCall]);

  const loadQueueStatus = useCallback(async (): Promise<void> => {
    const data = await handleApiCall(
      () => fetch('/api/admin/email/manual?action=queue_status')
    );

    setQueueStatus(data.data);
  }, [handleApiCall]);

  const submitManualEmailRequest = useCallback(async (request: Omit<ManualEmailRequest, 'id' | 'status' | 'conflicts' | 'createdAt'>): Promise<ManualEmailRequest> => {
    const data = await handleApiCall(
      () => fetch('/api/admin/email/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_request',
          ...request
        })
      }),
      'Manual email request submitted successfully'
    );

    // Refresh pending requests
    await loadPendingRequests();
    
    return data.data;
  }, [handleApiCall, loadPendingRequests]);

  const approveManualEmailRequest = useCallback(async (requestId: string, approverId: string, approverName: string): Promise<void> => {
    await handleApiCall(
      () => fetch('/api/admin/email/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve_request',
          requestId,
          approverId,
          approverName
        })
      }),
      'Manual email request approved successfully'
    );

    // Refresh pending requests and queue status
    await Promise.all([loadPendingRequests(), loadQueueStatus()]);
  }, [handleApiCall, loadPendingRequests, loadQueueStatus]);

  const rejectManualEmailRequest = useCallback(async (requestId: string, approverId: string, reason: string): Promise<void> => {
    await handleApiCall(
      () => fetch('/api/admin/email/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject_request',
          requestId,
          approverId,
          rejectionReason: reason
        })
      }),
      'Manual email request rejected successfully'
    );

    // Refresh pending requests
    await loadPendingRequests();
  }, [handleApiCall, loadPendingRequests]);

  const loadAdminActivity = useCallback(async (adminId?: string): Promise<void> => {
    const params = new URLSearchParams({ action: 'admin_activity' });
    if (adminId) params.append('adminId', adminId);

    const data = await handleApiCall(
      () => fetch(`/api/admin/email/manual?${params}`)
    );

    setAdminActivity(data.data);
  }, [handleApiCall]);

  const sendManualEmailImmediate = useCallback(async (request: Omit<ManualEmailRequest, 'id' | 'status' | 'conflicts' | 'createdAt'>, adminId: string): Promise<void> => {
    await handleApiCall(
      () => fetch('/api/admin/email/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_immediate',
          ...request,
          adminId
        })
      }),
      'Manual email sent immediately'
    );

    // Refresh queue status and admin activity
    await Promise.all([loadQueueStatus(), loadAdminActivity(adminId)]);
  }, [handleApiCall, loadQueueStatus, loadAdminActivity]);

  const cancelManualEmail = useCallback(async (requestId: string, adminId: string, reason: string): Promise<void> => {
    await handleApiCall(
      () => fetch('/api/admin/email/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel_request',
          requestId,
          adminId,
          rejectionReason: reason
        })
      }),
      'Manual email request cancelled successfully'
    );

    // Refresh pending requests and queue status
    await Promise.all([loadPendingRequests(), loadQueueStatus()]);
  }, [handleApiCall, loadPendingRequests, loadQueueStatus]);



  return {
    // State
    loading,
    error,
    pendingRequests,
    queueStatus,
    adminActivity,

    // Actions
    submitManualEmailRequest,
    approveManualEmailRequest,
    rejectManualEmailRequest,
    sendManualEmailImmediate,
    cancelManualEmail,
    loadPendingRequests,
    loadQueueStatus,
    loadAdminActivity
  };
}
