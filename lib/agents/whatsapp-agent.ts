/**
 * Mock WhatsApp Agent for BuffrLend
 */

import { CustomerContext } from '../services/llama-index-service';

export interface CustomerMessage {
  content: string;
  customerId: string;
  timestamp: string;
  language: string;
  metadata: {
    messageId: string;
    conversationId: string;
    platform: string;
  };
}

export interface WhatsAppResponse {
  response: string;
  sentiment: string;
  requiresEscalation: boolean;
  metadata: {
    intent: string;
    escalationReason?: string;
  };
  suggestedActions: string[];
}

class WhatsAppAgent {
  async classifyIntent(message: string): Promise<string> {
    console.log(`Classifying intent for message: "${message}"`);
    if (message.toLowerCase().includes('loan')) {
      return 'loan_application';
    }
    return 'general_inquiry';
  }

  async processMessage(
    message: CustomerMessage,
    context: CustomerContext
  ): Promise<WhatsAppResponse> {
    console.log('Processing message:', message);
    console.log('With context:', context);

    return {
      response: `Hello! I am a mock WhatsApp agent. You said: "${message.content}"`, 
      sentiment: 'neutral',
      requiresEscalation: false,
      metadata: {
        intent: 'mock_intent',
      },
      suggestedActions: ['Check loan status', 'Apply for new loan'],
    };
  }
}

export const whatsappAgent = new WhatsAppAgent();
