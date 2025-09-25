import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import components
import EmailQueueManager from '../../components/email/EmailQueueManager';
import EmailBlacklistManager from '../../components/email/EmailBlacklistManager';
import EmailHealthMonitor from '../../components/email/EmailHealthMonitor';
import EmailTemplateManager from '../../components/email/EmailTemplateManager';
import UserEmailDashboard from '../../components/email/UserEmailDashboard';
import EmailNotificationList from '../../components/email/EmailNotificationList';
import EmailHistory from '../../components/email/EmailHistory';
import EmailPreferencesForm from '../../components/email/EmailPreferencesForm';

// Import pages
import AdminEmailDashboardPage from '../../app/protected/admin/email/page';
import AdminEmailTemplatesPage from '../../app/protected/admin/email/templates/page';
import AdminEmailAnalyticsPage from '../../app/protected/admin/email/analytics/page';
import AdminEmailQueuePage from '../../app/protected/admin/email/queue/page';
import AdminEmailBlacklistPage from '../../app/protected/admin/email/blacklist/page';
import UserEmailDashboardPage from '../../app/protected/email/page';
import UserEmailPreferencesPage from '../../app/protected/email/preferences/page';
import UserEmailNotificationsPage from '../../app/protected/email/notifications/page';
import UserEmailHistoryPage from '../../app/protected/email/history/page';

describe('BuffrLend Email Components and Pages', () => {
  // Components
  test('EmailQueueManager renders correctly', () => {
    render(<EmailQueueManager />);
    expect(screen.getByText(/Email Queue Management/i)).toBeInTheDocument();
  });

  test('EmailBlacklistManager renders correctly', () => {
    render(<EmailBlacklistManager />);
    expect(screen.getByText(/Email Blacklist Management/i)).toBeInTheDocument();
  });

  test('EmailHealthMonitor renders correctly', () => {
    render(<EmailHealthMonitor />);
    expect(screen.getByText(/Email System Health Monitor/i)).toBeInTheDocument();
  });

  test('EmailTemplateManager renders correctly', () => {
    render(<EmailTemplateManager />);
    expect(screen.getByText(/Email Template Management/i)).toBeInTheDocument();
  });

  test('UserEmailDashboard renders correctly', () => {
    render(<UserEmailDashboard />);
    expect(screen.getByText(/Your Email Dashboard/i)).toBeInTheDocument();
  });

  test('EmailNotificationList renders correctly', () => {
    render(<EmailNotificationList />);
    expect(screen.getByText(/Email Notification List/i)).toBeInTheDocument();
  });

  test('EmailHistory renders correctly', () => {
    render(<EmailHistory />);
    expect(screen.getByText(/Email History/i)).toBeInTheDocument();
  });

  test('EmailPreferencesForm renders correctly', () => {
    render(<EmailPreferencesForm />);
    expect(screen.getByText(/Email Preferences/i)).toBeInTheDocument();
  });

  // Pages
  test('AdminEmailDashboardPage renders correctly', () => {
    render(<AdminEmailDashboardPage />);
    expect(screen.getByRole('heading', { name: /Admin Email Dashboard/i })).toBeInTheDocument();
  });

  test('AdminEmailTemplatesPage renders correctly', () => {
    render(<AdminEmailTemplatesPage />);
    expect(screen.getByRole('heading', { name: /Email Template Management/i })).toBeInTheDocument();
  });

  test('AdminEmailAnalyticsPage renders correctly', () => {
    render(<AdminEmailAnalyticsPage />);
    expect(screen.getByRole('heading', { name: /Email Analytics Dashboard/i })).toBeInTheDocument();
  });

  test('AdminEmailQueuePage renders correctly', () => {
    render(<AdminEmailQueuePage />);
    expect(screen.getByRole('heading', { name: /Email Queue Management/i })).toBeInTheDocument();
  });

  test('AdminEmailBlacklistPage renders correctly', () => {
    render(<AdminEmailBlacklistPage />);
    expect(screen.getByRole('heading', { name: /Email Blacklist Management/i })).toBeInTheDocument();
  });

  test('UserEmailDashboardPage renders correctly', () => {
    render(<UserEmailDashboardPage />);
    expect(screen.getByRole('heading', { name: /Your Email Dashboard/i })).toBeInTheDocument();
  });

  test('UserEmailPreferencesPage renders correctly', () => {
    render(<UserEmailPreferencesPage />);
    expect(screen.getByRole('heading', { name: /Email Preferences/i })).toBeInTheDocument();
  });

  test('UserEmailNotificationsPage renders correctly', () => {
    render(<UserEmailNotificationsPage />);
    expect(screen.getByRole('heading', { name: /Your Notifications/i })).toBeInTheDocument();
  });

  test('UserEmailHistoryPage renders correctly', () => {
    render(<UserEmailHistoryPage />);
    expect(screen.getByRole('heading', { name: /Email History/i })).toBeInTheDocument();
  });
});
