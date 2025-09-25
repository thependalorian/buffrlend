/**
 * Admin Email Controls Service
 * 
 * Manages manual email sending by admins with conflict prevention and mitigation
 * Founder: George Nekwaya (george@buffr.ai +12065308433)
 */

import { createClient } from '@/lib/supabase/client';
import { BuffrLendEmailService } from './buffrlend-email-service';
import { PartnerEmailAutomationService } from './partner-email-automation';

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

export interface EmailQueueItem {
  id: string;
  emailType: string;
  recipientEmail: string;
  subject: string;
  scheduledFor: Date;
  priority: number;
  status: 'queued' | 'sending' | 'sent' | 'failed' | 'cancelled';
  attempts: number;
  lastAttempt?: Date;
  errorMessage?: string;
  isManual: boolean;
  adminId?: string;
}

export class AdminEmailControlsService {
  private emailService: BuffrLendEmailService;
  private automationService: PartnerEmailAutomationService;
  private supabase = createClient();

  constructor() {
    this.emailService = new BuffrLendEmailService();
    this.automationService = new PartnerEmailAutomationService();
  }

  /**
   * Check for potential conflicts before sending manual email
   */
  async checkEmailConflicts(request: Omit<ManualEmailRequest, 'id' | 'status' | 'conflicts' | 'createdAt'>): Promise<EmailConflict[]> {
    const conflicts: EmailConflict[] = [];

    try {
      // Check for recent automated emails to same recipients
      const recentEmails = await this.getRecentEmailsForRecipients(request.recipients.emails, 24); // Last 24 hours
      
      for (const email of recentEmails) {
        if (email.emailType === request.emailType) {
          conflicts.push({
            type: 'duplicate',
            severity: 'high',
            message: `Recent automated ${request.emailType} email sent to ${email.recipientEmail} at ${email.sentAt}`,
            recommendation: 'Consider delaying manual email or targeting different recipients',
            affectedRecipients: [email.recipientEmail],
            lastAutomatedEmail: email.sentAt
          });
        }
      }

      // Check for frequency violations
      const frequencyViolations = await this.checkFrequencyViolations(request.recipients.emails, request.emailType);
      conflicts.push(...frequencyViolations);

      // Check for timing conflicts with scheduled automation
      const timingConflicts = await this.checkTimingConflicts(request.scheduledFor, request.emailType);
      conflicts.push(...timingConflicts);

      // Check for content conflicts (similar subjects)
      const contentConflicts = await this.checkContentConflicts(request.subject, request.recipients.emails);
      conflicts.push(...contentConflicts);

    } catch (error) {
      console.error('Error checking email conflicts:', "Unknown error");
      conflicts.push({
        type: 'duplicate',
        severity: 'medium',
        message: 'Unable to check for conflicts due to system error',
        recommendation: 'Proceed with caution and monitor for duplicates'
      });
    }

    return conflicts;
  }

