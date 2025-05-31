import { defineMiddleware } from 'astro:middleware';
import { supabase } from '../lib/supabase';

export const onRequest = defineMiddleware(async ({ request, redirect }, next) => {
  if (request.url.includes('/admin')) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return redirect('/admin');
    }
  }
  
  return next();
});