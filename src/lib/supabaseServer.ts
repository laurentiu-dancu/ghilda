import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

export function createSupabaseServerClient(cookies: AstroCookies) {
  console.log('Creating Supabase server client with URL:', import.meta.env.PUBLIC_SUPABASE_URL);
  
  const cookieStore = {
    get: (key: string) => {
      const cookie = cookies.get(key);
      console.log('Reading cookie:', key, cookie?.value ? 'found' : 'not found');
      return cookie?.value;
    },
    set: (key: string, value: string, options: any) => {
      console.log('Setting cookie:', key);
      cookies.set(key, value, options);
    },
    remove: (key: string, options: any) => {
      console.log('Removing cookie:', key);
      cookies.delete(key, options);
    },
  };

  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: cookieStore,
    }
  );
}