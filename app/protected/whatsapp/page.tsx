/**
 * WhatsApp Page
 * 
 * Purpose: WhatsApp integration for customer support and communication
 * Location: /app/protected/whatsapp/page.tsx
 * Features: WhatsApp chat, quick actions, message templates, contact information
 */

import { Smartphone, ClipboardList, DollarSign, Mail } from 'lucide-react';

export default function ProtectedWhatsAppPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">WhatsApp Support</h1>
          <p className="text-gray-600">Get instant help via WhatsApp - our fastest support channel</p>
        </div>

        {/* WhatsApp Status */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">WhatsApp Support is Active</h2>
            <p className="text-gray-600 mb-4">
              Our support team is available 24/7 for urgent matters and quick assistance
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-600 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Online Now</span>
            </div>
            <a
              href="https://wa.me/264611234567?text=Hi%20Buffr%20Support%2C%20I%20need%20help%20with%20my%20account"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
            >
              <span>💬</span>
              <span>Start WhatsApp Chat</span>
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-medium text-lg mb-2">Loan Application</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get help with your loan application process
            </p>
            <a
              href="https://wa.me/264611234567?text=Hi%2C%20I%20need%20help%20with%20my%20loan%20application"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Chat Now
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-2xl">🆔</span>
            </div>
            <h3 className="font-medium text-lg mb-2">KYC Verification</h3>
            <p className="text-sm text-gray-600 mb-4">
              Assistance with identity verification
            </p>
            <a
              href="https://wa.me/264611234567?text=Hi%2C%20I%20need%20help%20with%20KYC%20verification"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
            >
              Chat Now
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-medium text-lg mb-2">Payment Issues</h3>
            <p className="text-sm text-gray-600 mb-4">
              Help with payment problems or questions
            </p>
            <a
              href="https://wa.me/264611234567?text=Hi%2C%20I%20have%20a%20payment%20issue%20that%20needs%20urgent%20attention"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors"
            >
              Chat Now
            </a>
          </div>
        </div>

        {/* Message Templates */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Quick Message Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Common Inquiries</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50" disabled>
                  <p className="font-medium text-sm">Check loan status</p>
                  <p className="text-xs text-gray-600">&quot;Hi, can you check the status of my loan application?&quot;</p>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50" disabled>
                  <p className="font-medium text-sm">Update contact info</p>
                  <p className="text-xs text-gray-600">&quot;Hi, I need to update my contact information&quot;</p>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50" disabled>
                  <p className="font-medium text-sm">Payment extension</p>
                  <p className="text-xs text-gray-600">&quot;Hi, I need to request a payment extension&quot;</p>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Urgent Issues</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50" disabled>
                  <p className="font-medium text-sm">Account locked</p>
                  <p className="text-xs text-gray-600">&quot;URGENT: My account is locked, need immediate help&quot;</p>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50" disabled>
                  <p className="font-medium text-sm">Fraud concern</p>
                  <p className="text-xs text-gray-600">&quot;URGENT: I suspect fraudulent activity on my account&quot;</p>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50" disabled>
                  <p className="font-medium text-sm">Payment failed</p>
                  <p className="text-xs text-gray-600">&quot;URGENT: My payment failed, need immediate assistance&quot;</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Features */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Why WhatsApp Support?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">⚡</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Fast Response</h3>
              <p className="text-sm text-gray-600">
                Get help within 2 hours, even outside business hours
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Mobile Friendly</h3>
              <p className="text-sm text-gray-600">
                Chat from anywhere using your mobile device
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">🔄</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Conversation History</h3>
              <p className="text-sm text-gray-600">
                Keep track of all your support conversations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-2xl">📎</span>
              </div>
              <h3 className="font-medium text-lg mb-2">File Sharing</h3>
              <p className="text-sm text-gray-600">
                Send documents and screenshots easily
              </p>
            </div>
          </div>
        </div>

        {/* Support Hours & Response Times */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Support Hours & Response Times</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monday - Friday</span>
                  <span className="text-sm font-medium">24/7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Saturday</span>
                  <span className="text-sm font-medium">24/7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sunday</span>
                  <span className="text-sm font-medium">24/7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Public Holidays</span>
                  <span className="text-sm font-medium">24/7</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Response Times</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Urgent Issues</span>
                  <span className="text-sm font-medium text-red-600">Within 2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Standard Inquiries</span>
                  <span className="text-sm font-medium text-orange-600">Within 4 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">General Questions</span>
                  <span className="text-sm font-medium text-green-600">Within 8 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Non-Urgent</span>
                  <span className="text-sm font-medium text-blue-600">Within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Business Features */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">WhatsApp Business Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-3">Quick Replies</h3>
              <p className="text-sm text-gray-600 mb-4">
                Pre-written responses for common questions to speed up support
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Loan application status</li>
                <li>• KYC verification steps</li>
                <li>• Payment due dates</li>
                <li>• Account information</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-3">Business Profile</h3>
              <p className="text-sm text-gray-600 mb-4">
                Verified business profile with company information and contact details
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Company description</li>
                <li>• Business hours</li>
                <li>• Website link</li>
                <li>• Location information</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-3">Message Analytics</h3>
              <p className="text-sm text-gray-600 mb-4">
                Track response times and customer satisfaction metrics
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Response time tracking</li>
                <li>• Customer satisfaction</li>
                <li>• Support volume</li>
                <li>• Peak hours analysis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Alternative Contact Methods */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Alternative Contact Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">💬</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-4">
                Chat with our support team on the website
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Start Chat
              </button>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Send detailed emails for complex issues
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg" disabled>
                Send Email
              </button>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">📞</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Phone Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Call us during business hours
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg" disabled>
                Call Now
              </button>
            </div>
          </div>
        </div>

        {/* WhatsApp Tips */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Tips for Better WhatsApp Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Before You Start</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 text-sm">✓</span>
                  <span className="text-sm text-gray-600">Have your account details ready</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 text-sm">✓</span>
                  <span className="text-sm text-gray-600">Prepare clear description of your issue</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 text-sm">✓</span>
                  <span className="text-sm text-gray-600">Gather relevant screenshots or documents</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-600 text-sm">✓</span>
                  <span className="text-sm text-gray-600">Choose the right time for urgent matters</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">During the Chat</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 text-sm">💡</span>
                  <span className="text-sm text-gray-600">Be patient and provide all requested information</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 text-sm">💡</span>
                  <span className="text-sm text-gray-600">Ask for clarification if something is unclear</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 text-sm">💡</span>
                  <span className="text-sm text-gray-600">Save important information from the chat</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 text-sm">💡</span>
                  <span className="text-sm text-gray-600">Follow up if you don&apos;t hear back</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the WhatsApp integration system. 
            The actual implementation will include WhatsApp Business API integration, automated 
            responses, message routing, and comprehensive chat management tools.
          </p>
        </div>
      </div>
    </div>
  );
}