/**
 * WhatsApp Automated Messaging Workflows
 * 
 * This module contains automated messaging workflows for customer communications
 * including onboarding, loan updates, payment reminders, and customer support.
 */

import { whatsappService } from '@/lib/integrations/whatsapp/whatsapp-service';
import { createClient } from '@/lib/supabase/client';

// Initialize Supabase client
const supabase = createClient(
);

export interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  loanId?: string;
  loanAmount?: number;
  loanTerm?: number;
  nextPaymentDate?: Date;
  nextPaymentAmount?: number;
}

export interface WorkflowTrigger {
  type: 'loan_application' | 'loan_approved' | 'loan_disbursed' | 'payment_due' | 'payment_overdue' | 'kyc_required' | 'welcome';
  customerId: string;
  loanId?: string;
  data?: Record<string, unknown>;
}

export class WhatsAppWorkflows {
  /**
   * Customer Onboarding Workflow
   * Sends welcome message and guides new customers through the process
   */
  static async customerOnboarding(customerData: CustomerData): Promise<void> {
    try {
      // Send welcome message
      await whatsappService.sendTemplateMessage(
        customerData.phoneNumber,
        'welcome_template',
        {
          '1': customerData.firstName,
          '2': customerData.loanId || 'pending'
        },
        customerData.id,
        customerData.loanId
      );

      // Log workflow execution
      await this.logWorkflowExecution('customer_onboarding', customerData.id, {
        message: 'Welcome message sent',
        customerName: `${customerData.firstName} ${customerData.lastName}`
      });

    } catch (error) {
      console.error('Error in customer onboarding workflow:', error);
      await this.logWorkflowError('customer_onboarding', customerData.id, error);
    }
  }

  /**
   * Loan Approval Workflow
   * Notifies customers when their loan is approved
   */
  static async loanApproval(customerData: CustomerData): Promise<void> {
    try {
      await whatsappService.sendTemplateMessage(
        customerData.phoneNumber,
        'loan_approved',
        {
          '1': customerData.firstName,
          '2': customerData.loanAmount?.toString() || '0',
          '3': customerData.loanTerm?.toString() || '0'
        },
        customerData.id,
        customerData.loanId
      );

      await this.logWorkflowExecution('loan_approval', customerData.id, {
        message: 'Loan approval notification sent',
        loanAmount: customerData.loanAmount,
        loanTerm: customerData.loanTerm
      });

    } catch (error) {
      console.error('Error in loan approval workflow:', error);
      await this.logWorkflowError('loan_approval', customerData.id, error);
    }
  }

  /**
   * Loan Disbursement Workflow
   * Notifies customers when loan funds are disbursed
   */
  static async loanDisbursement(customerData: CustomerData): Promise<void> {
    try {
      await whatsappService.sendTemplateMessage(
        customerData.phoneNumber,
        'loan_disbursed',
        {
          '1': customerData.firstName,
          '2': customerData.loanAmount?.toString() || '0',
          '3': customerData.nextPaymentAmount?.toString() || '0',
          '4': customerData.nextPaymentDate?.toLocaleDateString() || 'TBD'
        },
        customerData.id,
        customerData.loanId
      );

      await this.logWorkflowExecution('loan_disbursement', customerData.id, {
        message: 'Loan disbursement notification sent',
        disbursedAmount: customerData.loanAmount,
        nextPaymentAmount: customerData.nextPaymentAmount,
        nextPaymentDate: customerData.nextPaymentDate
      });

    } catch (error) {
      console.error('Error in loan disbursement workflow:', error);
      await this.logWorkflowError('loan_disbursement', customerData.id, error);
    }
  }

  /**
   * Payment Reminder Workflow
   * Sends payment reminders before due date
   */
  static async paymentReminder(customerData: CustomerData): Promise<void> {
    try {
      await whatsappService.sendTemplateMessage(
        customerData.phoneNumber,
        'payment_reminder',
        {
          '1': customerData.firstName,
          '2': customerData.nextPaymentAmount?.toString() || '0',
          '3': customerData.nextPaymentDate?.toLocaleDateString() || 'TBD'
        },
        customerData.id,
        customerData.loanId
      );

      await this.logWorkflowExecution('payment_reminder', customerData.id, {
        message: 'Payment reminder sent',
        paymentAmount: customerData.nextPaymentAmount,
        dueDate: customerData.nextPaymentDate
      });

    } catch (error) {
      console.error('Error in payment reminder workflow:', error);
      await this.logWorkflowError('payment_reminder', customerData.id, error);
    }
  }

