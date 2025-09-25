import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Use test values if environment variables are not set (for testing)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://test-project.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE5NTYzNTUyMDB9.test-key-for-e2e-tests';
  
  return createBrowserClient(supabaseUrl, supabaseKey);
}
