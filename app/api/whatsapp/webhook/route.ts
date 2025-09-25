/**
 * WhatsApp Webhook API Route
 * 
 * This API endpoint handles incoming webhooks from Twilio WhatsApp Business API
 * for message status updates and incoming messages.
 */

import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/integrations/whatsapp/whatsapp-service';

export async function POST(request: NextRequest) {
  try {
    // Parse webhook data from Twilio
    const formData = await request.formData();
    
    const webhookData = {
      MessageSid: formData.get('MessageSid') as string,
      From: formData.get('From') as string,
      To: formData.get('To') as string,
      Body: formData.get('Body') as string,
      MessageStatus: formData.get('MessageStatus') as string,
      Timestamp: formData.get('Timestamp') as string,
      ProfileName: formData.get('ProfileName') as string,
      WaId: formData.get('WaId') as string
    };

    // Validate required fields
    if (!webhookData.MessageSid) {
      return NextResponse.json(
        { error: 'MessageSid is required' },
        { status: 400 }
      );
    }

    // Handle the webhook
    await whatsappService.handleWebhook(webhookData);

    // Return TwiML response for Twilio
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/xml'
        }
      }
    );

  } catch (error) {
    console.error('Error handling WhatsApp webhook:', error);
    return NextResponse.json(
      { 
        error: 'Failed to handle webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const challenge = url.searchParams.get('hub.challenge');
    
    if (challenge) {
      return new NextResponse(challenge, { status: 200 });
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    console.error('Error in WhatsApp webhook GET:', error);
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 500 }
    );
  }
}
