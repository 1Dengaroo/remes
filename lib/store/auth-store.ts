import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

interface AuthStore {
  open: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  user: User | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setInitialized: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  open: false,
  openAuthModal: () => set({ open: true }),
  closeAuthModal: () => set({ open: false }),
  user: null,
  initialized: false,
  setUser: (user) => set({ user }),
  setInitialized: () => set({ initialized: true })
}));
