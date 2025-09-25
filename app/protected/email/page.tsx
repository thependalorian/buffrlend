import React from 'react';
import UserEmailDashboard from '@/components/email/UserEmailDashboard';

const UserEmailDashboardPage: React.FC = () => {
  return (
    <div className="user-email-dashboard-page">
      <h1>Your Email Dashboard</h1>
      <p>View your email activity and manage settings.</p>
      <UserEmailDashboard />
    </div>
  );
};

export default UserEmailDashboardPage;