import React from 'react';
import EmailQueueManager from '@/components/email/EmailQueueManager';

const AdminEmailQueuePage: React.FC = () => {
  return (
    <div className="admin-email-queue-page">
      <h1>Email Queue Management</h1>
      <p>Monitor and manage the email sending queue.</p>
      <EmailQueueManager />
    </div>
  );
};

export default AdminEmailQueuePage;
