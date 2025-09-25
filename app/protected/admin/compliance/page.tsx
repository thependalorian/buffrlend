// Icons will be imported when needed

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Monitoring</h1>
          <p className="text-gray-600">Monitor regulatory compliance and risk management</p>
        </div>

        {/* Compliance Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Overall Compliance</h3>
            <p className="text-2xl font-bold text-green-600">98.5%</p>
            <p className="text-xs text-gray-500">Above threshold</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">NAMFISA Rating</h3>
            <p className="text-2xl font-bold text-blue-600">A+</p>
            <p className="text-xs text-gray-500">Excellent standing</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Risk Score</h3>
            <p className="text-2xl font-bold text-green-600">Low</p>
            <p className="text-xs text-gray-500">Minimal risk</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Audit Status</h3>
            <p className="text-2xl font-bold text-green-600">Clean</p>
            <p className="text-xs text-gray-500">No issues found</p>
          </div>
        </div>

        {/* Compliance Dashboard */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Compliance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Regulatory Requirements */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Regulatory Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="font-medium text-green-900">NAMFISA Compliance</span>
                  <span className="text-green-600">✅ Compliant</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="font-medium text-green-900">Anti-Money Laundering</span>
                  <span className="text-green-600">✅ Compliant</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="font-medium text-green-900">Data Protection</span>
                  <span className="text-green-600">✅ Compliant</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="font-medium text-yellow-900">Responsible Lending</span>
                  <span className="text-yellow-600">⚠️ Review Required</span>
                </div>
              </div>
            </div>
            
            {/* Risk Indicators */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Risk Indicators</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="font-medium text-green-900">Credit Risk</span>
                  <span className="text-green-600">Low (15%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="font-medium text-green-900">Operational Risk</span>
                  <span className="text-green-600">Low (8%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="font-medium text-yellow-900">Market Risk</span>
                  <span className="text-yellow-600">Medium (25%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="font-medium text-green-900">Liquidity Risk</span>
                  <span className="text-green-600">Low (12%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Compliance Events */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Recent Compliance Events</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Monthly Compliance Report Generated</h4>
                <p className="text-sm text-gray-600">All regulatory requirements met for January 2025</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📊</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Risk Assessment Completed</h4>
                <p className="text-sm text-gray-600">Quarterly risk assessment shows improved metrics</p>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm">⚠️</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Responsible Lending Review</h4>
                <p className="text-sm text-gray-600">3 applications flagged for additional review</p>
              </div>
              <span className="text-sm text-gray-500">2 days ago</span>
            </div>
          </div>
        </div>

        {/* Compliance Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Compliance Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" disabled>
              📊 Generate Report
            </button>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" disabled>
              🔍 Risk Assessment
            </button>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors" disabled>
              📋 Audit Trail
            </button>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors" disabled>
              ⚠️ Alert Management
            </button>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the admin compliance monitoring system. 
            The actual implementation will include real-time compliance tracking, automated risk assessment, 
            regulatory reporting, and comprehensive audit trails for NAMFISA and other regulatory requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
