import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

let globalAuthState: AuthState = {
  user: null,
  profile: null,
  session: null,
  isAdmin: false,
  isLoading: true,
  isAuthenticated: false,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data as Profile | null;
}

async function checkAdmin(userId: string) {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();
  return !!data;
}

async function loadUserData(user: User | null, session: Session | null) {
  if (!user) {
    globalAuthState = { user: null, profile: null, session: null, isAdmin: false, isLoading: false, isAuthenticated: false };
    notify();
    return;
  }
  const [profile, isAdmin] = await Promise.all([fetchProfile(user.id), checkAdmin(user.id)]);
  globalAuthState = { user, profile, session, isAdmin, isLoading: false, isAuthenticated: true };
  notify();
}

// Initialize once
let initialized = false;
function initAuth() {
  if (initialized) return;
  initialized = true;

  // Set up listener BEFORE getSession
  supabase.auth.onAuthStateChange((_event, session) => {
    loadUserData(session?.user ?? null, session);
  });

  supabase.auth.getSession().then(({ data: { session } }) => {
    loadUserData(session?.user ?? null, session);
  });
}

export function useAuth(): AuthState & {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
} {
  const [, setTick] = useState(0);

  useEffect(() => {
    initAuth();
    const rerender = () => setTick(t => t + 1);
    listeners.add(rerender);
    return () => { listeners.delete(rerender); };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error?.message ?? null };
  }, []);

  return { ...globalAuthState, signIn, signUp, signOut, resetPassword };
}
