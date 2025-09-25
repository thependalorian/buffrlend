/**
 * WhatsApp Business API Service
 * 
 * This service handles WhatsApp Business API integration using Twilio
 * for automated customer communications, message templates, and webhook handling.
 * 
 * Features:
 * - Message sending with templates
 * - Webhook handling for incoming messages
 * - Message status tracking
 * - Customer communication workflows
 * - Analytics and reporting
 */

import { Twilio } from 'twilio';
import { createClient } from '@/lib/supabase/client';
import {
  WhatsAppTemplate
} from '@/lib/types';

// Types
export interface WhatsAppMessage {
  id: string;
  to: string;
  from: string;
  body: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  templateName?: string;
  customerId?: string;
  loanId?: string;
}

export interface TemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  text?: string;
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  buttons?: TemplateButton[];
}

export interface TemplateButton {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
  text: string;
  url?: string;
  phoneNumber?: string;
}

export interface WhatsAppWebhook {
  MessageSid: string;
  From: string;
  To: string;
  Body: string;
  MessageStatus: string;
  Timestamp: string;
  ProfileName?: string;
  WaId?: string;
}

export interface CustomerCommunication {
  id: string;
  customerId: string;
  phoneNumber: string;
  messageType: 'template' | 'text' | 'media';
  templateName?: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  loanId?: string;
  campaignId?: string;
}

export class WhatsAppService {
  private twilio: Twilio;
  private supabase: unknown;
  private whatsappNumber: string;

  constructor() {
    // Initialize Twilio client
    this.twilio = new Twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    // Initialize Supabase client
    this.supabase = createClient();

    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
  }

  /**
   * Send a WhatsApp message using a template
   */
  async sendTemplateMessage(
    to: string,
    templateName: string,
    parameters: Record<string, string> = {},
    customerId?: string,
    loanId?: string
  ): Promise<WhatsAppMessage> {
    try {
      // Format phone number
      const formattedTo = this.formatPhoneNumber(to);

      // Send message using Twilio WhatsApp API
      const message = await this.twilio.messages.create({
        from: this.whatsappNumber,
        to: `whatsapp:${formattedTo}`,
        body: await this.buildTemplateMessage(templateName, parameters)
      });

      // Create message record
      const whatsappMessage: WhatsAppMessage = {
        id: message.sid,
        to: formattedTo,
        from: this.whatsappNumber,
        body: await this.buildTemplateMessage(templateName, parameters),
        status: 'sent',
        timestamp: new Date(),
        templateName,
        customerId,
        loanId
      };

      // Store in database
      await this.storeMessage(whatsappMessage);

      return whatsappMessage;
    } catch (error) {
      console.error('Error sending WhatsApp template message:', error);
      throw new Error(`Failed to send WhatsApp message: ${error}`);
    }
  }

  /**
   * Send a simple text message
   */
  async sendTextMessage(
    to: string,
    message: string,
    customerId?: string,
    loanId?: string
  ): Promise<WhatsAppMessage> {
    try {
      const formattedTo = this.formatPhoneNumber(to);

      const twilioMessage = await this.twilio.messages.create({
        from: this.whatsappNumber,
        to: `whatsapp:${formattedTo}`,
        body: message
      });

      const whatsappMessage: WhatsAppMessage = {
        id: twilioMessage.sid,
        to: formattedTo,
        from: this.whatsappNumber,
        body: message,
        status: 'sent',
        timestamp: new Date(),
        customerId,
        loanId
      };

      await this.storeMessage(whatsappMessage);

      return whatsappMessage;
    } catch (error) {
      console.error('Error sending WhatsApp text message:', error);
      throw new Error(`Failed to send WhatsApp message: ${error}`);
    }
  }

  /**
   * Handle incoming webhook from Twilio
   */
  async handleWebhook(webhookData: WhatsAppWebhook): Promise<void> {
    try {
      // Store incoming message
      await this.storeIncomingMessage(webhookData);

      // Process message based on content
      await this.processIncomingMessage(webhookData);

      // Update message status if it's a status update
      if (webhookData.MessageStatus) {
        await this.updateMessageStatus(webhookData.MessageSid, webhookData.MessageStatus);
      }
    } catch (error) {
      console.error('Error handling WhatsApp webhook:', error);
      throw error;
    }
  }

