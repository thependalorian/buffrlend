import React from 'react';
import EmailPreferencesForm from '@/components/email/EmailPreferencesForm';

const UserEmailPreferencesPage: React.FC = () => {
  return (
    <div className="user-email-preferences-page">
      <h1>Email Preferences</h1>
      <p>Manage your email notification settings.</p>
      <EmailPreferencesForm />
    </div>
  );
};

export default UserEmailPreferencesPage;