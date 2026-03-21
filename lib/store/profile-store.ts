import { create } from 'zustand';
import { getGmailStatus } from '@/lib/api';

interface ProfileStore {
  open: boolean;
  tab: string;
  openProfile: (tab?: string) => void;
  closeProfile: () => void;
  setTab: (tab: string) => void;

  // Profile tab
  fullName: string | null;
  profileLoaded: boolean;
  setFullName: (name: string) => void;
  loadProfile: () => Promise<void>;

  // Connections tab
  gmailConnected: boolean;
  gmailEmail: string | null;
  connectionsLoaded: boolean;
  setGmailStatus: (connected: boolean, email: string | null) => void;
  loadConnections: () => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  open: false,
  tab: 'profile',
  openProfile: (tab) => set({ open: true, tab: tab ?? 'profile' }),
  closeProfile: () => set({ open: false }),
  setTab: (tab) => set({ tab }),

  fullName: null,
  profileLoaded: false,
  setFullName: (name) => set({ fullName: name }),
  loadProfile: async () => {
    if (get().profileLoaded) return;
    const res = await fetch('/api/profile');
    const data: { full_name?: string } = await res.json();
    set({ fullName: data.full_name ?? '', profileLoaded: true });
  },

  gmailConnected: false,
  gmailEmail: null,
  connectionsLoaded: false,
  setGmailStatus: (connected, email) => set({ gmailConnected: connected, gmailEmail: email }),
  loadConnections: async () => {
    if (get().connectionsLoaded) return;
    const status = await getGmailStatus();
    set({ gmailConnected: status.connected, gmailEmail: status.email, connectionsLoaded: true });
  }
}));
