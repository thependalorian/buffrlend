// Icons will be imported when needed

export default function ProtectedAdminUsersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">User Administration</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-xs text-gray-500">All time</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="text-2xl font-bold text-green-600">1,156</p>
            <p className="text-xs text-gray-500">Currently active</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Pending Verification</h3>
            <p className="text-2xl font-bold text-orange-600">67</p>
            <p className="text-xs text-gray-500">Awaiting KYC</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Suspended Users</h3>
            <p className="text-2xl font-bold text-red-600">24</p>
            <p className="text-xs text-gray-500">Temporarily suspended</p>
          </div>
        </div>

        {/* User Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">User Management Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" disabled>
              👤 Add New User
            </button>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" disabled>
              📧 Bulk Email
            </button>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors" disabled>
              📊 User Analytics
            </button>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors" disabled>
              🔍 Advanced Search
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Filter Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>All Statuses</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
                <option>Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>All Roles</option>
                <option>User</option>
                <option>Admin</option>
                <option>Super Admin</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">KYC Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                <option>All KYC Statuses</option>
                <option>Verified</option>
                <option>Pending</option>
                <option>Rejected</option>
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
            
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg" disabled>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">KYC Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">USR-2025-001</td>
                  <td className="py-3 px-4 text-sm">John Doe</td>
                  <td className="py-3 px-4 text-sm">john.doe@email.com</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      User
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">15 Jan 2025</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium" disabled>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">USR-2025-002</td>
                  <td className="py-3 px-4 text-sm">Jane Smith</td>
                  <td className="py-3 px-4 text-sm">jane.smith@email.com</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      User
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">18 Jan 2025</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        Review
                      </button>
                      <button className="text-orange-600 hover:text-orange-800 text-sm font-medium" disabled>
                        Verify
                      </button>
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">USR-2025-003</td>
                  <td className="py-3 px-4 text-sm">Mike Johnson</td>
                  <td className="py-3 px-4 text-sm">mike.j@email.com</td>
                  <td className="py-3 px-4">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      Admin
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">10 Jan 2025</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium" disabled>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td className="py-3 px-4 text-sm font-medium">USR-2025-004</td>
                  <td className="py-3 px-4 text-sm">Sarah Wilson</td>
                  <td className="py-3 px-4 text-sm">sarah.w@email.com</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      User
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Rejected
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Suspended
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">12 Jan 2025</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                        View
                      </button>
                      <button className="text-orange-600 hover:text-orange-800 text-sm font-medium" disabled>
                        Reactivate
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 1-4 of 1,247 users
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

        {/* User Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">User Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-lg mb-4">User Growth</h3>
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">+23%</span>
              </div>
              <p className="text-sm text-gray-600">This month vs last month</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-lg mb-4">KYC Completion</h3>
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl font-bold">87%</span>
              </div>
              <p className="text-sm text-gray-600">Users with completed KYC</p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-lg mb-4">Active Users</h3>
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl font-bold">93%</span>
              </div>
              <p className="text-sm text-gray-600">Users active in last 30 days</p>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Bulk Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors" disabled>
              ✅ Activate Selected
            </button>
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors" disabled>
              ❌ Suspend Selected
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
            <strong>Note:</strong> This is a placeholder page for the admin user administration system. 
            The actual implementation will include comprehensive user management, role-based access control, 
            KYC verification workflows, and detailed user analytics for business intelligence.
          </p>
        </div>
      </div>
    </div>
  );
}
