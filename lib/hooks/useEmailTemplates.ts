
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useEmailTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('email_templates').select('*');
      if (error) {
        setError(error.message);
      } else {
        setTemplates(data || []);
      }
      setLoading(false);
    };
    fetchTemplates();
  }, []);

  const createTemplate = async (template: any) => {
    // Placeholder for creating template
    alert(`Creating template ${template.name}`);
  };

  const updateTemplate = async (template: any) => {
    // Placeholder for updating template
    alert(`Updating template ${template.name}`);
  };

  const deleteTemplate = async (id: string) => {
    // Placeholder for deleting template
    alert(`Deleting template ${id}`);
  };

  return { templates, loading, error, createTemplate, updateTemplate, deleteTemplate };
}
