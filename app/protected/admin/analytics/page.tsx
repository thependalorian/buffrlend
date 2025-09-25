// Icons will be imported when needed

export default function ProtectedAdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into business performance and metrics</p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Portfolio Value</h3>
                <p className="text-2xl font-bold text-green-600">N$2.4M</p>
                <p className="text-xs text-gray-500">+12.5% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">📈</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Active Loans</h3>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
                <p className="text-xs text-gray-500">+8.3% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">💰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Default Rate</h3>
                <p className="text-2xl font-bold text-red-600">2.1%</p>
                <p className="text-xs text-gray-500">-0.3% from last month</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
                <p className="text-2xl font-bold text-purple-600">N$180K</p>
                <p className="text-xs text-gray-500">+15.2% from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl">💎</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Revenue Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Revenue Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Interest Income</span>
                  <span className="font-medium">N$145,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Processing Fees</span>
                  <span className="font-medium">N$18,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Late Fees</span>
                  <span className="font-medium">N$8,300</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Other Income</span>
                  <span className="font-medium">N$8,000</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total Revenue</span>
                  <span className="text-green-600">N$180,000</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Monthly Trends</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">January</span>
                  <span className="font-medium">N$165,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">February</span>
                  <span className="font-medium">N$172,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">March</span>
                  <span className="font-medium">N$178,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">April</span>
                  <span className="font-medium">N$180,000</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Growth Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Month-over-Month</span>
                  <span className="font-medium text-green-600">+1.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quarter-over-Quarter</span>
                  <span className="font-medium text-green-600">+8.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Year-over-Year</span>
                  <span className="font-medium text-green-600">+23.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Portfolio Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Loan Portfolio Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-medium text-lg">Portfolio Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">N$1,000 - N$5,000</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">N$5,000 - N$10,000</span>
                    <span className="text-sm font-medium">38%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '38%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Above N$10,000</span>
                    <span className="text-sm font-medium">17%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '17%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-medium text-lg">Risk Assessment</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-gray-600">Low Risk</span>
                  <span className="text-sm font-medium text-green-600">78%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-sm text-gray-600">Medium Risk</span>
                  <span className="text-sm font-medium text-yellow-600">18%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-sm text-gray-600">High Risk</span>
                  <span className="text-sm font-medium text-red-600">4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Customer Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Customer Demographics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Age 25-35</span>
                  <span className="font-medium">42%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Age 36-45</span>
                  <span className="font-medium">38%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Age 46-55</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Age 55+</span>
                  <span className="font-medium">5%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Employment Sectors</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Manufacturing</span>
                  <span className="font-medium">28%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Services</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Retail</span>
                  <span className="font-medium">22%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Other</span>
                  <span className="font-medium">15%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Customer Satisfaction</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Very Satisfied</span>
                  <span className="font-medium text-green-600">65%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Satisfied</span>
                  <span className="font-medium text-blue-600">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Neutral</span>
                  <span className="font-medium text-yellow-600">8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dissatisfied</span>
                  <span className="font-medium text-red-600">2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-medium text-lg">Operational Efficiency</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Processing Time</span>
                  <span className="font-medium">2.3 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">KYC Completion Rate</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Loan Approval Rate</span>
                  <span className="font-medium text-green-600">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Customer Onboarding Time</span>
                  <span className="font-medium">15 minutes</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-medium text-lg">Financial Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capital Adequacy Ratio</span>
                  <span className="font-medium text-green-600">18.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Liquidity Ratio</span>
                  <span className="font-medium text-green-600">125%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Return on Assets</span>
                  <span className="font-medium text-green-600">12.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cost-to-Income Ratio</span>
                  <span className="font-medium text-green-600">45.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Trend Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-4">Loan Volume Trends</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Q1 2025</span>
                  <span className="font-medium">N$520K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Q2 2025</span>
                  <span className="font-medium">N$580K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Q3 2025</span>
                  <span className="font-medium">N$640K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Q4 2025</span>
                  <span className="font-medium">N$660K</span>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-4">Customer Growth</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">January</span>
                  <span className="font-medium">1,180</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">February</span>
                  <span className="font-medium">1,210</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">March</span>
                  <span className="font-medium">1,235</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">April</span>
                  <span className="font-medium">1,247</span>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-4">Market Share</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Buffr Lend</span>
                  <span className="font-medium text-blue-600">23.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Competitor A</span>
                  <span className="font-medium">18.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Competitor B</span>
                  <span className="font-medium">15.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Others</span>
                  <span className="font-medium">42.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export & Reporting */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Export & Reporting</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Generate detailed reports and export data for further analysis
            </p>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Generate Report
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg" disabled>
                Export Data
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg" disabled>
                Schedule Reports
              </button>
            </div>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the admin analytics system. 
            The actual implementation will include real-time data visualization, interactive 
            charts, predictive analytics, and comprehensive business intelligence tools.
          </p>
        </div>
      </div>
    </div>
  );
}