  /**
   * Submit manual email request for approval
   */
  async submitManualEmailRequest(request: Omit<ManualEmailRequest, 'id' | 'status' | 'conflicts' | 'createdAt'>): Promise<ManualEmailRequest> {
    try {
      // Check for conflicts
      const conflicts = await this.checkEmailConflicts(request);

      // Create manual email request
      const manualEmailRequest: ManualEmailRequest = {
        id: crypto.randomUUID(),
        ...request,
        status: 'pending',
        conflicts,
        createdAt: new Date()
      };

      // Save to database
      const { error } = await this.supabase
        .from('manual_email_requests')
        .insert({
          id: manualEmailRequest.id,
          admin_id: manualEmailRequest.adminId,
          admin_name: manualEmailRequest.adminName,
          email_type: manualEmailRequest.emailType,
          recipients: manualEmailRequest.recipients,
          subject: manualEmailRequest.subject,
          content: manualEmailRequest.content,
          scheduled_for: manualEmailRequest.scheduledFor?.toISOString(),
          priority: manualEmailRequest.priority,
          reason: manualEmailRequest.reason,
          status: manualEmailRequest.status,
          conflicts: manualEmailRequest.conflicts,
          created_at: manualEmailRequest.createdAt.toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save manual email request: ${error.message}`);
      }

      // Log admin action
      await this.logAdminAction(manualEmailRequest.adminId, 'manual_email_request_submitted', {
        requestId: manualEmailRequest.id,
        emailType: manualEmailRequest.emailType,
        recipientCount: manualEmailRequest.recipients.emails.length,
        conflicts: conflicts.length
      });

      return manualEmailRequest;

    } catch (error) {
      console.error('Error submitting manual email request:', "Unknown error");
      throw new Error("Unknown error");
    }
  }

  /**
   * Approve manual email request
   */
  async approveManualEmailRequest(requestId: string, approverId: string, approverName: string): Promise<void> {
    try {
      // Update request status
      const { error } = await this.supabase
        .from('manual_email_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approver_id: approverId,
          approver_name: approverName
        })
        .eq('id', requestId);

      if (error) {
        throw new Error(`Failed to approve manual email request: ${error.message}`);
      }

      // Get the approved request
      const { data: request } = await this.supabase
        .from('manual_email_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!request) {
        throw new Error('Manual email request not found');
      }

      // Queue the email for sending
      await this.queueManualEmail(request);

      // Log approval action
      await this.logAdminAction(approverId, 'manual_email_request_approved', {
        requestId,
        originalAdminId: request.admin_id,
        emailType: request.email_type
      });

    } catch (error) {
      console.error('Error approving manual email request:', "Unknown error");
      throw new Error("Unknown error");
    }
  }

  /**
   * Reject manual email request
   */
  async rejectManualEmailRequest(requestId: string, approverId: string, reason: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('manual_email_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          rejected_at: new Date().toISOString(),
          approver_id: approverId
        })
        .eq('id', requestId);

      if (error) {
        throw new Error(`Failed to reject manual email request: ${error.message}`);
      }

      // Log rejection action
      await this.logAdminAction(approverId, 'manual_email_request_rejected', {
        requestId,
        reason
      });

    } catch (error) {
      console.error('Error rejecting manual email request:', "Unknown error");
      throw new Error("Unknown error");
    }
  }

  /**
   * Send manual email immediately (bypass approval for urgent cases)
   */
  async sendManualEmailImmediate(request: Omit<ManualEmailRequest, 'id' | 'status' | 'conflicts' | 'createdAt'>, adminId: string): Promise<void> {
    try {
      // Check for critical conflicts only
      const conflicts = await this.checkEmailConflicts(request);
      const criticalConflicts = conflicts.filter(c => c.severity === 'critical');

      if (criticalConflicts.length > 0) {
        throw new Error(`Critical conflicts detected: ${criticalConflicts.map(c => c.message).join(', ')}`);
      }

      // Send emails immediately
      for (const email of request.recipients.emails) {
        await this.emailService.sendEmail({
          to: email,
          email_type: 'system_notification',
          template_variables: {
            subject: request.subject,
            html: request.content.html,
            text: request.content.text
          }
        });
      }

      // Log immediate send action
      await this.logAdminAction(adminId, 'manual_email_sent_immediate', {
        emailType: request.emailType,
        recipientCount: request.recipients.emails.length,
        conflicts: conflicts.length,
        reason: request.reason
      });

    } catch (error) {
      console.error('Error sending manual email immediately:', "Unknown error");
      throw new Error("Unknown error");
    }
  }

  /**
   * Get pending manual email requests
   */
  async getPendingManualEmailRequests(): Promise<ManualEmailRequest[]> {
    try {
      const { data, error } = await this.supabase
        .from('manual_email_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch pending requests: ${error.message}`);
      }

      return data?.map(this.mapDbToManualEmailRequest) || [];

    } catch (error) {
      console.error('Error fetching pending manual email requests:', "Unknown error");
      throw new Error("Unknown error");
    }
  }

