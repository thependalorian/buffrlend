// Icons will be imported when needed

export default function ProtectedAdminChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Customer Support Management</h1>
          <p className="text-gray-600">Manage customer support chats and escalations</p>
        </div>

        {/* Support Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Chats</h3>
            <p className="text-2xl font-bold text-blue-600">24</p>
            <p className="text-xs text-gray-500">Currently active</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Waiting</h3>
            <p className="text-2xl font-bold text-yellow-600">12</p>
            <p className="text-xs text-gray-500">In queue</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Resolved Today</h3>
            <p className="text-2xl font-bold text-green-600">47</p>
            <p className="text-xs text-gray-500">Chats closed</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Avg Response</h3>
            <p className="text-2xl font-bold text-purple-600">2.3m</p>
            <p className="text-xs text-gray-500">Response time</p>
          </div>
        </div>

        {/* Chat Management Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Chats List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Active Chats</h2>
              <div className="mt-2 flex space-x-2">
                <select className="px-3 py-1 text-sm border border-gray-300 rounded-md" disabled>
                  <option>All Agents</option>
                  <option>Sarah Johnson</option>
                  <option>Mike Chen</option>
                  <option>Lisa Rodriguez</option>
                </select>
                <select className="px-3 py-1 text-sm border border-gray-300 rounded-md" disabled>
                  <option>All Priorities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {/* Chat Item - High Priority */}
              <div className="p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer bg-red-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">John Doe</span>
                  </div>
                  <span className="text-xs text-gray-500">2 min ago</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Having issues with loan application...</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">High Priority</span>
                  <span className="text-xs text-gray-500">Agent: Sarah</span>
                </div>
              </div>
              
              {/* Chat Item - Medium Priority */}
              <div className="p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">Emily Davis</span>
                  </div>
                  <span className="text-xs text-gray-500">5 min ago</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Question about payment schedule...</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Medium</span>
                  <span className="text-xs text-gray-500">Agent: Mike</span>
                </div>
              </div>
              
              {/* Chat Item - Low Priority */}
              <div className="p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Michael Brown</span>
                  </div>
                  <span className="text-xs text-gray-500">8 min ago</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">General inquiry about services...</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Low</span>
                  <span className="text-xs text-gray-500">Agent: Lisa</span>
                </div>
              </div>
              
              {/* Chat Item - Waiting */}
              <div className="p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-sm font-medium">David Wilson</span>
                  </div>
                  <span className="text-xs text-gray-500">12 min ago</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Technical support needed...</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Waiting</span>
                  <span className="text-xs text-gray-500">Unassigned</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">John Doe</h3>
                  <p className="text-sm text-gray-600">Loan Application Support</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">High Priority</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                    Escalate
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium" disabled>
                    Resolve
                  </button>
                </div>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {/* Customer Message */}
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-900">Hi, I&apos;m having trouble with my loan application. It keeps showing an error when I try to submit.</p>
                    <p className="text-xs text-gray-500 mt-1">2:30 PM</p>
                  </div>
                </div>
              </div>
              
              {/* Agent Message */}
              <div className="flex justify-end">
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-blue-600 text-white rounded-lg p-3">
                    <p className="text-sm">Hello John! I&apos;m sorry to hear you&apos;re experiencing issues. Let me help you with that. Can you tell me what specific error message you&apos;re seeing?</p>
                    <p className="text-xs text-blue-200 mt-1">2:32 PM</p>
                  </div>
                </div>
              </div>
              
              {/* Customer Message */}
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-900">It says &quot;Document verification failed&quot; but I&apos;ve uploaded all the required documents.</p>
                    <p className="text-xs text-gray-500 mt-1">2:33 PM</p>
                  </div>
                </div>
              </div>
              
              {/* Agent Message */}
              <div className="flex justify-end">
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-blue-600 text-white rounded-lg p-3">
                    <p className="text-sm">I can see the issue. Let me check your uploaded documents and verify what might be causing this. Can you give me a moment to review your file?</p>
                    <p className="text-xs text-blue-200 mt-1">2:34 PM</p>
                  </div>
                </div>
              </div>
              
              {/* Typing Indicator */}
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  disabled
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Support Team Management */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Support Team Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Agent Status */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Sarah Johnson</h3>
                  <p className="text-sm text-gray-600">Senior Support Agent</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Chats:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Resolved Today:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Response:</span>
                  <span className="font-medium">1.8m</span>
                </div>
              </div>
            </div>
            
            {/* Agent Status */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Mike Chen</h3>
                  <p className="text-sm text-gray-600">Support Agent</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Chats:</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Resolved Today:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Response:</span>
                  <span className="font-medium">2.5m</span>
                </div>
              </div>
            </div>
            
            {/* Agent Status */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Lisa Rodriguez</h3>
                  <p className="text-sm text-gray-600">Support Agent</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span className="text-yellow-600 font-medium">Away</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Chats:</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Resolved Today:</span>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Response:</span>
                  <span className="font-medium">3.1m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Chat Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Response Time Metrics */}
            <div>
              <h3 className="font-medium text-lg mb-4">Response Time Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">First Response</span>
                  <span className="text-sm text-gray-600">2.3 minutes</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Average Response</span>
                  <span className="text-sm text-gray-600">1.8 minutes</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Resolution Time</span>
                  <span className="text-sm text-gray-600">15.2 minutes</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <span className="text-sm text-gray-600">4.7/5.0</span>
                </div>
              </div>
            </div>
            
            {/* Chat Volume */}
            <div>
              <h3 className="font-medium text-lg mb-4">Chat Volume</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Today</span>
                  <span className="text-sm text-gray-600">47 chats</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">This Week</span>
                  <span className="text-sm text-gray-600">312 chats</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">This Month</span>
                  <span className="text-sm text-gray-600">1,247 chats</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Peak Hours</span>
                  <span className="text-sm text-gray-600">2-4 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center" disabled>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium">Add Agent</span>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center" disabled>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Generate Report</span>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center" disabled>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Settings</span>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center" disabled>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Emergency</span>
            </button>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the customer support chat management system. 
            The actual implementation will include real-time chat functionality, automated routing, 
            performance analytics, and comprehensive support team management tools.
          </p>
        </div>
      </div>
    </div>
  );
}