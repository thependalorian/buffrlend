// Icons will be imported when needed

export default function KYCPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">KYC Verification Management</h1>
          <p className="text-gray-600">Manage Know Your Customer verification processes</p>
        </div>

        {/* KYC Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total KYC Requests</h3>
            <p className="text-2xl font-bold">89</p>
            <p className="text-xs text-gray-500">All time</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
            <p className="text-2xl font-bold text-orange-600">12</p>
            <p className="text-xs text-gray-500">Awaiting verification</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Verified</h3>
            <p className="text-2xl font-bold text-green-600">67</p>
            <p className="text-xs text-gray-500">Successfully verified</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
            <p className="text-2xl font-bold text-red-600">8</p>
            <p className="text-xs text-gray-500">Verification failed</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Under Review</h3>
            <p className="text-2xl font-bold text-blue-600">2</p>
            <p className="text-xs text-gray-500">Currently reviewing</p>
          </div>
        </div>

        {/* KYC Queue Priority */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-900">
                  High Priority KYC Queue
                </h3>
                <p className="text-orange-700">
                  5 applications require immediate attention • 3 have expired documents
                </p>
              </div>
            </div>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors" disabled>
              Review Priority Queue
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Filter KYC Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>All Statuses</option>
                <option>Pending Review</option>
                <option>Under Review</option>
                <option>Verified</option>
                <option>Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>All Documents</option>
                <option>National ID</option>
                <option>Passport</option>
                <option>Driver&apos;s License</option>
                <option>Employment Letter</option>
                <option>Bank Statement</option>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Custom Range</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* KYC Requests Table */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">KYC Verification Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Request ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Applicant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Document Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Risk Level</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-orange-50">
                  <td className="py-3 px-4 text-sm font-medium">KYC-2025-001</td>
                  <td className="py-3 px-4 text-sm">John Doe</td>
                  <td className="py-3 px-4 text-sm">Driver&apos;s License</td>
                  <td className="py-3 px-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Medium Risk
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
                  <td className="py-3 px-4 text-sm font-medium">KYC-2025-002</td>
                  <td className="py-3 px-4 text-sm">Jane Smith</td>
                  <td className="py-3 px-4 text-sm">Bank Statement</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Low Risk
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">19 Jan 2025</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium" disabled>
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the admin KYC verification management system. 
            The actual implementation will include real-time KYC tracking, AI-powered document verification, 
            automated risk assessment, and comprehensive compliance reporting for regulatory requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
