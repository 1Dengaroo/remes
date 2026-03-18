import { create } from 'zustand';
import { listICPs, createICP, updateICP, deleteICP } from '@/lib/api';
import type { SavedICP, ICPCriteria } from '@/lib/types';

interface ICPStore {
  icps: SavedICP[];
  isLoading: boolean;
  loadICPs: () => Promise<void>;
  saveICP: (name: string, icp: ICPCriteria) => Promise<SavedICP>;
  renameICP: (id: string, name: string) => Promise<void>;
  deleteICP: (id: string) => Promise<void>;
}

export const useICPStore = create<ICPStore>((set, get) => ({
  icps: [],
  isLoading: false,

  loadICPs: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const icps = await listICPs();
      set({ icps });
    } catch (err) {
      console.error('Failed to load ICPs:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  saveICP: async (name: string, icp: ICPCriteria) => {
    const saved = await createICP(name, icp);
    set((state) => ({ icps: [saved, ...state.icps] }));
    return saved;
  },

  renameICP: async (id: string, name: string) => {
    const updated = await updateICP(id, { name });
    set((state) => ({
      icps: state.icps.map((i) => (i.id === id ? updated : i))
    }));
  },

  deleteICP: async (id: string) => {
    await deleteICP(id);
    set((state) => ({ icps: state.icps.filter((i) => i.id !== id) }));
  }
}));
