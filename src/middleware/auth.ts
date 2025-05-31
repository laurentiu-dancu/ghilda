import { defineMiddleware } from 'astro:middleware';
import { supabase } from '../lib/supabase';

export const onRequest = defineMiddleware(async ({ request, redirect }, next) => {
  const url = new URL(request.url);
  const isAdminRoute = url.pathname.startsWith('/admin');
  const isLoginPage = url.pathname === '/admin';

  if (isAdminRoute) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session && !isLoginPage) {
      return redirect('/admin');
    }
  }
  
  return next();
});