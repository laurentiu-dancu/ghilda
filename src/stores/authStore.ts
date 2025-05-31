import { atom } from 'nanostores';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
}

export const authStore = atom<AuthState>({
  session: null,
  user: null,
  isAuthenticated: false,
});

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  authStore.set({
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
  });
});

// Listen for auth changes
supabase.auth.onAuthStateChange((event, newSession) => {
  authStore.set({
    session: newSession,
    user: newSession?.user ?? null,
    isAuthenticated: !!newSession,
  });
});