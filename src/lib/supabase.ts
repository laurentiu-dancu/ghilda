import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

// Wrap Supabase methods with logging
export const supabase = {
  ...supabaseClient,
  auth: {
    ...supabaseClient.auth,
    getSession: async () => {
      const result = await supabaseClient.auth.getSession();
      console.log('Auth Debug: getSession result:', {
        hasSession: !!result.data.session,
        error: result.error,
        userId: result.data.session?.user?.id,
        timestamp: new Date().toISOString()
      });
      return result;
    }
  }
};