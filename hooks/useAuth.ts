import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthState {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export const useAuth = create<AuthState>(set => ({
  session: null,
  setSession: session => set({ session }),
}));
