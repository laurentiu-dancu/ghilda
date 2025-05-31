import { defineMiddleware } from 'astro:middleware';
import { supabase } from '../lib/supabase';

export const onRequest = defineMiddleware(async ({ request, redirect }, next) => {
  // Skip middleware for the login page
  if (request.url.endsWith('/admin')) {
    return next();
  }

  // Protect all other admin routes
  if (request.url.includes('/admin/')) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return redirect('/admin');
    }

    // If authenticated and on /admin, redirect to dashboard
    if (request.url.endsWith('/admin')) {
      return redirect('/admin/dashboard');
    }
  }
  
  return next();
});