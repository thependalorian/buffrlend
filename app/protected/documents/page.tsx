/**
 * Documents Page
 * 
 * Purpose: Document management center for KYC documents, loan agreements, and user files
 * Location: /app/protected/documents/page.tsx
 * Features: Document upload, organization, verification status, and storage
 */

import { FileText, ClipboardList } from 'lucide-react';

export default function ProtectedDocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600">Manage your loan documents and applications</p>
        </div>

        {/* Document Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Documents</h3>
            <p className="text-2xl font-bold">24</p>
            <p className="text-xs text-gray-500">All time</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
            <p className="text-2xl font-bold text-orange-600">3</p>
            <p className="text-xs text-gray-500">Awaiting approval</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-bold text-green-600">18</p>
            <p className="text-xs text-gray-500">Successfully processed</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
            <p className="text-2xl font-bold text-red-600">3</p>
            <p className="text-xs text-gray-500">Requires resubmission</p>
          </div>
        </div>

        {/* Document Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Document Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" disabled>
              <FileText className="w-5 h-5 inline mr-2" /> Upload New Document
            </button>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" disabled>
              <ClipboardList className="w-5 h-5 inline mr-2" /> Generate Report
            </button>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors" disabled>
              🔍 Search Documents
            </button>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors" disabled>
              📤 Export All
            </button>
          </div>
        </div>

        {/* Document Categories */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Document Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🆔</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Identity Documents</h3>
                  <p className="text-sm text-gray-600">8 documents</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Namibian ID</span>
                  <span className="text-green-600">✓ Verified</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Passport</span>
                  <span className="text-green-600">✓ Verified</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Driver&apos;s License</span>
                  <span className="text-orange-600">⏳ Pending</span>
                </div>
              </div>
              <button className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                View All
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">💼</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Employment Documents</h3>
                  <p className="text-sm text-gray-600">6 documents</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Employment Letter</span>
                  <span className="text-green-600">✓ Verified</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payslips (3 months)</span>
                  <span className="text-green-600">✓ Verified</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bank Statements</span>
                  <span className="text-orange-600">⏳ Pending</span>
                </div>
              </div>
              <button className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                View All
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Loan Documents</h3>
                  <p className="text-sm text-gray-600">10 documents</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Loan Applications</span>
                  <span className="text-green-600">✓ Approved</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Loan Agreements</span>
                  <span className="text-green-600">✓ Signed</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment Schedules</span>
                  <span className="text-green-600">✓ Generated</span>
                </div>
              </div>
              <button className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                View All
              </button>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Recent Documents</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Document Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Upload Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">Driver&apos;s License</td>
                  <td className="py-3 px-4 text-sm">Identity Document</td>
                  <td className="py-3 px-4 text-sm">20 Jan 2025</td>
                  <td className="py-3 px-4">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      Pending Review
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                      View
                    </button>
                  </td>
                </tr>
                
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">Bank Statement - Jan 2025</td>
                  <td className="py-3 px-4 text-sm">Financial Document</td>
                  <td className="py-3 px-4 text-sm">18 Jan 2025</td>
                  <td className="py-3 px-4">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      Pending Review
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                      View
                    </button>
                  </td>
                </tr>
                
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">Loan Agreement - BL-2025-002</td>
                  <td className="py-3 px-4 text-sm">Loan Document</td>
                  <td className="py-3 px-4 text-sm">15 Jan 2025</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Approved
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                      Download
                    </button>
                  </td>
                </tr>
                
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">Employment Letter</td>
                  <td className="py-3 px-4 text-sm">Employment Document</td>
                  <td className="py-3 px-4 text-sm">10 Jan 2025</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-center">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
              View All Documents
            </button>
          </div>
        </div>

        {/* Document Upload Area */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Upload New Document</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your document</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
              <p>Maximum file size: 10MB</p>
            </div>
            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" disabled>
              Choose Files
            </button>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the document management system. 
            The actual implementation will include real-time document tracking, secure file storage, 
            automated KYC verification, and integration with the loan application system.
          </p>
        </div>
      </div>
    </div>
  );
}
