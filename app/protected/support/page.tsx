/**
 * Support Page
 * 
 * Purpose: Contact support and create support tickets for users
 * Location: /app/protected/support/page.tsx
 * Features: Support ticket creation, contact forms, ticket tracking
 */

import { ClipboardList } from 'lucide-react';

export default function ProtectedSupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600">Get help with your account, loans, or technical issues</p>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-medium text-lg mb-2">Create Support Ticket</h3>
            <p className="text-sm text-gray-600 mb-4">
              Submit a detailed request for complex issues that need investigation
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" disabled>
              Create Ticket
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">💬</span>
            </div>
            <h3 className="font-medium text-lg mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get instant help from our support team via live chat
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg" disabled>
              Start Chat
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-2xl">📱</span>
            </div>
            <h3 className="font-medium text-lg mb-2">WhatsApp Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Message us on WhatsApp for urgent matters and quick responses
            </p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg" disabled>
              Chat on WhatsApp
            </button>
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Create Support Ticket</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                  <option>Select ticket type</option>
                  <option>Technical Issue</option>
                  <option>Loan Application</option>
                  <option>KYC Verification</option>
                  <option>Payment Issue</option>
                  <option>Account Security</option>
                  <option>General Inquiry</option>
                  <option>Complaint</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                  <option>Select priority</option>
                  <option>Low - General inquiry</option>
                  <option>Medium - Standard issue</option>
                  <option>High - Urgent matter</option>
                  <option>Critical - System down</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                placeholder="Brief description of your issue"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={6}
                placeholder="Please provide detailed information about your issue, including steps to reproduce, error messages, and any relevant context..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Method
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                  <option>Email (recommended)</option>
                  <option>SMS</option>
                  <option>Phone Call</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Response Time
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                  <option>Within 24 hours</option>
                  <option>Within 48 hours</option>
                  <option>Within 1 week</option>
                  <option>No preference</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-400 text-xl">📎</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                  Choose Files
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, JPG, PNG up to 10MB each. Max 5 files.
                </p>
              </div>
            </div>
            
            <div className="pt-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg" disabled>
                Submit Support Ticket
              </button>
            </div>
          </form>
        </div>

        {/* My Support Tickets */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">My Support Tickets</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📋</span>
                </div>
                <div>
                  <h3 className="font-medium">KYC Verification Issue</h3>
                  <p className="text-sm text-gray-600">Ticket #ST-2025-001 • Created 2 days ago</p>
                  <p className="text-sm text-gray-600">Status: In Progress • Priority: Medium</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  In Progress
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                  View Details
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
                <div>
                  <h3 className="font-medium">Loan Application Help</h3>
                  <p className="text-sm text-gray-600">Ticket #ST-2025-002 • Created 1 week ago</p>
                  <p className="text-sm text-gray-600">Status: Resolved • Priority: Low</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Resolved
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                  View Details
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">💰</span>
                </div>
                <div>
                  <h3 className="font-medium">Payment Processing Error</h3>
                  <p className="text-sm text-gray-600">Ticket #ST-2025-003 • Created 3 weeks ago</p>
                  <p className="text-sm text-gray-600">Status: Closed • Priority: High</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                  Closed
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                  View Details
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
              View All Tickets →
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-4">General Support</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600">📧</span>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">support@buffr.ai</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-600">📱</span>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-gray-600">+264 61 123 4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-purple-600">📞</span>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">+264 61 123 4567</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Support Hours</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Live Chat & Phone</p>
                  <p className="text-sm text-gray-600">Mon-Fri: 8:00 AM - 6:00 PM</p>
                  <p className="text-sm text-gray-600">Sat: 9:00 AM - 2:00 PM</p>
                </div>
                <div>
                  <p className="font-medium text-sm">WhatsApp Support</p>
                  <p className="text-sm text-gray-600">24/7 for urgent matters</p>
                  <p className="text-sm text-gray-600">Response within 2 hours</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Email Support</p>
                  <p className="text-sm text-gray-600">Response within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Common Support Questions</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50" disabled>
                <span className="font-medium">How long does it take to get a response?</span>
                <span className="text-gray-400">+</span>
              </button>
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-600">
                  Response times vary by priority: Critical (2-4 hours), High (24 hours), 
                  Medium (48 hours), Low (1 week). WhatsApp support is fastest for urgent matters.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50" disabled>
                <span className="font-medium">Can I update my ticket after submission?</span>
                <span className="text-gray-400">+</span>
              </button>
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-600">
                  Yes, you can add comments and attachments to existing tickets. 
                  Simply reply to the ticket email or use the ticket tracking system.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg">
              <button className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50" disabled>
                <span className="font-medium">What information should I include in my ticket?</span>
                <span className="text-gray-400">+</span>
              </button>
              <div className="px-4 pb-3">
                <p className="text-sm text-gray-600">
                  Include: Clear description of the issue, steps to reproduce, error messages, 
                  screenshots if applicable, your account details, and preferred contact method.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Resources */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Additional Support Resources</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Check our help center for self-service solutions and tutorials
            </p>
            <div className="flex space-x-3">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                Help Center
              </button>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium" disabled>
                User Guide
              </button>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium" disabled>
                Video Tutorials
              </button>
            </div>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the support ticket system. 
            The actual implementation will include real-time ticket tracking, automated 
            responses, escalation workflows, and integration with customer support tools.
          </p>
        </div>
      </div>
    </div>
  );
}
