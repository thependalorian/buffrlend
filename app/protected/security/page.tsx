/**
 * Security Settings Page
 * 
 * Purpose: Manages user security settings, 2FA setup, and account security preferences
 * Location: /app/protected/security/page.tsx
 * Features: Two-factor authentication, password management, security logs
 */

export default function ProtectedSecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
          <p className="text-gray-600">Manage your account security and privacy</p>
        </div>

        {/* Security Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Two-Factor Auth</h3>
                <p className="text-lg font-semibold text-green-600">Enabled</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">✓</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Password Strength</h3>
                <p className="text-lg font-semibold text-blue-600">Strong</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">🔒</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                <p className="text-lg font-semibold text-gray-900">2 hours ago</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xl">🕒</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Two-Factor Authentication</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-lg">Authenticator App</h3>
                <p className="text-sm text-gray-600">
                  Use an authenticator app like Google Authenticator or Authy
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                  Disable
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-lg">SMS Verification</h3>
                <p className="text-sm text-gray-600">
                  Receive verification codes via SMS to your registered phone
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                  Inactive
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                  Enable
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-lg">Backup Codes</h3>
                <p className="text-sm text-gray-600">
                  Generate backup codes for account recovery
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Generated
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Password Management */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Password Management</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled
              />
            </div>
            
            <div className="pt-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" disabled>
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* Login Sessions */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Active Login Sessions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-gray-600">Chrome on Windows • Windhoek, Namibia</p>
                  <p className="text-xs text-gray-500">Started 2 hours ago</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div>
                  <p className="font-medium">Mobile Session</p>
                  <p className="text-sm text-gray-600">Safari on iPhone • Windhoek, Namibia</p>
                  <p className="text-xs text-gray-500">Last active 1 day ago</p>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                Terminate
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div>
                  <p className="font-medium">Desktop Session</p>
                  <p className="text-sm text-gray-600">Firefox on Mac • Windhoek, Namibia</p>
                  <p className="text-xs text-gray-500">Last active 3 days ago</p>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
                Terminate
              </button>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="text-red-600 hover:text-red-800 text-sm font-medium" disabled>
              Terminate All Other Sessions
            </button>
          </div>
        </div>

        {/* Security Preferences */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Security Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">Login Notifications</h3>
                <p className="text-sm text-gray-600">
                  Receive email notifications for new login attempts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">Suspicious Activity Alerts</h3>
                <p className="text-sm text-gray-600">
                  Get notified of unusual account activity
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">Biometric Authentication</h3>
                <p className="text-sm text-gray-600">
                  Use fingerprint or face recognition on mobile devices
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" disabled />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Log */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold mb-6">Security Activity Log</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">Password Changed</p>
                <p className="text-sm text-gray-600">Password was successfully updated</p>
                <p className="text-xs text-gray-500">2 hours ago • Windhoek, Namibia</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Info
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">2FA Enabled</p>
                <p className="text-sm text-gray-600">Two-factor authentication was activated</p>
                <p className="text-xs text-gray-500">1 day ago • Windhoek, Namibia</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Success
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">New Login</p>
                <p className="text-sm text-gray-600">Successful login from new device</p>
                <p className="text-xs text-gray-500">2 days ago • Windhoek, Namibia</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Info
              </span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" disabled>
              View Full Security Log →
            </button>
          </div>
        </div>

        {/* Placeholder Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a placeholder page for the security settings system. 
            The actual implementation will include real-time security monitoring, advanced 
            authentication options, security analytics, and comprehensive audit logging.
          </p>
        </div>
      </div>
    </div>
  );
}
