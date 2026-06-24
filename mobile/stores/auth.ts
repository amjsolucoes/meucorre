import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  initialized: boolean;
  isProcessingPasswordReset: boolean;
  setSession: (session: Session | null) => void;
  setInitialized: (initialized: boolean) => void;
  setIsProcessingPasswordReset: (val: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initialized: false,
  isProcessingPasswordReset: false,
  setSession: (session) => set({ session, user: session?.user ?? null, initialized: true }),
  setInitialized: (initialized) => set({ initialized }),
  setIsProcessingPasswordReset: (isProcessingPasswordReset) => set({ isProcessingPasswordReset }),
  signOut: () => set({ session: null, user: null }),
}));
