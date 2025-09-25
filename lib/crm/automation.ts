/**
 * CRM Automation System
 * 
 * This module handles automated communications and workflows
 * based on customer actions and status changes.
 */

import { createClient } from '@/lib/supabase/client';

export class CRMAutomation {
  private getSupabaseClient = async () => await createClient();

  /**
   * Send automated welcome message to new customers
   */
  async sendWelcomeMessage(customerId: string) {
    try {
      const template = await this.getCommunicationTemplate('welcome');
      if (!template) return;

      const supabase = await this.getSupabaseClient();
      await supabase
        .from('communications')
        .insert({
          customer_id: customerId,
          channel: 'email',
          direction: 'outbound',
          message_type: 'welcome',
          subject: template.subject,
          message_content: template.content,
          status: 'sent',
          created_at: new Date().toISOString()
        });

      console.log(`Welcome message sent to customer ${customerId}`);
    } catch (error) {
      console.error('Error sending welcome message:', error);
    }
  }

  /**
   * Send application status update
   */
  async sendApplicationStatusUpdate(customerId: string, status: string, applicationId: string) {
    try {
      const template = await this.getStatusUpdateTemplate(status);
      if (!template) return;

      // Personalize the message
      const personalizedContent = template.content
        .replace('{application_id}', applicationId)
        .replace('{status}', status);

      const supabase = await this.getSupabaseClient();
      await supabase
        .from('communications')
        .insert({
          customer_id: customerId,
          channel: 'email',
          direction: 'outbound',
          message_type: 'application_update',
          subject: template.subject,
          message_content: personalizedContent,
          status: 'sent',
          created_at: new Date().toISOString()
        });

      console.log(`Status update sent to customer ${customerId} for application ${applicationId}`);
    } catch (error) {
      console.error('Error sending status update:', error);
    }
  }

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(customerId: string, loanId: string, dueDate: string, amount: number) {
    try {
      const template = await this.getCommunicationTemplate('payment_reminder');
      if (!template) return;

      const personalizedContent = template.content
        .replace('{due_date}', new Date(dueDate).toLocaleDateString())
        .replace('{amount}', amount.toString());

      const supabase = await this.getSupabaseClient();
      await supabase
        .from('communications')
        .insert({
          customer_id: customerId,
          channel: 'whatsapp',
          direction: 'outbound',
          message_type: 'payment_reminder',
          subject: template.subject,
          message_content: personalizedContent,
          status: 'sent',
          created_at: new Date().toISOString()
        });

      console.log(`Payment reminder sent to customer ${customerId}`);
    } catch (error) {
      console.error('Error sending payment reminder:', error);
    }
  }

  /**
   * Create follow-up task for loan officers
   */
  async createFollowUpTask(customerId: string, taskType: string, priority: string = 'medium') {
    try {
      const supabase = await this.getSupabaseClient();
      await supabase
        .from('tasks')
        .insert({
          customer_id: customerId,
          task_type: taskType,
          priority: priority,
          status: 'pending',
          due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
          created_at: new Date().toISOString()
        });

      console.log(`Follow-up task created for customer ${customerId}`);
    } catch (error) {
      console.error('Error creating follow-up task:', error);
    }
  }

  /**
   * Check for overdue applications and create tasks
   */
  async checkOverdueApplications() {
    try {
      // Find applications that have been in 'submitted' status for more than 24 hours
      const supabase = await this.getSupabaseClient();
      const { data: overdueApplications, error } = await supabase
        .from('loan_applications')
        .select('id, user_id, application_id, created_at')
        .eq('status', 'submitted')
        .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      for (const application of overdueApplications || []) {
        await this.createFollowUpTask(
          application.user_id,
          'kyc_review',
          'high'
        );
      }

      console.log(`Checked ${overdueApplications?.length || 0} overdue applications`);
    } catch (error) {
      console.error('Error checking overdue applications:', error);
    }
  }

  /**
   * Send customer satisfaction survey
   */
  async sendSatisfactionSurvey(customerId: string) {
    try {
      const template = await this.getCommunicationTemplate('satisfaction_survey');
      if (!template) return;

      const supabase = await this.getSupabaseClient();
      await supabase
        .from('communications')
        .insert({
          customer_id: customerId,
          channel: 'email',
          direction: 'outbound',
          message_type: 'satisfaction_survey',
          subject: template.subject,
          message_content: template.content,
          status: 'sent',
          created_at: new Date().toISOString()
        });

      console.log(`Satisfaction survey sent to customer ${customerId}`);
    } catch (error) {
      console.error('Error sending satisfaction survey:', error);
    }
  }

  /**
   * Get communication template by type
   */
  private async getCommunicationTemplate(templateType: string) {
    try {
      const supabase = await this.getSupabaseClient();
      const { data: template, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('template_type', templateType)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return template;
    } catch (error) {
      console.error(`Error getting template ${templateType}:`, error);
      return null;
    }
  }

  /**
   * Get status update template
   */
  private async getStatusUpdateTemplate(status: string) {
    const templates = {
      'submitted': {
        subject: 'Application Received',
        content: 'Thank you for submitting your loan application #{application_id}. We are now reviewing your documents and will notify you of the decision soon.'
      },
      'under_review': {
        subject: 'Application Under Review',
        content: 'Your loan application #{application_id} is now under review. Our team is carefully examining your documents and will provide an update shortly.'
      },
      'approved': {
        subject: 'Application Approved!',
        content: 'Congratulations! Your loan application #{application_id} has been approved. Funds will be disbursed to your account within 24 hours.'
      },
      'rejected': {
        subject: 'Application Update',
        content: 'We have reviewed your loan application #{application_id}. Unfortunately, we cannot approve it at this time. Please contact us for more information.'
      },
      'funded': {
        subject: 'Funds Disbursed',
        content: 'Your loan application #{application_id} has been funded successfully. The amount has been transferred to your account.'
      }
    };

    return templates[status as keyof typeof templates] || null;
  }

  /**
   * Run daily automation tasks
   */
  async runDailyAutomation() {
    try {
      console.log('Running daily CRM automation tasks...');

      // Check for overdue applications
      await this.checkOverdueApplications();

      // Send payment reminders for loans due tomorrow
      await this.sendPaymentRemindersForTomorrow();

      // Send satisfaction surveys for recently completed loans
      await this.sendSatisfactionSurveysForCompletedLoans();

      console.log('Daily CRM automation tasks completed');
    } catch (error) {
      console.error('Error running daily automation:', error);
    }
  }

  /**
   * Send payment reminders for loans due tomorrow
   */
  private async sendPaymentRemindersForTomorrow() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      // This would query active loans due tomorrow
      // For now, we'll just log the action
      console.log(`Checking for payment reminders due on ${tomorrowStr}`);
    } catch (error) {
      console.error('Error sending payment reminders:', error);
    }
  }

  /**
   * Send satisfaction surveys for recently completed loans
   */
  private async sendSatisfactionSurveysForCompletedLoans() {
    try {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

      // This would query recently completed loans
      // For now, we'll just log the action
      console.log(`Checking for satisfaction surveys for loans completed after ${threeDaysAgo}`);
    } catch (error) {
      console.error('Error sending satisfaction surveys:', error);
    }
  }
}

// Export singleton instance
export const crmAutomation = new CRMAutomation();
