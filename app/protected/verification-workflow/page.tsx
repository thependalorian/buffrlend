/**
 * Verification Workflow Page
 * 
 * Purpose: KYC workflow management and verification status tracking
 * Location: /app/protected/verification-workflow/page.tsx
 * Features: Workflow steps, verification status, document review process
 */

export default function ProtectedVerificationWorkflowPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Verification Workflow</h1>
          <p className="text-gray-600">Track your KYC verification progress and status</p>
        </div>

        {/* Verification Progress */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Verification Progress</h2>
          <div className="space-y-6">
            {/* Step 1: Identity Verification */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg">Identity Verification</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Verify your identity using government-issued documents
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-green-800">National ID verified on 15 Jan 2025</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-green-800">Passport verified on 15 Jan 2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Employment Verification */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg">Employment Verification</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Verify your employment status and salary information
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-green-800">Payslip verified on 15 Jan 2025</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-green-800">Employer partnership confirmed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Financial Assessment */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg">Financial Assessment</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Review your financial health and creditworthiness
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-green-800">Bank statement analyzed on 15 Jan 2025</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-green-800">Credit score: 720 (Good)</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-green-800">Debt-to-income ratio: 22% (Excellent)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Document Review */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                4
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg">Document Review</h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    In Progress
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Final review of all submitted documents
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-yellow-600">⏳</span>
                    <span className="text-sm text-yellow-800">Driver&apos;s License pending verification</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-yellow-600">⏳</span>
                    <span className="text-sm text-yellow-800">Employment Letter pending verification</span>
                  </div>
                  <div className="mt-3 p-3 bg-white rounded border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Action Required:</strong> Please ensure all documents are clear and legible. 
                      Some documents may require resubmission for better quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Final Approval */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                5
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg">Final Approval</h3>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    Pending
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Awaiting final verification and approval
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">⏳</span>
                    <span className="text-sm text-gray-800">Waiting for document review completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Verification Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Verification Started</p>
                <p className="text-sm text-gray-600">15 Jan 2025 at 09:30 AM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Identity Documents Submitted</p>
                <p className="text-sm text-gray-600">15 Jan 2025 at 10:15 AM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Identity Verification Completed</p>
                <p className="text-sm text-gray-600">15 Jan 2025 at 11:45 AM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Financial Documents Submitted</p>
                <p className="text-sm text-gray-600">15 Jan 2025 at 02:30 PM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Financial Assessment Completed</p>
                <p className="text-sm text-gray-600">15 Jan 2025 at 04:15 PM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Document Review Started</p>
                <p className="text-sm text-gray-600">16 Jan 2025 at 09:00 AM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Final Approval</p>
                <p className="text-sm text-gray-600">Estimated: 17 Jan 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Requirements */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Verification Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Required Documents</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </span>
                  <span className="text-sm">Valid National ID or Passport</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </span>
                  <span className="text-sm">Recent Payslip (last 3 months)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </span>
                  <span className="text-sm">Bank Statement (last 3 months)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-xs">!</span>
                  </span>
                  <span className="text-sm">Employment Verification Letter</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Verification Criteria</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </span>
                  <span className="text-sm">Age: 18+ years old</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </span>
                  <span className="text-sm">Namibian resident</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </span>
                  <span className="text-sm">Employed with partnered company</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </span>
                  <span className="text-sm">Minimum salary: N$5,000/month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Next Steps</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Immediate Action Required</h3>
              <p className="text-sm text-blue-800 mb-3">
                To complete your verification, please ensure the following documents are clear and legible:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 ml-4">
                <li>• Driver&apos;s License - ensure all text is clearly visible</li>
                <li>• Employment Letter - must include company letterhead and signature</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">What Happens Next</h3>
              <p className="text-sm text-green-800">
                Once all documents are verified, your application will proceed to final approval. 
                You&apos;ll receive an email notification with the decision and next steps for your loan application.
              </p>
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              If you have questions about the verification process, our support team is here to help.
            </p>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Contact Support
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg" disabled>
                WhatsApp Chat
              </button>
            </div>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the verification workflow system. 
            The actual implementation will include real-time status updates, automated verification 
            processes, AI-powered document analysis, and comprehensive workflow management.
          </p>
        </div>
      </div>
    </div>
  );
}
