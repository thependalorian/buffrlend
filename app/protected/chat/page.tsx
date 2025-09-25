// Icons will be imported when needed

export default function ProtectedChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Customer Support Chat</h1>
          <p className="text-gray-600">Get real-time help from our support team</p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
            {/* Chat List */}
            <div className="border-r border-gray-200 bg-gray-50">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Active Conversations</h2>
              </div>
              <div className="space-y-1">
                <div className="p-3 hover:bg-gray-100 cursor-pointer border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      S
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">Support Team</p>
                      <p className="text-xs text-gray-600 truncate">How can I help you today?</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="p-3 hover:bg-gray-100 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      L
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">Loan Application</p>
                      <p className="text-xs text-gray-600 truncate">Application #BL-2025-001</p>
                    </div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="p-3 hover:bg-gray-100 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      K
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">KYC Verification</p>
                      <p className="text-xs text-gray-600 truncate">Document verification help</p>
                    </div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm" disabled>
                  Start New Chat
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="lg:col-span-2 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      S
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Support Team</h3>
                      <p className="text-sm text-gray-600">Online • Usually responds in minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg" disabled>
                      <span className="text-lg">📞</span>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg" disabled>
                      <span className="text-lg">📹</span>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg" disabled>
                      <span className="text-lg">⋯</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {/* Support Message */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    S
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                      <p className="text-sm text-gray-900">
                        Hello! Welcome to Buffr Support. How can I assist you today? 
                        I&apos;m here to help with any questions about loans, KYC verification, 
                        or general inquiries.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">2 minutes ago</p>
                    </div>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex items-start space-x-3 justify-end">
                  <div className="flex-1"></div>
                  <div className="max-w-xs">
                    <div className="bg-blue-600 rounded-lg p-3 shadow-sm">
                      <p className="text-sm text-white">
                        Hi! I have a question about my loan application. 
                        I submitted it yesterday but haven&apos;t heard back yet.
                      </p>
                      <p className="text-xs text-blue-200 mt-2">1 minute ago</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    U
                  </div>
                </div>

                {/* Support Message */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    S
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                      <p className="text-sm text-gray-900">
                        I understand your concern. Let me check the status of your application. 
                        Can you provide your application reference number?
                      </p>
                      <p className="text-xs text-gray-500 mt-2">Just now</p>
                    </div>
                  </div>
                </div>

                {/* Typing Indicator */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    S
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg" disabled>
                    <span className="text-lg">📎</span>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg" disabled>
                    <span className="text-lg">😊</span>
                  </button>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled
                    />
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">📋</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Create Support Ticket</h3>
              <p className="text-sm text-gray-600 mb-4">
                Submit a detailed support request for complex issues
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Create Ticket
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">📱</span>
              </div>
              <h3 className="font-medium text-lg mb-2">WhatsApp Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get help via WhatsApp for urgent matters
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg" disabled>
                Chat on WhatsApp
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">📚</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Help Center</h3>
              <p className="text-sm text-gray-600 mb-4">
                Browse our knowledge base for common questions
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg" disabled>
                Visit Help Center
              </button>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Recent Chat History</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">💬</span>
                </div>
                <div>
                  <h3 className="font-medium">Loan Application Support</h3>
                  <p className="text-sm text-gray-600">Resolved • 2 days ago</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                View Chat
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">📋</span>
                </div>
                <div>
                  <h3 className="font-medium">KYC Verification Help</h3>
                  <p className="text-sm text-gray-600">Resolved • 1 week ago</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                View Chat
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">💰</span>
                </div>
                <div>
                  <h3 className="font-medium">Payment Query</h3>
                  <p className="text-sm text-gray-600">Resolved • 2 weeks ago</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                View Chat
              </button>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Support Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Live Chat Support</h3>
              <p className="text-sm text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p className="text-sm text-gray-600">Saturday: 9:00 AM - 2:00 PM</p>
              <p className="text-sm text-gray-600">Sunday: Closed</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">WhatsApp Support</h3>
              <p className="text-sm text-gray-600">24/7 for urgent matters</p>
              <p className="text-sm text-gray-600">Response time: Within 2 hours</p>
            </div>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the chat support system. 
            The actual implementation will include real-time messaging, file sharing, 
            automated responses, and integration with WhatsApp Business API.
          </p>
        </div>
      </div>
    </div>
  );
}
