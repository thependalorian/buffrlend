import React from 'react';
import EmailBlacklistManager from '@/components/email/EmailBlacklistManager';

const AdminEmailBlacklistPage: React.FC = () => {
  return (
    <div className="admin-email-blacklist-page">
      <h1>Email Blacklist Management</h1>
      <p>Manage blacklisted email addresses.</p>
      <EmailBlacklistManager />
    </div>
  );
};

export default AdminEmailBlacklistPage;