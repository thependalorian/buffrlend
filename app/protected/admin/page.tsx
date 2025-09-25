"use client";

export default function ProtectedAdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage loans, compliance, rates, and system</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              View Reports
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
              Manage Rates
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex space-x-1">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              Overview
            </button>
            <button 
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
              onClick={() => window.location.href = '/protected/admin/crm'}
            >
              CRM
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
              Loans
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
              KYC Review
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
              Compliance
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
              Rates
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
              Reports
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
              Users
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
              Settings
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Loans</h3>
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs text-green-600">+12% from last month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Disbursed</h3>
            <p className="text-2xl font-bold">N$2.4M</p>
            <p className="text-xs text-green-600">+8% from last month</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Applications</h3>
            <p className="text-2xl font-bold">23</p>
            <p className="text-xs text-yellow-600">5 high priority</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Default Rate</h3>
            <p className="text-2xl font-bold">1.5%</p>
            <p className="text-xs text-green-600">Below target (2%)</p>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-600">N$5,000 • 3 months</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Pending Review
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  View
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">Sarah Smith</p>
                <p className="text-sm text-gray-600">N$3,000 • 2 months</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Approved
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Verification Queue */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">KYC Verification Queue</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">James Wilson</p>
                <p className="text-sm text-gray-600">3 documents uploaded</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  High Priority
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Compliance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">98.5%</p>
              <p className="text-sm text-gray-600">Overall Compliance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">100%</p>
              <p className="text-sm text-gray-600">NAMFISA Compliant</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">97%</p>
              <p className="text-sm text-gray-600">Responsible Lending</p>
            </div>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the admin dashboard. 
            The actual implementation will include real-time data, interactive charts, 
            comprehensive reporting, and full administrative controls for loan management, 
            KYC verification, and compliance monitoring.
          </p>
        </div>
      </div>
    </div>
  );
}
