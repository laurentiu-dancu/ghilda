import { defineMiddleware } from 'astro:middleware';
import { supabase } from '../lib/supabase';

async function getAuthState(request: Request) {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Auth Debug: Middleware getAuthState:', {
    url: request.url,
    hasSession: !!session,
    userId: session?.user?.id,
    email: session?.user?.email,
    accessToken: session?.access_token ? 'present' : 'missing',
    expiresAt: session?.expires_at,
    timestamp: new Date().toISOString()
  });
  return session;
}

export const onRequest = defineMiddleware(async ({ request, redirect }, next) => {
  console.log('Auth Debug: Middleware start:', request.url);
  const url = new URL(request.url);
  const isAdminRoute = url.pathname.startsWith('/admin');
  const isLoginPage = url.pathname === '/admin' || url.pathname === '/admin/';
  const isDashboardPage = url.pathname === '/admin/dashboard';

  console.log('Auth Debug: Route analysis:', {
    path: url.pathname,
    isAdminRoute,
    isLoginPage,
    isDashboardPage
  });

  const session = await getAuthState(request);

  if (isAdminRoute) {
    if (!session && !isLoginPage && !isDashboardPage) {
      console.log('Auth Debug: No session, redirecting to /admin');
      return redirect('/admin');
    }

    if (session && isLoginPage) {
      console.log('Auth Debug: Session found on login page, redirecting to dashboard');
      return redirect('/admin/dashboard');
    }
    
    console.log('Auth Debug: Access decision:', {
      path: url.pathname,
      isLoginPage,
      isDashboardPage,
      hasSession: !!session,
      action: 'allowing access'
    });
  }
  
  console.log('Auth Debug: Middleware end:', {
    path: url.pathname,
    hasSession: !!session,
    timestamp: new Date().toISOString()
  });
  
  return next();
});