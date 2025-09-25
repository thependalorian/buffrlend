
'use client';

import EmailHealthMonitor from './EmailHealthMonitor';

export function AdminEmailDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Email Dashboard</h1>
      <EmailHealthMonitor />
      {/* Other admin email components can be added here */}
    </div>
  );
}
