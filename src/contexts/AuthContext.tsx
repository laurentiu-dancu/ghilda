import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

const AuthContext = createContext<{
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
}>({
  session: null,
  user: null,
  isAuthenticated: false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  const value = useMemo(() => ({
    session,
    user,
    isAuthenticated: !!session
  }), [session, user]);
  
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
      setUser(session?.user ?? null);
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
      setUser(newSession?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);