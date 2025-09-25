/**
 * Help Page
 * 
 * Purpose: Help center and self-service resources for users
 * Location: /app/protected/help/page.tsx
 * Features: FAQ, knowledge base, troubleshooting guides, video tutorials
 */

import { ClipboardList, DollarSign, CreditCard, Smartphone, Mail, MessageCircle } from 'lucide-react';

export default function ProtectedHelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <p className="text-gray-600">Find answers to common questions and learn how to use Buffr</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-semibold mb-4">How can we help you?</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles, FAQs, or topics..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <span className="text-lg">🔍</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Popular searches: loan application, KYC verification, payments, account settings
            </p>
          </div>
        </div>

        {/* Quick Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-medium text-lg mb-2">Getting Started</h3>
            <p className="text-sm text-gray-600 mb-4">New to Buffr? Learn the basics</p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
              Learn More →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-medium text-lg mb-2">Loans & Applications</h3>
            <p className="text-sm text-gray-600 mb-4">Everything about loans and applications</p>
            <button className="text-green-600 hover:text-green-800 text-sm font-medium" disabled>
              Learn More →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-2xl">🆔</span>
            </div>
            <h3 className="font-medium text-lg mb-2">KYC & Verification</h3>
            <p className="text-sm text-gray-600 mb-4">Identity verification help</p>
            <button className="text-purple-600 hover:text-purple-800 text-sm font-medium" disabled>
              Learn More →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-medium text-lg mb-2">Payments & Billing</h3>
            <p className="text-sm text-gray-600 mb-4">Payment methods and billing info</p>
            <button className="text-orange-600 hover:text-orange-800 text-sm font-medium" disabled>
              Learn More →
            </button>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50" disabled>
                <span className="font-medium">How do I apply for a loan?</span>
                <span className="text-gray-400">+</span>
              </button>
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-600">
                  To apply for a loan, navigate to the Loan Application page, fill out the required information, 
                  upload your documents, and submit. Our team will review your application within 24-48 hours.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50" disabled>
                <span className="font-medium">What documents do I need for KYC verification?</span>
                <span className="text-gray-400">+</span>
              </button>
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-600">
                  You&apos;ll need a valid National ID or Passport, recent payslip (last 3 months), 
                  bank statement (last 3 months), and employment verification letter.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50" disabled>
                <span className="font-medium">How long does loan approval take?</span>
                <span className="text-gray-400">+</span>
              </button>
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-600">
                  Standard loan applications are processed within 24-48 hours. KYC verification may take 
                  an additional 1-2 business days depending on document quality and completeness.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50" disabled>
                <span className="font-medium">What are the interest rates?</span>
                <span className="text-gray-400">+</span>
              </button>
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-600">
                  Our loans have a fixed 15% once-off interest rate, which is 10% less than most 
                  other lenders. There are no hidden fees or compound interest.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50" disabled>
                <span className="font-medium">How do salary deductions work?</span>
                <span className="text-gray-400">+</span>
              </button>
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-600">
                  Repayments are automatically deducted from your salary by your employer and sent to Buffr. 
                  This ensures you never miss a payment and simplifies the repayment process.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-4xl">▶️</span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">Getting Started with Buffr</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Learn how to create your account and complete your first loan application
                </p>
                <p className="text-xs text-gray-500">Duration: 5:32</p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-4xl">▶️</span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">KYC Verification Process</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Step-by-step guide to completing your identity verification
                </p>
                <p className="text-xs text-gray-500">Duration: 8:15</p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-4xl">▶️</span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">Managing Your Loan</h3>
                <p className="text-sm text-gray-600 mb-3">
                  How to track payments, view statements, and manage your account
                </p>
                <p className="text-xs text-gray-500">Duration: 6:48</p>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting Guides */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Troubleshooting Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-3">Common Issues & Solutions</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <div>
                    <p className="font-medium text-sm">Document Upload Failed</p>
                    <p className="text-xs text-gray-600">Check file size and format requirements</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <div>
                    <p className="font-medium text-sm">Verification Delayed</p>
                    <p className="text-xs text-gray-600">Ensure all documents are clear and complete</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <div>
                    <p className="font-medium text-sm">Payment Issues</p>
                    <p className="text-xs text-gray-600">Contact your employer&apos;s HR department</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-3">Account Security</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <div>
                    <p className="font-medium text-sm">Password Reset</p>
                    <p className="text-xs text-gray-600">Use the forgot password feature</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <div>
                    <p className="font-medium text-sm">Two-Factor Auth</p>
                    <p className="text-xs text-gray-600">Enable 2FA for enhanced security</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <div>
                    <p className="font-medium text-sm">Suspicious Activity</p>
                    <p className="text-xs text-gray-600">Report immediately to support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Still Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get instant help from our support team
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Start Chat
              </button>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">WhatsApp</h3>
              <p className="text-sm text-gray-600 mb-4">
                Message us on WhatsApp for urgent help
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg" disabled>
                Chat on WhatsApp
              </button>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Send us a detailed email for complex issues
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg" disabled>
                Send Email
              </button>
            </div>
          </div>
        </div>

        {/* Help Resources */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Documentation</h3>
              <div className="space-y-2">
                <button className="text-left text-blue-600 hover:text-blue-800 text-sm" disabled>
                  • User Manual (PDF)
                </button>
                <button className="text-left text-blue-600 hover:text-blue-800 text-sm" disabled>
                  • API Documentation
                </button>
                <button className="text-left text-blue-600 hover:text-blue-800 text-sm" disabled>
                  • Security Guidelines
                </button>
                <button className="text-left text-blue-600 hover:text-blue-800 text-sm" disabled>
                  • Compliance Information
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Community</h3>
              <div className="space-y-2">
                <button className="text-left text-blue-600 hover:text-blue-800 text-sm" disabled>
                  • User Forum
                </button>
                <button className="text-left text-blue-600 hover:text-blue-800 text-sm" disabled>
                  • Feedback Portal
                </button>
                <button className="text-left text-blue-600 hover:text-blue-800 text-sm" disabled>
                  • Feature Requests
                </button>
                <button className="text-left text-blue-600 hover:text-blue-800 text-sm" disabled>
                  • Community Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the help center system. 
            The actual implementation will include a comprehensive knowledge base, 
            interactive tutorials, AI-powered search, and personalized help recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