  /**
   * Get message templates
   */
  async getTemplates(): Promise<WhatsAppTemplate[]> {
    try {
      // In a real implementation, you would fetch from Twilio API
      // For now, return predefined templates
      return [
        {
          id: 'welcome_template',
          name: 'welcome_template',
          category: 'UTILITY',
          language: 'en',
          status: 'APPROVED',
          components: [
            {
              type: 'HEADER',
              text: 'Welcome to BuffrLend!'
            },
            {
              type: 'BODY',
              text: 'Hello {{1}}, welcome to BuffrLend! Your loan application {{2}} has been received and is being processed. We will notify you once it\'s approved.'
            },
            {
              type: 'FOOTER',
              text: 'Thank you for choosing BuffrLend'
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'loan_approved',
          name: 'loan_approved',
          category: 'UTILITY',
          language: 'en',
          status: 'APPROVED',
          components: [
            {
              type: 'HEADER',
              text: 'Loan Approved!'
            },
            {
              type: 'BODY',
              text: 'Congratulations {{1}}! Your loan application has been approved. Amount: N${{2}}, Term: {{3}} months. Funds will be disbursed within 24 hours.'
            },
            {
              type: 'FOOTER',
              text: 'BuffrLend - Your trusted financial partner'
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'payment_reminder',
          name: 'payment_reminder',
          category: 'UTILITY',
          language: 'en',
          status: 'APPROVED',
          components: [
            {
              type: 'HEADER',
              text: 'Payment Reminder'
            },
            {
              type: 'BODY',
              text: 'Hello {{1}}, this is a friendly reminder that your loan payment of N${{2}} is due on {{3}}. Please ensure sufficient funds in your account.'
            },
            {
              type: 'FOOTER',
              text: 'BuffrLend'
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching WhatsApp templates:', error);
      throw error;
    }
  }

  /**
   * Get customer communication history
   */
  async getCustomerCommunications(customerId: string): Promise<CustomerCommunication[]> {
    try {
      const { data, error } = await (this.supabase as ReturnType<typeof createClient>)
        .from('customer_communications')
        .select('*')
        .eq('customer_id', customerId)
        .order('sent_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching customer communications:', error);
      throw error;
    }
  }

  /**
   * Get message analytics
   */
  async getMessageAnalytics(startDate: Date, endDate: Date): Promise<unknown> {
    try {
      const { data, error } = await (this.supabase as ReturnType<typeof createClient>)
        .from('customer_communications')
        .select('*')
        .gte('sent_at', startDate.toISOString())
        .lte('sent_at', endDate.toISOString());

      if (error) throw error;

      // Calculate analytics
      const total = data.length;
      const sent = data.filter((m: { status?: string }) => m.status === 'sent').length;
      const delivered = data.filter((m: { status?: string }) => m.status === 'delivered').length;
      const read = data.filter((m: { status?: string }) => m.status === 'read').length;
      const failed = data.filter((m: { status?: string }) => m.status === 'failed').length;

      return {
        total,
        sent,
        delivered,
        read,
        failed,
        deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
        readRate: total > 0 ? (read / total) * 100 : 0,
        failureRate: total > 0 ? (failed / total) * 100 : 0
      };
    } catch (error) {
      console.error('Error fetching message analytics:', error);
      throw error;
    }
  }

  // Private helper methods

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present (assuming Namibia +264)
    if (cleaned.startsWith('264')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+264${cleaned.substring(1)}`;
    } else {
      return `+264${cleaned}`;
    }
  }

  private async buildTemplateMessage(templateName: string, parameters: Record<string, string>): Promise<string> {
    // Get template
    const templates = await this.getTemplates();
    const template = templates.find(t => t.name === templateName);
    
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    // Build message from template
    let message = '';
    
    if (template.components && Array.isArray(template.components)) {
      (template.components as unknown as TemplateComponent[]).forEach(component => {
      if (component.type === 'HEADER' && component.text) {
        message += `${component.text}\n\n`;
      } else if (component.type === 'BODY' && component.text) {
        let bodyText = component.text;
        // Replace parameters
        Object.entries(parameters).forEach(([key, value]) => {
          bodyText = bodyText.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
        message += `${bodyText}\n\n`;
      } else if (component.type === 'FOOTER' && component.text) {
        message += `_${component.text}_`;
      }
    });
    }

    return message.trim();
  }

  private async storeMessage(message: WhatsAppMessage): Promise<void> {
    try {
      const { error } = await (this.supabase as ReturnType<typeof createClient>)
        .from('customer_communications')
        .insert({
          id: message.id,
          customer_id: message.customerId,
          phone_number: message.to,
          message_type: message.templateName ? 'template' : 'text',
          template_name: message.templateName,
          content: message.body,
          status: message.status,
          sent_at: message.timestamp.toISOString(),
          loan_id: message.loanId
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing WhatsApp message:', error);
      throw error;
    }
  }

  private async storeIncomingMessage(webhook: WhatsAppWebhook): Promise<void> {
    try {
      const { error } = await (this.supabase as ReturnType<typeof createClient>)
        .from('customer_communications')
        .insert({
          id: webhook.MessageSid,
          phone_number: webhook.From.replace('whatsapp:', ''),
          message_type: 'text',
          content: webhook.Body,
          status: 'received',
          sent_at: new Date(webhook.Timestamp).toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing incoming WhatsApp message:', error);
      throw error;
    }
  }

  private async processIncomingMessage(webhook: WhatsAppWebhook): Promise<void> {
    try {
      const message = webhook.Body.toLowerCase();
      const phoneNumber = webhook.From.replace('whatsapp:', '');

      // Simple message processing logic
      if (message.includes('help') || message.includes('support')) {
        await this.sendTextMessage(
          phoneNumber,
          'Hello! How can we help you today? You can:\n\n1. Check your loan status\n2. Make a payment\n3. Update your information\n4. Speak to support\n\nPlease reply with the number of your choice.'
        );
      } else if (message.includes('status') || message.includes('1')) {
        await this.sendTextMessage(
          phoneNumber,
          'To check your loan status, please provide your loan reference number or ID number.'
        );
      } else if (message.includes('payment') || message.includes('2')) {
        await this.sendTextMessage(
          phoneNumber,
          'To make a payment, please ensure you have sufficient funds in your account. Payments are automatically deducted on the due date.'
        );
      } else {
        await this.sendTextMessage(
          phoneNumber,
          'Thank you for your message. Our team will get back to you shortly. For immediate assistance, please call our support line.'
        );
      }
    } catch (error) {
      console.error('Error processing incoming message:', error);
    }
  }

  private async updateMessageStatus(messageId: string, status: string): Promise<void> {
    try {
      const { error } = await (this.supabase as ReturnType<typeof createClient>)
        .from('customer_communications')
        .update({ 
          status: status.toLowerCase(),
          ...(status === 'delivered' && { delivered_at: new Date().toISOString() }),
          ...(status === 'read' && { read_at: new Date().toISOString() })
        })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();
