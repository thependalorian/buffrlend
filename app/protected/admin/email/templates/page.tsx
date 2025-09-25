import React from 'react';
import EmailTemplateManager from '@/components/email/EmailTemplateManager';

const AdminEmailTemplatesPage: React.FC = () => {
  return (
    <div className="admin-email-templates-page">
      <h1>Email Template Management</h1>
      <p>Manage all email templates for the system.</p>
      <EmailTemplateManager />
    </div>
  );
};

export default AdminEmailTemplatesPage;
