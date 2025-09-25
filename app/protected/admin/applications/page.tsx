// Icons will be imported when needed

export default function ProtectedAdminApplicationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Loan Applications Management</h1>
          <p className="text-gray-600">Review and manage loan applications from users</p>
        </div>

        {/* Application Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs text-gray-500">All time</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
            <p className="text-2xl font-bold text-orange-600">23</p>
            <p className="text-xs text-gray-500">Awaiting decision</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-bold text-green-600">98</p>
            <p className="text-xs text-gray-500">Successfully approved</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
            <p className="text-2xl font-bold text-red-600">28</p>
            <p className="text-xs text-gray-500">Declined applications</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Under Review</h3>
            <p className="text-2xl font-bold text-blue-600">7</p>
            <p className="text-xs text-gray-500">Currently reviewing</p>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Filter Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>All Statuses</option>
                <option>Pending Review</option>
                <option>Under Review</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>All Amounts</option>
                <option>N$1,000 - N$5,000</option>
                <option>N$5,000 - N$10,000</option>
                <option>Above N$10,000</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>Last 30 Days</option>
                <option>Last 60 Days</option>
                <option>Last 90 Days</option>
                <option>Custom Range</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>All Risk Levels</option>
                <option>Low Risk</option>
                <option>Medium Risk</option>
                <option>High Risk</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Recent Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Application ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Applicant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Loan Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Term</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Risk Level</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">APP-2025-001</td>
                  <td className="py-3 px-4 text-sm">John Doe</td>
                  <td className="py-3 px-4 text-sm font-medium">N$8,000</td>
                  <td className="py-3 px-4 text-sm">3 months</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Low Risk
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      Pending Review
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">20 Jan 2025</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        Review
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium" disabled>
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">APP-2025-002</td>
                  <td className="py-3 px-4 text-sm">Jane Smith</td>
                  <td className="py-3 px-4 text-sm font-medium">N$12,000</td>
                  <td className="py-3 px-4 text-sm">6 months</td>
                  <td className="py-3 px-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Medium Risk
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Under Review
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">18 Jan 2025</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        Review
                      </button>
                      <button className="text-orange-600 hover:text-orange-800 text-sm font-medium" disabled>
                        Request Info
                      </button>
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">APP-2025-003</td>
                  <td className="py-3 px-4 text-sm">Mike Johnson</td>
                  <td className="py-3 px-4 text-sm font-medium">N$5,000</td>
                  <td className="py-3 px-4 text-sm">2 months</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Low Risk
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Approved
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">15 Jan 2025</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium" disabled>
                        Generate Agreement
                      </button>
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">APP-2025-004</td>
                  <td className="py-3 px-4 text-sm">Sarah Wilson</td>
                  <td className="py-3 px-4 text-sm font-medium">N$15,000</td>
                  <td className="py-3 px-4 text-sm">4 months</td>
                  <td className="py-3 px-4">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      High Risk
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Rejected
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">12 Jan 2025</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        View
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                        Appeal
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 1-4 of 156 applications
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm" disabled>
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm" disabled>
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm" disabled>
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm" disabled>
                3
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm" disabled>
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Bulk Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" disabled>
              ✅ Approve Selected
            </button>
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors" disabled>
              ❌ Reject Selected
            </button>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" disabled>
              📧 Send Notifications
            </button>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors" disabled>
              📊 Generate Report
            </button>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors" disabled>
              🔍 Advanced Search
            </button>
          </div>
        </div>

        {/* Application Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Application Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-lg mb-4">Approval Rate</h3>
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl font-bold">63%</span>
              </div>
              <p className="text-sm text-gray-600">98 approved out of 156 total</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-lg mb-4">Average Processing Time</h3>
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">2.3</span>
              </div>
              <p className="text-sm text-gray-600">Days to process applications</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-lg mb-4">Risk Distribution</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Low Risk:</span>
                  <span className="text-green-600">65%</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Risk:</span>
                  <span className="text-yellow-600">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>High Risk:</span>
                  <span className="text-red-600">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the admin loan applications management system. 
            The actual implementation will include real-time application tracking, AI-powered risk assessment, 
            automated approval workflows, and comprehensive reporting for compliance and decision-making.
          </p>
        </div>
      </div>
    </div>
  );
}
