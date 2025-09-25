
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export function useUserEmails(userId: string | undefined) {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserEmails = async () => {
      const { data, error } = await supabase
        .from('email_history') // Assuming an email_history table for user-specific emails
        .select('*')
        .eq('user_id', userId)
        .order('sent_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setEmails(data || []);
      }
      setLoading(false);
    };
    fetchUserEmails();
  }, [userId]);

  return { emails, loading, error };
}
