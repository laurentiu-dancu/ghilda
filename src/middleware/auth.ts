import { defineMiddleware } from 'astro:middleware';
import { supabase } from '../lib/supabase';

async function logAuthState(request: Request) {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Auth Debug:', {
    url: request.url,
    hasSession: !!session,
    userId: session?.user?.id,
    email: session?.user?.email,
    timestamp: new Date().toISOString()
  });
}

export const onRequest = defineMiddleware(async ({ request, redirect }, next) => {
  const url = new URL(request.url);
  const isAdminRoute = url.pathname.startsWith('/admin');
  const isLoginPage = url.pathname === '/admin' || url.pathname === '/admin/';

  await logAuthState(request);

  if (isAdminRoute) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session && !isLoginPage) {
      console.log('Auth Debug: Redirecting to login - No session found');
      return redirect('/admin');
    }
    
    console.log('Auth Debug: Allowing access to admin route', {
      path: url.pathname,
      isLoginPage
    });
  }
  
  return next();
});