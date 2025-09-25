// Icons will be imported when needed

export default function ProtectedAdminReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Reporting System</h1>
          <p className="text-gray-600">Generate comprehensive reports and analytics</p>
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <h3 className="font-medium text-lg mb-2">Financial Reports</h3>
            <p className="text-sm text-gray-600 mb-4">Revenue, loans, and financial performance</p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" disabled>
              Generate Report
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">👥</span>
            </div>
            <h3 className="font-medium text-lg mb-2">User Analytics</h3>
            <p className="text-sm text-gray-600 mb-4">User behavior and engagement metrics</p>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors" disabled>
              Generate Report
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">⚖️</span>
            </div>
            <h3 className="font-medium text-lg mb-2">Compliance Reports</h3>
            <p className="text-sm text-gray-600 mb-4">Regulatory compliance and audit trails</p>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors" disabled>
              Generate Report
            </button>
          </div>
        </div>

        {/* Quick Reports */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Quick Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Summary */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-4">Daily Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Applications:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Approved Loans:</span>
                  <span className="font-medium text-green-600">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Disbursed:</span>
                  <span className="font-medium">N$45,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue:</span>
                  <span className="font-medium text-blue-600">N$2,250</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Download Daily Report
              </button>
            </div>
            
            {/* Weekly Overview */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-4">Weekly Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Applications:</span>
                  <span className="font-medium">67</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Approval Rate:</span>
                  <span className="font-medium text-green-600">74.6%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Loan:</span>
                  <span className="font-medium">N$6,800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Weekly Revenue:</span>
                  <span className="font-medium text-blue-600">N$12,450</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg" disabled>
                Download Weekly Report
              </button>
            </div>
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Scheduled Reports</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" disabled>
              + Schedule New Report
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium">Monthly Financial Report</h3>
                <p className="text-sm text-gray-600">Revenue, loans, and performance metrics</p>
                <p className="text-xs text-gray-500">Next run: 1 Feb 2025, 9:00 AM</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                  Disable
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium">Weekly Compliance Report</h3>
                <p className="text-sm text-gray-600">Regulatory compliance and risk metrics</p>
                <p className="text-xs text-gray-500">Next run: 27 Jan 2025, 8:00 AM</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                  Disable
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium">Quarterly Business Review</h3>
                <p className="text-sm text-gray-600">Comprehensive business performance analysis</p>
                <p className="text-xs text-gray-500">Next run: 31 Mar 2025, 10:00 AM</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                  Disable
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Templates */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Report Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-4">Executive Summary</h3>
              <p className="text-sm text-gray-600 mb-4">High-level overview for stakeholders and management</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Key performance indicators</p>
                <p>• Financial highlights</p>
                <p>• Risk assessment</p>
                <p>• Strategic recommendations</p>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Use Template
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-4">Regulatory Report</h3>
              <p className="text-sm text-gray-600 mb-4">Compliance report for NAMFISA and regulators</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Compliance metrics</p>
                <p>• Risk indicators</p>
                <p>• Audit findings</p>
                <p>• Corrective actions</p>
              </div>
              <button className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg" disabled>
                Use Template
              </button>
            </div>
          </div>
        </div>

        {/* Report Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Report Management Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" disabled>
              📊 Generate Custom Report
            </button>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" disabled>
              📅 Schedule Reports
            </button>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors" disabled>
              📋 Manage Templates
            </button>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors" disabled>
              📤 Export Data
            </button>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the admin reporting system. 
            The actual implementation will include automated report generation, customizable templates, 
            scheduled reporting, and comprehensive analytics for business intelligence and compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
