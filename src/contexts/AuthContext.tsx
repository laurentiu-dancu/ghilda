import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

const AuthContext = createContext<{
  session: Session | null;
}>({
  session: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  
  console.log('AuthProvider render:', {
    session,
    hasSession: !!session,
    email: session?.user?.email,
    metadata: session?.user?.user_metadata
  });
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', {
        session,
        hasSession: !!session,
        email: session?.user?.email,
        metadata: session?.user?.user_metadata
      });
      setSession(session);
    }).catch(error => console.error('Error getting session:', error));
    
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', {
        event,
        email: newSession?.user?.email,
        metadata: newSession?.user?.user_metadata
      });
      setSession(newSession);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);