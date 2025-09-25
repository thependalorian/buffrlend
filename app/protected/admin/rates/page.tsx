// Icons will be imported when needed

export default function RatesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Rate Configuration</h1>
          <p className="text-gray-600">Manage loan interest rates and fee structures</p>
        </div>

        {/* Rate Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Base Interest Rate</h3>
            <p className="text-2xl font-bold text-blue-600">15.5%</p>
            <p className="text-xs text-gray-500">Annual percentage rate</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Processing Fee</h3>
            <p className="text-2xl font-bold text-green-600">N$250</p>
            <p className="text-xs text-gray-500">Per application</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Late Payment Fee</h3>
            <p className="text-2xl font-bold text-orange-600">N$100</p>
            <p className="text-xs text-gray-500">Per late payment</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Rate Plans</h3>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-gray-500">Currently active</p>
          </div>
        </div>

        {/* Rate Plans */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Rate Plans</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" disabled>
              + Add New Plan
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Standard Plan */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-lg">Standard Plan</h3>
                  <p className="text-sm text-gray-600">Basic loan package for all users</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Interest Rate:</span>
                  <p className="font-medium">15.5% APR</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Processing Fee:</span>
                  <p className="font-medium">N$250</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Loan Range:</span>
                  <p className="font-medium">N$1,000 - N$15,000</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Term Range:</span>
                  <p className="font-medium">2 - 6 months</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                  Edit
                </button>
                <button className="text-orange-600 hover:text-orange-800 text-sm font-medium" disabled>
                  Deactivate
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                  Delete
                </button>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-lg">Premium Plan</h3>
                  <p className="text-sm text-gray-600">Lower rates for verified users</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Interest Rate:</span>
                  <p className="font-medium">12.5% APR</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Processing Fee:</span>
                  <p className="font-medium">N$200</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Loan Range:</span>
                  <p className="font-medium">N$5,000 - N$25,000</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Term Range:</span>
                  <p className="font-medium">3 - 12 months</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                  Edit
                </button>
                <button className="text-orange-600 hover:text-orange-800 text-sm font-medium" disabled>
                  Deactivate
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                  Delete
                </button>
              </div>
            </div>
            
            {/* Emergency Plan */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-lg">Emergency Plan</h3>
                  <p className="text-sm text-gray-600">Quick loans for urgent needs</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Interest Rate:</span>
                  <p className="font-medium">18.0% APR</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Processing Fee:</span>
                  <p className="font-medium">N$300</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Loan Range:</span>
                  <p className="font-medium">N$500 - N$5,000</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Term Range:</span>
                  <p className="font-medium">1 - 3 months</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                  Edit
                </button>
                <button className="text-orange-600 hover:text-orange-800 text-sm font-medium" disabled>
                  Deactivate
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Structure */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Fee Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Application Fees */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Application Fees</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <span className="font-medium">Processing Fee</span>
                  <span className="text-green-600 font-medium">N$250</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <span className="font-medium">KYC Verification</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <span className="font-medium">Document Processing</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
            </div>
            
            {/* Penalty Fees */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Penalty Fees</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <span className="font-medium">Late Payment</span>
                  <span className="text-orange-600 font-medium">N$100</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <span className="font-medium">Default Fee</span>
                  <span className="text-red-600 font-medium">N$500</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <span className="font-medium">Early Repayment</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Rate Management Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" disabled>
              📊 Generate Rate Report
            </button>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" disabled>
              🔄 Update Rates
            </button>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors" disabled>
              📋 Fee Structure
            </button>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors" disabled>
              ⚙️ Advanced Settings
            </button>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the admin rate configuration system. 
            The actual implementation will include dynamic rate management, automated rate adjustments, 
            fee structure configuration, and comprehensive rate analytics for competitive positioning.
          </p>
        </div>
      </div>
    </div>
  );
}
