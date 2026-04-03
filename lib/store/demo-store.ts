import { create } from 'zustand';

interface DemoStore {
  open: boolean;
  openDemo: () => void;
  closeDemo: () => void;
}

export const useDemoStore = create<DemoStore>((set) => ({
  open: false,
  openDemo: () => set({ open: true }),
  closeDemo: () => set({ open: false })
}));
