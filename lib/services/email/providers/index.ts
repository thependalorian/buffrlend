/**
 * Email Providers Index
 * 
 * Exports all email providers for the BuffrSign email system.
 */

import { SendGridProvider } from './sendgrid';
import { ResendProvider } from './resend';
import { SESProvider } from './ses';

export { SendGridProvider, ResendProvider, SESProvider };

// Provider factory function
export function createEmailProvider(
  provider: 'sendgrid' | 'resend' | 'ses',
  config: any
) {
  switch (provider) {
    case 'sendgrid':
      return new SendGridProvider(config);
    case 'resend':
      return new ResendProvider(config);
    case 'ses':
      return new SESProvider(config);
    default:
      throw new Error(`Unsupported email provider: ${provider}`);
  }
}
