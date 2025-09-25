/**
 * Webhook Security for BuffrLend
 * Implements webhook signature verification and security measures
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Webhook security configuration
const WEBHOOK_CONFIG = {
  sendgrid: {
    signatureHeader: 'x-twilio-email-event-webhook-signature',
    timestampHeader: 'x-twilio-email-event-webhook-timestamp',
    publicKey: process.env.SENDGRID_WEBHOOK_PUBLIC_KEY!,
    algorithm: 'ecdsa',
  },
  resend: {
    signatureHeader: 'x-resend-signature',
    timestampHeader: 'x-resend-timestamp',
    secretKey: process.env.RESEND_WEBHOOK_SECRET!,
    algorithm: 'sha256',
  },
  ses: {
    signatureHeader: 'x-amz-signature',
    timestampHeader: 'x-amz-date',
    secretKey: process.env.AWS_SECRET_ACCESS_KEY!,
    algorithm: 'sha256',
  },
  twilio: {
    signatureHeader: 'x-twilio-signature',
    timestampHeader: 'x-twilio-timestamp',
    secretKey: process.env.TWILIO_AUTH_TOKEN!,
    algorithm: 'sha1',
  },
} as const;

// Webhook signature verification
export function verifyWebhookSignature(
  provider: keyof typeof WEBHOOK_CONFIG,
  body: string,
  signature: string,
  timestamp: string
): boolean {
  const config = WEBHOOK_CONFIG[provider];
  
  if (!config) {
    console.warn(`Webhook configuration not found for provider: ${provider}`);
    return false;
  }
  
  try {
    if (provider === 'sendgrid') {
      // SendGrid uses ECDSA with public key
      if (!('publicKey' in config) || !config.publicKey) {
        console.warn('SendGrid webhook public key not configured');
        return false;
      }
      
      return verifySendGridSignature(config.publicKey, body, signature, timestamp);
    } else {
      // Other providers use HMAC with secret key
      if (!('secretKey' in config) || !config.secretKey) {
        console.warn(`Webhook secret not configured for provider: ${provider}`);
        return false;
      }
      
      return verifyHmacSignature(config.secretKey, config.algorithm, body, signature, timestamp);
    }
  } catch {
    console.error(`Webhook signature verification error for ${provider}:`, 'Unknown error');
    return false;
  }
}

// SendGrid ECDSA signature verification
function verifySendGridSignature(
  publicKey: string,
  body: string,
  signature: string,
  timestamp: string
): boolean {
  try {
    // Create the payload to verify (timestamp + body)
    const payload = timestamp + body;
    
    // Decode the signature from base64
    const decodedSignature = Buffer.from(signature, 'base64');
    
    // Create verifier
    const verify = crypto.createVerify('SHA256');
    verify.update(payload, 'utf8');
    verify.end();
    
    // Verify the signature using the public key
    return verify.verify(publicKey, decodedSignature);
  } catch {
    console.error('SendGrid signature verification error:', 'Unknown error');
    return false;
  }
}

// HMAC signature verification for other providers
function verifyHmacSignature(
  secretKey: string,
  algorithm: string,
  body: string,
  signature: string,
  timestamp: string
): boolean {
  try {
    // Create the payload to verify
    const payload = `${timestamp}${body}`;
    
    // Create the expected signature
    const expectedSignature = crypto
      .createHmac(algorithm, secretKey)
      .update(payload)
      .digest('hex');
    
    // Compare signatures
    const providedSignature = signature.replace('sha256=', '').replace('sha1=', '');
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    );
  } catch {
    console.error('HMAC signature verification error:', 'Unknown error');
    return false;
  }
}

// Webhook security middleware
export function withWebhookSecurity(
  provider: keyof typeof WEBHOOK_CONFIG,
  options: {
    enforceSignature?: boolean;
    maxAge?: number; // Maximum age of timestamp in seconds
  } = {}
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const { enforceSignature = true, maxAge = 300 } = options; // 5 minutes default
    
    descriptor.value = async function (request: NextRequest, ...args: any[]) {
      try {
        // Get webhook headers
        const config = WEBHOOK_CONFIG[provider];
        const signature = request.headers.get(config.signatureHeader);
        const timestamp = request.headers.get(config.timestampHeader);
        
        // Check if signature verification is required
        if (enforceSignature) {
          if (!signature || !timestamp) {
            return new NextResponse(
              JSON.stringify({ error: 'Missing webhook signature or timestamp' }),
              { status: 401 }
            );
          }
          
          // Check timestamp age
          const timestampMs = parseInt(timestamp) * 1000;
          const now = Date.now();
          const age = (now - timestampMs) / 1000;
          
          if (age > maxAge) {
            return new NextResponse(
              JSON.stringify({ error: 'Webhook timestamp too old' }),
              { status: 401 }
            );
          }
          
          // Get request body
          const body = await request.text();
          
          // Verify signature
          const isValid = verifyWebhookSignature(provider, body, signature, timestamp);
          
          if (!isValid) {
            console.warn(`Invalid webhook signature for provider: ${provider}`);
            return new NextResponse(
              JSON.stringify({ error: 'Invalid webhook signature' }),
              { status: 401 }
            );
          }
          
          // Create new request with parsed body
          const newRequest = new NextRequest(request.url, {
            method: request.method,
            headers: request.headers,
            body: body,
          });
          
          return originalMethod.apply(this, [newRequest, ...args]);
        }
        
        return originalMethod.apply(this, [request, ...args]);
      } catch {
        console.error(`Webhook security error for ${provider}:`, 'Unknown error');
        return new NextResponse(
          JSON.stringify({ error: 'Webhook security validation failed' }),
          { status: 500 }
        );
      }
    };
    
    return descriptor;
  };
}

// Webhook event validation
export function validateWebhookEvent(
  provider: keyof typeof WEBHOOK_CONFIG,
  event: any
): { valid: boolean; error?: string } {
  try {
    switch (provider) {
      case 'sendgrid':
        return validateSendGridEvent(event);
      case 'resend':
        return validateResendEvent(event);
      case 'ses':
        return validateSESEvent(event);
      case 'twilio':
        return validateTwilioEvent(event);
      default:
        return { valid: false, error: 'Unknown webhook provider' };
    }
  } catch {
    return { valid: false, error: 'Event validation failed' };
  }
}

// Provider-specific event validation
function validateSendGridEvent(event: any): { valid: boolean; error?: string } {
  const requiredFields = ['event', 'timestamp', 'sg_message_id', 'email'];
  
  for (const field of requiredFields) {
    if (!event[field]) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  
  // Validate event type
  const validEvents = ['delivered', 'bounce', 'dropped', 'spam', 'unsubscribe', 'group_unsubscribe', 'processed'];
  if (!validEvents.includes(event.event)) {
    return { valid: false, error: `Invalid event type: ${event.event}` };
  }
  
  return { valid: true };
}

function validateResendEvent(event: any): { valid: boolean; error?: string } {
  const requiredFields = ['type', 'created_at', 'data'];
  
  for (const field of requiredFields) {
    if (!event[field]) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  
  return { valid: true };
}

function validateSESEvent(event: any): { valid: boolean; error?: string } {
  const requiredFields = ['eventType', 'mail', 'timestamp'];
  
  for (const field of requiredFields) {
    if (!event[field]) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  
  return { valid: true };
}

function validateTwilioEvent(event: any): { valid: boolean; error?: string } {
  const requiredFields = ['MessageStatus', 'MessageSid', 'To'];
  
  for (const field of requiredFields) {
    if (!event[field]) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  
  return { valid: true };
}

// Webhook rate limiting
export function withWebhookRateLimit(
  provider: keyof typeof WEBHOOK_CONFIG,
  options: {
    maxRequests?: number;
    windowMs?: number;
  } = {}
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const { maxRequests = 100, windowMs = 60000 } = options; // 100 requests per minute
    
    // Simple in-memory rate limiting (in production, use Redis)
    const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
    
    descriptor.value = async function (request: NextRequest, ...args: any[]) {
      try {
        const clientId = request.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();
        
        // Clean up expired entries
        for (const [key, value] of rateLimitMap.entries()) {
          if (now > value.resetTime) {
            rateLimitMap.delete(key);
          }
        }
        
        // Check rate limit
        const current = rateLimitMap.get(clientId);
        
        if (current) {
          if (now > current.resetTime) {
            // Reset window
            rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
          } else if (current.count >= maxRequests) {
            return new NextResponse(
              JSON.stringify({ error: 'Webhook rate limit exceeded' }),
              { status: 429 }
            );
          } else {
            current.count++;
          }
        } else {
          rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
        }
        
        return originalMethod.apply(this, [request, ...args]);
      } catch {
        console.error(`Webhook rate limit error for ${provider}:`, 'Unknown error');
        return originalMethod.apply(this, [request, ...args]);
      }
    };
    
    return descriptor;
  };
}

// Export webhook configuration
export { WEBHOOK_CONFIG };
