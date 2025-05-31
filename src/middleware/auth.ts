import { defineMiddleware } from 'astro:middleware';
import { supabase } from '../lib/supabase';

export const onRequest = defineMiddleware(async ({ request, redirect }, next) => {
  const url = new URL(request.url);
  const isAdminRoute = url.pathname.startsWith('/admin');
  const isLoginPage = url.pathname === '/admin';

  if (isAdminRoute) {
    const { data: { session } } = await supabase.auth.getSession();
    
    // If not authenticated and not on login page, redirect to login
    if (!session && !isLoginPage) {
      return redirect('/admin');
    }

    // If authenticated and on login page, redirect to dashboard
    if (session && isLoginPage) {
      return redirect('/admin/dashboard');
    }
  }
  
  return next();
});