  /**
   * KYC Verification Workflow
   * Sends KYC verification reminders
   */
  static async kycVerification(customerData: CustomerData): Promise<void> {
    try {
      await whatsappService.sendTemplateMessage(
        customerData.phoneNumber,
        'kyc_verification',
        {
          '1': customerData.firstName
        },
        customerData.id,
        customerData.loanId
      );

      await this.logWorkflowExecution('kyc_verification', customerData.id, {
        message: 'KYC verification reminder sent'
      });

    } catch (error) {
      console.error('Error in KYC verification workflow:', error);
      await this.logWorkflowError('kyc_verification', customerData.id, error);
    }
  }

  /**
   * Customer Support Workflow
   * Provides automated support responses
   */
  static async customerSupport(phoneNumber: string, message: string): Promise<void> {
    try {
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
        await whatsappService.sendTextMessage(
          phoneNumber,
          'Hello! How can we help you today? You can:\n\n1. Check your loan status\n2. Make a payment\n3. Update your information\n4. Speak to support\n\nPlease reply with the number of your choice.'
        );
      } else if (lowerMessage.includes('status') || lowerMessage.includes('1')) {
        await whatsappService.sendTextMessage(
          phoneNumber,
          'To check your loan status, please provide your loan reference number or ID number.'
        );
      } else if (lowerMessage.includes('payment') || lowerMessage.includes('2')) {
        await whatsappService.sendTextMessage(
          phoneNumber,
          'To make a payment, please ensure you have sufficient funds in your account. Payments are automatically deducted on the due date.'
        );
      } else if (lowerMessage.includes('update') || lowerMessage.includes('3')) {
        await whatsappService.sendTextMessage(
          phoneNumber,
          'To update your information, please log in to your account on our website or mobile app, or contact our support team.'
        );
      } else if (lowerMessage.includes('support') || lowerMessage.includes('4')) {
        await whatsappService.sendTextMessage(
          phoneNumber,
          'Our support team is available Monday to Friday, 8 AM to 5 PM. You can also email us at support@buffr.ai or call +264 61 123 4567.'
        );
      } else {
        await whatsappService.sendTextMessage(
          phoneNumber,
          'Thank you for your message. Our team will get back to you shortly. For immediate assistance, please call our support line at +264 61 123 4567.'
        );
      }

      await this.logWorkflowExecution('customer_support', phoneNumber, {
        message: 'Customer support response sent',
        originalMessage: message
      });

    } catch (error) {
      console.error('Error in customer support workflow:', error);
      await this.logWorkflowError('customer_support', phoneNumber, error);
    }
  }

  /**
   * Process workflow trigger
   * Main entry point for processing workflow triggers
   */
  static async processTrigger(trigger: WorkflowTrigger): Promise<void> {
    try {
      // Get customer data
      const customerData = await this.getCustomerData(trigger.customerId);
      if (!customerData) {
        throw new Error(`Customer not found: ${trigger.customerId}`);
      }

      // Execute appropriate workflow based on trigger type
      switch (trigger.type) {
        case 'welcome':
          await this.customerOnboarding(customerData);
          break;
        case 'loan_approved':
          await this.loanApproval(customerData);
          break;
        case 'loan_disbursed':
          await this.loanDisbursement(customerData);
          break;
        case 'payment_due':
          await this.paymentReminder(customerData);
          break;
        case 'kyc_required':
          await this.kycVerification(customerData);
          break;
        default:
          console.warn(`Unknown workflow trigger type: ${trigger.type}`);
      }

    } catch (error) {
      console.error('Error processing workflow trigger:', error);
      await this.logWorkflowError('process_trigger', trigger.customerId, error);
    }
  }

  /**
   * Schedule recurring workflows
   * Sets up automated workflows for payment reminders and other recurring tasks
   */
  static async scheduleRecurringWorkflows(): Promise<void> {
    try {
      // Get customers with payments due in 3 days
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const { data: upcomingPayments, error } = await supabase
        .from('loan_payments')
        .select(`
          *,
          loans (
            *,
            users (
              id,
              first_name,
              last_name,
              phone_number,
              email
            )
          )
        `)
        .eq('status', 'pending')
        .eq('due_date', threeDaysFromNow.toISOString().split('T')[0]);

      if (error) throw error;

      // Send payment reminders
      for (const payment of upcomingPayments || []) {
        const customerData: CustomerData = {
          id: payment.loans.users.id,
          firstName: payment.loans.users.first_name,
          lastName: payment.loans.users.last_name,
          phoneNumber: payment.loans.users.phone_number,
          email: payment.loans.users.email,
          loanId: payment.loan_id,
          nextPaymentDate: new Date(payment.due_date),
          nextPaymentAmount: payment.amount
        };

        await this.paymentReminder(customerData);
      }

      // Get customers with overdue payments
      const today = new Date().toISOString().split('T')[0];
      const { data: overduePayments, error: overdueError } = await supabase
        .from('loan_payments')
        .select(`
          *,
          loans (
            *,
            users (
              id,
              first_name,
              last_name,
              phone_number,
              email
            )
          )
        `)
        .eq('status', 'pending')
        .lt('due_date', today);

      if (overdueError) throw overdueError;

      // Send overdue payment reminders
      for (const payment of overduePayments || []) {
        const customerData: CustomerData = {
          id: payment.loans.users.id,
          firstName: payment.loans.users.first_name,
          lastName: payment.loans.users.last_name,
          phoneNumber: payment.loans.users.phone_number,
          email: payment.loans.users.email,
          loanId: payment.loan_id,
          nextPaymentDate: new Date(payment.due_date),
          nextPaymentAmount: payment.amount
        };

        await this.paymentReminder(customerData);
      }

      await this.logWorkflowExecution('schedule_recurring', 'system', {
        message: 'Recurring workflows scheduled',
        upcomingPayments: upcomingPayments?.length || 0,
        overduePayments: overduePayments?.length || 0
      });

    } catch (error) {
      console.error('Error scheduling recurring workflows:', error);
      await this.logWorkflowError('schedule_recurring', 'system', error);
    }
  }

  // Private helper methods

  private static async getCustomerData(customerId: string): Promise<CustomerData | null> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select(`
          id,
          first_name,
          last_name,
          phone_number,
          email,
          loans (
            id,
            amount,
            term_months,
            status
          )
        `)
        .eq('id', customerId)
        .single();

      if (error) throw error;
      if (!user) return null;

      // Get active loan if exists
      const activeLoan = user.loans?.find((loan: Record<string, unknown>) => loan.status === 'active');
      
      // Get next payment if loan exists
      let nextPayment = null;
      if (activeLoan) {
        const { data: payment } = await supabase
          .from('loan_payments')
          .select('*')
          .eq('loan_id', activeLoan.id)
          .eq('status', 'pending')
          .order('due_date', { ascending: true })
          .limit(1)
          .single();

        nextPayment = payment;
      }

      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        email: user.email,
        loanId: activeLoan?.id,
        loanAmount: activeLoan?.amount,
        loanTerm: activeLoan?.term_months,
        nextPaymentDate: nextPayment ? new Date(nextPayment.due_date) : undefined,
        nextPaymentAmount: nextPayment?.amount
      };

    } catch (error) {
      console.error('Error getting customer data:', error);
      return null;
    }
  }

  private static async logWorkflowExecution(workflowType: string, customerId: string, data: unknown): Promise<void> {
    try {
      const { error } = await supabase
        .from('workflow_executions')
        .insert({
          workflow_type: workflowType,
          customer_id: customerId,
          status: 'success',
          execution_data: data,
          executed_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging workflow execution:', error);
    }
  }

  private static async logWorkflowError(workflowType: string, customerId: string, error: unknown): Promise<void> {
    try {
      const { error: dbError } = await supabase
        .from('workflow_executions')
        .insert({
          workflow_type: workflowType,
          customer_id: customerId,
          status: 'error',
          error_message: error instanceof Error ? error.message : String(error),
          executed_at: new Date().toISOString()
        });

      if (dbError) throw dbError;
    } catch (dbError) {
      console.error('Error logging workflow error:', dbError);
    }
  }
}

// Export workflow processor function for API routes
export async function processWhatsAppWorkflow(trigger: WorkflowTrigger): Promise<void> {
  await WhatsAppWorkflows.processTrigger(trigger);
}

// Export recurring workflow scheduler
export async function scheduleWhatsAppWorkflows(): Promise<void> {
  await WhatsAppWorkflows.scheduleRecurringWorkflows();
}
