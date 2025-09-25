
'use client';

import { useEmailAnalytics } from '@/lib/hooks/useEmailAnalytics';

export default function EmailAnalyticsDashboard() {
  const { analytics, loading, error } = useEmailAnalytics();

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Email Analytics</h2>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Total Sent</div>
          <div className="stat-value">{analytics.totalSent}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Open Rate</div>
          <div className="stat-value">{analytics.openRate}%</div>
        </div>
        <div className="stat">
          <div className="stat-title">Click Rate</div>
          <div className="stat-value">{analytics.clickRate}%</div>
        </div>
      </div>
      {/* More detailed charts and tables can be added here */}
    </div>
  );
}
