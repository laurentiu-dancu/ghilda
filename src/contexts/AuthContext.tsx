import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAuthenticated: false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
      setIsAuthenticated(!!session);
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
      setIsAuthenticated(!!newSession);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({
    session,
    user,
    isAuthenticated
  }), [session, user, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);