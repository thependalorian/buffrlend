
'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { useUserEmails } from '@/lib/hooks/useUserEmails';

export default function EmailHistory() {
  const { user } = useAuth();
  const { emails, loading, error } = useUserEmails(user?.id);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Email History</h2>
      {loading && <p>Loading email history...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email.id}>
                <td>{email.subject}</td>
                <td>{new Date(email.sent_at).toLocaleDateString()}</td>
                <td>{email.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
