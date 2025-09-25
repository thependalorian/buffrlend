// Icons will be imported when needed

export default function ProtectedAdminVerificationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">KYC Verification Management</h1>
          <p className="text-gray-600">Manage Know Your Customer verification processes</p>
        </div>

        {/* Verification Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Verification</h3>
            <p className="text-2xl font-bold text-yellow-600">45</p>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Under Review</h3>
            <p className="text-2xl font-bold text-blue-600">23</p>
            <p className="text-xs text-gray-500">Currently reviewing</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Approved Today</h3>
            <p className="text-2xl font-bold text-green-600">18</p>
            <p className="text-xs text-gray-500">Verifications completed</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Rejected Today</h3>
            <p className="text-2xl font-bold text-red-600">7</p>
            <p className="text-xs text-gray-500">Verifications failed</p>
          </div>
        </div>

        {/* Verification Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Filter Verifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Under Review</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Escalated</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>All Priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>All Documents</option>
                <option>ID Card</option>
                <option>Passport</option>
                <option>Driver&apos;s License</option>
                <option>Utility Bill</option>
                <option>Bank Statement</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>All Time</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Verification Queue */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Verification Queue</h2>
            <div className="flex space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg" disabled>
                Bulk Approve
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Export Queue
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User Info</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Documents</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* High Priority - Pending */}
                <tr className="bg-red-50">
                  <td className="py-3 px-4 text-sm font-medium">USR-2025-001</td>
                  <td className="py-3 px-4 text-sm">
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-xs text-gray-500">john.doe@email.com</p>
                      <p className="text-xs text-gray-500">+264 61 123 4567</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="space-y-1">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">ID Card</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Utility Bill</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      High
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">2 hours ago</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        Review
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium" disabled>
                        Approve
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Medium Priority - Under Review */}
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 text-sm font-medium">USR-2025-002</td>
                  <td className="py-3 px-4 text-sm">
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-xs text-gray-500">sarah.j@email.com</p>
                      <p className="text-xs text-gray-500">+264 61 123 4568</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="space-y-1">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Passport</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Bank Statement</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Under Review
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Medium
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">4 hours ago</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        Continue Review
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium" disabled>
                        Approve
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Low Priority - Pending */}
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">USR-2025-003</td>
                  <td className="py-3 px-4 text-sm">
                    <div>
                      <p className="font-medium">Michael Brown</p>
                      <p className="text-xs text-gray-500">m.brown@email.com</p>
                      <p className="text-xs text-gray-500">+264 61 123 4569</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="space-y-1">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Driver&apos;s License</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Utility Bill</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Low
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">6 hours ago</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        Review
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium" disabled>
                        Approve
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Escalated Case */}
                <tr className="bg-orange-50">
                  <td className="py-3 px-4 text-sm font-medium">USR-2025-004</td>
                  <td className="py-3 px-4 text-sm">
                    <div>
                      <p className="font-medium">Emily Davis</p>
                      <p className="text-xs text-gray-500">emily.d@email.com</p>
                      <p className="text-xs text-gray-500">+264 61 123 4570</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="space-y-1">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">ID Card</span>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Missing Documents</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      Escalated
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      High
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">1 day ago</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        Review
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-800 text-sm font-medium" disabled>
                        Request More Info
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Review Panel */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Document Review</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Document Viewer */}
            <div className="space-y-6">
              <h3 className="font-medium text-lg">Document Preview</h3>
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">ID Card - Front View</p>
                  <p className="text-xs text-gray-500">Uploaded: 2 hours ago</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center" disabled>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium">View Full Size</span>
                </button>
                
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-center" disabled>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium">Download</span>
                </button>
              </div>
            </div>
            
            {/* Verification Form */}
            <div className="space-y-6">
              <h3 className="font-medium text-lg">Verification Decision</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Quality</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                    <option>Select quality rating...</option>
                    <option>Excellent - Clear and legible</option>
                    <option>Good - Minor issues</option>
                    <option>Fair - Some blurriness</option>
                    <option>Poor - Difficult to read</option>
                    <option>Unacceptable - Cannot verify</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Authenticity</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="authenticity" className="mr-2" disabled />
                      <span className="text-sm">Authentic - No signs of tampering</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="authenticity" className="mr-2" disabled />
                      <span className="text-sm">Suspicious - Potential tampering</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="authenticity" className="mr-2" disabled />
                      <span className="text-sm">Fake - Clearly fraudulent</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Information Match</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" disabled />
                      <span className="text-sm">Name matches user profile</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" disabled />
                      <span className="text-sm">Date of birth matches</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" disabled />
                      <span className="text-sm">Address information matches</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded mr-2" disabled />
                      <span className="text-sm">Document is not expired</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Add verification notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg" disabled>
                  Approve Verification
                </button>
                <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg" disabled>
                  Reject Verification
                </button>
                <button className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg" disabled>
                  Request More Info
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Workflow */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Verification Workflow</h2>
          <div className="space-y-6">
            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium">Document Upload</h3>
                <p className="text-xs text-gray-500">User submits documents</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium">Initial Review</h3>
                <p className="text-xs text-gray-500">AI-powered screening</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium">Manual Review</h3>
                <p className="text-xs text-gray-500">Admin verification</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium">Decision</h3>
                <p className="text-xs text-gray-500">Approve/Reject</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium">Completion</h3>
                <p className="text-xs text-gray-500">User notified</p>
              </div>
            </div>
            
            {/* Current Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Current Workflow Status</h3>
              <p className="text-sm text-blue-800">
                <strong>John Doe (USR-2025-001):</strong> Currently at Manual Review stage. 
                Documents have passed AI screening and are awaiting admin verification. 
                Priority: High due to loan application urgency.
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Monitoring */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Compliance Monitoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Compliance Metrics */}
            <div>
              <h3 className="font-medium text-lg mb-4">Compliance Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Verification Rate</span>
                  <span className="text-sm text-gray-600">94.2%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Average Processing Time</span>
                  <span className="text-sm text-gray-600">4.3 hours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Fraud Detection Rate</span>
                  <span className="text-sm text-gray-600">2.1%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Regulatory Compliance</span>
                  <span className="text-sm text-gray-600">99.8%</span>
                </div>
              </div>
            </div>
            
            {/* Risk Alerts */}
            <div>
              <h3 className="font-medium text-lg mb-4">Risk Alerts</h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-red-800">High Risk</span>
                  </div>
                  <p className="text-sm text-red-700">Multiple failed verification attempts detected</p>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-800">Medium Risk</span>
                  </div>
                  <p className="text-sm text-yellow-700">Document quality below threshold</p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">Low Risk</span>
                  </div>
                  <p className="text-sm text-green-700">All verifications within normal range</p>
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
              <span className="text-sm font-medium">Add Verifier</span>
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
              <span className="text-sm font-medium">Risk Assessment</span>
            </button>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the KYC verification management system. 
            The actual implementation will include real-time document verification, AI-powered fraud 
            detection, comprehensive compliance monitoring, and automated workflow management.
          </p>
        </div>
      </div>
    </div>
  );
}
