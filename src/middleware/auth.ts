import { defineMiddleware } from 'astro:middleware';
import { supabase } from '../lib/supabase';

const protectedRoutes = ['/admin/dashboard', '/admin/post'];

export const onRequest = defineMiddleware(async ({ request, redirect }, next) => {
  const url = new URL(request.url);
  const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));

  if (isProtectedRoute) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return redirect('/admin');
    }
  }

  return next();
});