  /**
   * Get email queue status
   */
  async getEmailQueueStatus(): Promise<{
    total: number;
    pending: number;
    sending: number;
    failed: number;
    manual: number;
    automated: number;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('email_queue')
        .select('status, is_manual');

      if (error) {
        throw new Error(`Failed to fetch queue status: ${error.message}`);
      }

      const stats = {
        total: data?.length || 0,
        pending: 0,
        sending: 0,
        failed: 0,
        manual: 0,
        automated: 0
      };

      data?.forEach(item => {
        if (item.status === 'queued') stats.pending++;
        if (item.status === 'sending') stats.sending++;
        if (item.status === 'failed') stats.failed++;
        if (item.is_manual) stats.manual++;
        else stats.automated++;
      });

      return stats;

    } catch (error) {
      console.error('Error fetching email queue status:', "Unknown error");
      throw new Error("Unknown error");
    }
  }

  /**
   * Cancel scheduled manual email
   */
  async cancelManualEmail(requestId: string, adminId: string, reason: string): Promise<void> {
    try {
      // Update request status
      const { error } = await this.supabase
        .from('manual_email_requests')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
          cancelled_by: adminId
        })
        .eq('id', requestId);

      if (error) {
        throw new Error(`Failed to cancel manual email request: ${error.message}`);
      }

      // Cancel any queued emails
      await this.supabase
        .from('email_queue')
        .update({ status: 'cancelled' })
        .eq('manual_request_id', requestId);

      // Log cancellation action
      await this.logAdminAction(adminId, 'manual_email_cancelled', {
        requestId,
        reason
      });

    } catch (error) {
      console.error('Error cancelling manual email:', "Unknown error");
      throw new Error("Unknown error");
    }
  }

  /**
   * Get admin email activity log
   */
  async getAdminEmailActivity(adminId?: string, limit: number = 50): Promise<any[]> {
    try {
      let query = this.supabase
        .from('admin_email_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (adminId) {
        query = query.eq('admin_id', adminId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch admin activity: ${error.message}`);
      }

      return data || [];

    } catch (error) {
      console.error('Error fetching admin email activity:', "Unknown error");
      throw new Error("Unknown error");
    }
  }

  // Private helper methods

  private async getRecentEmailsForRecipients(emails: string[], hoursBack: number): Promise<any[]> {
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
    
    const { data, error } = await this.supabase
      .from('email_notifications')
      .select('*')
      .in('recipient_email', emails)
      .gte('sent_at', since.toISOString())
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching recent emails:', "Unknown error");
      return [];
    }

    return data || [];
  }

  private async checkFrequencyViolations(emails: string[], _emailType: string): Promise<EmailConflict[]> {
    const conflicts: EmailConflict[] = [];
    
    // Check if any recipient has received more than 3 emails in the last 24 hours
    const recentCounts = await this.supabase
      .from('email_notifications')
      .select('recipient_email')
      .in('recipient_email', emails)
      .gte('sent_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const emailCounts = new Map<string, number>();
    recentCounts.data?.forEach(item => {
      emailCounts.set(item.recipient_email, (emailCounts.get(item.recipient_email) || 0) + 1);
    });

    emailCounts.forEach((count, email) => {
      if (count >= 3) {
        conflicts.push({
          type: 'frequency',
          severity: 'medium',
          message: `Recipient ${email} has received ${count} emails in the last 24 hours`,
          recommendation: 'Consider delaying this email to avoid overwhelming the recipient',
          affectedRecipients: [email]
        });
      }
    });

    return conflicts;
  }

  private async checkTimingConflicts(scheduledFor: Date | undefined, emailType: string): Promise<EmailConflict[]> {
    const conflicts: EmailConflict[] = [];

    if (!scheduledFor) return conflicts;

    // Check if there's a scheduled automation for the same time
    const { data: scheduledAutomation } = await this.supabase
      .from('scheduled_reminders')
      .select('*')
      .eq('reminder_type', emailType)
      .gte('scheduled_for', new Date(scheduledFor.getTime() - 30 * 60 * 1000).toISOString()) // 30 minutes before
      .lte('scheduled_for', new Date(scheduledFor.getTime() + 30 * 60 * 1000).toISOString()); // 30 minutes after

    if (scheduledAutomation && scheduledAutomation.length > 0) {
      conflicts.push({
        type: 'timing',
        severity: 'medium',
        message: `Scheduled automation for ${emailType} is planned around the same time`,
        recommendation: 'Consider adjusting the timing to avoid conflicts'
      });
    }

    return conflicts;
  }

  private async checkContentConflicts(subject: string, emails: string[]): Promise<EmailConflict[]> {
    const conflicts: EmailConflict[] = [];

    // Check for similar subjects in recent emails
    const { data: similarEmails } = await this.supabase
      .from('email_notifications')
      .select('subject, recipient_email, sent_at')
      .in('recipient_email', emails)
      .gte('sent_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

    similarEmails?.forEach(email => {
      const similarity = this.calculateStringSimilarity(subject.toLowerCase(), email.subject.toLowerCase());
      if (similarity > 0.8) {
        conflicts.push({
          type: 'content',
          severity: 'low',
          message: `Similar subject line sent to ${email.recipient_email} on ${email.sent_at}`,
          recommendation: 'Consider using a different subject line to avoid confusion',
          affectedRecipients: [email.recipient_email]
        });
      }
    });

    return conflicts;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private async queueManualEmail(request: any): Promise<void> {
    const queueItems = request.recipients.emails.map((email: string) => ({
      email_type: request.email_type,
      recipient_email: email,
      subject: request.subject,
      content: request.content,
      scheduled_for: request.scheduled_for || new Date().toISOString(),
      priority: this.getPriorityValue(request.priority),
      status: 'queued',
      is_manual: true,
      manual_request_id: request.id,
      admin_id: request.admin_id
    }));

    const { error } = await this.supabase
      .from('email_queue')
      .insert(queueItems);

    if (error) {
      throw new Error(`Failed to queue manual email: ${error.message}`);
    }
  }

  private getPriorityValue(priority: string): number {
    switch (priority) {
      case 'urgent': return 1;
      case 'high': return 2;
      case 'normal': return 3;
      case 'low': return 4;
      default: return 3;
    }
  }

  private async logAdminAction(adminId: string, action: string, details: any): Promise<void> {
    try {
      await this.supabase
        .from('admin_email_activity')
        .insert({
          admin_id: adminId,
          action,
          details,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging admin action:', "Unknown error");
    }
  }

  private mapDbToManualEmailRequest(data: any): ManualEmailRequest {
    return {
      id: data.id,
      adminId: data.admin_id,
      adminName: data.admin_name,
      emailType: data.email_type,
      recipients: data.recipients,
      subject: data.subject,
      content: data.content,
      scheduledFor: data.scheduled_for ? new Date(data.scheduled_for) : undefined,
      priority: data.priority,
      reason: data.reason,
      status: data.status,
      conflicts: data.conflicts || [],
      createdAt: new Date(data.created_at),
      approvedAt: data.approved_at ? new Date(data.approved_at) : undefined,
      sentAt: data.sent_at ? new Date(data.sent_at) : undefined
    };
  }
}
