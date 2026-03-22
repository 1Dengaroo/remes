import { create } from 'zustand';
import {
  listSignatures,
  createSignature as createSignatureApi,
  updateSignature as updateSignatureApi,
  deleteSignature as deleteSignatureApi
} from '@/lib/api';
import type { EmailSignature } from '@/lib/types';

interface SignatureStore {
  signatures: EmailSignature[];
  isLoading: boolean;
  loadSignatures: () => Promise<void>;
  createSignature: (name: string, body: string) => Promise<EmailSignature>;
  updateSignature: (
    id: string,
    updates: Partial<Pick<EmailSignature, 'name' | 'body' | 'is_default'>>
  ) => Promise<void>;
  deleteSignature: (id: string) => Promise<void>;
  getDefault: () => EmailSignature | undefined;
}

export const useSignatureStore = create<SignatureStore>((set, get) => ({
  signatures: [],
  isLoading: false,

  loadSignatures: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const signatures = await listSignatures();
      set({ signatures });
    } catch (err) {
      console.error('Failed to load signatures:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  createSignature: async (name: string, body: string) => {
    const saved = await createSignatureApi(name, body);
    set((state) => ({ signatures: [saved, ...state.signatures] }));
    return saved;
  },

  updateSignature: async (id, updates) => {
    const updated = await updateSignatureApi(id, updates);
    set((state) => ({
      signatures: state.signatures.map((s) => {
        if (s.id === id) return updated;
        if (updates.is_default && s.is_default) return { ...s, is_default: false };
        return s;
      })
    }));
  },

  deleteSignature: async (id: string) => {
    await deleteSignatureApi(id);
    set((state) => ({ signatures: state.signatures.filter((s) => s.id !== id) }));
  },

  getDefault: () => {
    return get().signatures.find((s) => s.is_default);
  }
}));
