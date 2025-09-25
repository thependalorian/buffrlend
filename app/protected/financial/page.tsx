// Icons will be imported when needed

export default function ProtectedFinancialPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Financial Tools</h1>
          <p className="text-gray-600">Plan your finances and calculate loan scenarios</p>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Credit Score</h3>
            <p className="text-2xl font-bold text-green-600">720</p>
            <p className="text-xs text-gray-500">Good standing</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Debt-to-Income</h3>
            <p className="text-2xl font-bold text-blue-600">22%</p>
            <p className="text-xs text-gray-500">Well below limit</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Available Credit</h3>
            <p className="text-2xl font-bold text-purple-600">N$15,000</p>
            <p className="text-xs text-gray-500">Based on salary</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Payment History</h3>
            <p className="text-2xl font-bold text-green-600">100%</p>
            <p className="text-xs text-gray-500">On-time payments</p>
          </div>
        </div>

        {/* Loan Calculator */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Loan Calculator</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount (N$)
                </label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  defaultValue="5000"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>N$500</span>
                  <span>N$10,000</span>
                </div>
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-blue-600">N$5,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                  <option>1 month</option>
                  <option>2 months</option>
                  <option selected>3 months</option>
                  <option>4 months</option>
                  <option>5 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Salary (N$)
                </label>
                <input
                  type="number"
                  placeholder="Enter your monthly salary"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>

              <div className="pt-4">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                  Calculate Loan
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Loan Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Principal Amount:</span>
                  <span className="font-medium">N$5,000</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest (15%):</span>
                  <span className="font-medium">N$750</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-medium">N$50</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Stamp Duty:</span>
                  <span className="font-medium">N$15</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">NAMFISA Levy (4%):</span>
                  <span className="font-medium">N$200</span>
                </div>
                
                <hr className="border-gray-300" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Repayment:</span>
                  <span className="text-blue-600">N$6,015</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment:</span>
                  <span className="font-medium">N$2,005</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary Deduction:</span>
                  <span className="font-medium">13.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Health Assessment */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Financial Health Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h3 className="font-medium text-lg">Debt Management</h3>
              <p className="text-2xl font-bold text-green-600">Excellent</p>
              <p className="text-sm text-gray-600">Well below 33% threshold</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-2xl">📊</span>
              </div>
              <h3 className="font-medium text-lg">Payment History</h3>
              <p className="text-2xl font-bold text-blue-600">Perfect</p>
              <p className="text-sm text-gray-600">100% on-time payments</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-2xl">🎯</span>
              </div>
              <h3 className="font-medium text-lg">Credit Score</h3>
              <p className="text-2xl font-bold text-purple-600">720</p>
              <p className="text-sm text-gray-600">Good credit standing</p>
            </div>
          </div>
        </div>

        {/* Payment Planning Tools */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Payment Planning Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-4">Early Payment Calculator</h3>
              <p className="text-sm text-gray-600 mb-4">
                See how much you can save by making early payments
              </p>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg" disabled>
                Calculate Savings
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-4">Refinancing Options</h3>
              <p className="text-sm text-gray-600 mb-4">
                Explore refinancing options for better terms
              </p>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Check Eligibility
              </button>
            </div>
          </div>
        </div>

        {/* Financial Education */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Financial Education Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-2">Budgeting Tips</h3>
              <p className="text-sm text-gray-600 mb-4">
                Learn effective budgeting strategies for financial success
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                Read More →
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-2">Credit Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                Understand how to build and maintain good credit
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                Read More →
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-2">Emergency Fund</h3>
              <p className="text-sm text-gray-600 mb-4">
                Build financial resilience with emergency savings
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                Read More →
              </button>
            </div>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the financial tools system. 
            The actual implementation will include real-time loan calculations, interactive 
            financial planning tools, credit score monitoring, and personalized financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
