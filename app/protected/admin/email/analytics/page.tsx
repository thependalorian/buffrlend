import React from 'react';
import EmailAnalyticsChart from '@/components/email/EmailAnalyticsChart';

const AdminEmailAnalyticsPage: React.FC = () => {
  return (
    <div className="admin-email-analytics-page">
      <h1>Email Analytics Dashboard</h1>
      <p>View email delivery, open, and click rates.</p>
      <EmailAnalyticsChart 
        data={[]} 
        type="delivery" 
        groupBy="day" 
      />
    </div>
  );
};

export default AdminEmailAnalyticsPage;
