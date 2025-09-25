
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useEmailQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueue = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('email_queue').select('*');
      if (error) {
        setError(error.message);
      } else {
        setQueue(data || []);
      }
      setLoading(false);
    };
    fetchQueue();
  }, []);

  const processQueue = async () => {
    // Placeholder for processing logic
    alert('Processing queue...');
  };

  const clearQueue = async () => {
    // Placeholder for clearing logic
    alert('Clearing queue...');
  };

  return { queue, loading, error, processQueue, clearQueue };
}
