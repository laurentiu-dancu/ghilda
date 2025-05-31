import { defineMiddleware } from 'astro:middleware';
import { supabase } from '../lib/supabase';

async function getAuthState(request: Request) {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Auth Debug:', {
    url: request.url,
    hasSession: !!session,
    userId: session?.user?.id,
    email: session?.user?.email,
    timestamp: new Date().toISOString()
  });
  return session;
}

export const onRequest = defineMiddleware(async ({ request, redirect }, next) => {
  const url = new URL(request.url);
  const isAdminRoute = url.pathname.startsWith('/admin');
  const isLoginPage = url.pathname === '/admin' || url.pathname === '/admin/';
  const isDashboardPage = url.pathname === '/admin/dashboard';

  const session = await getAuthState(request);

  if (isAdminRoute) {
    if (!session && !isLoginPage && !isDashboardPage) {
      console.log('Auth Debug: Redirecting to login - No session found');
      return redirect('/admin');
    }

    if (session && isLoginPage) {
      console.log('Auth Debug: Redirecting to dashboard - User is authenticated');
      return redirect('/admin/dashboard');
    }
    
    console.log('Auth Debug: Allowing access to admin route', {
      path: url.pathname,
      isLoginPage,
      isDashboardPage,
      hasSession: !!session
    });
  }
  
  return next();
});