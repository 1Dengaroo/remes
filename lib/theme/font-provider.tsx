'use client';

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';
import { fonts, defaultFontId, getFontDefinition } from './font-registry';
import type { FontDefinition } from './font-registry';

interface FontContextValue {
  font: FontDefinition;
  setFont: (id: string) => void;
}

const FontContext = createContext<FontContextValue | null>(null);

const STORAGE_KEY = 'font';

function applyFont(id: string) {
  const def = getFontDefinition(id);
  if (!def || typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-font', id);
}

// Listeners for useSyncExternalStore
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot(): string {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && getFontDefinition(saved)) return saved;
  return defaultFontId;
}
function getServerSnapshot(): string {
  return defaultFontId;
}

export function FontProvider({ children }: { children: React.ReactNode }) {
  const fontId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Sync font to DOM (external system) — effect is the correct pattern here
  useEffect(() => {
    applyFont(fontId);
  }, [fontId]);

  const setFont = useCallback((id: string) => {
    if (!getFontDefinition(id)) return;
    localStorage.setItem(STORAGE_KEY, id);
    applyFont(id);
    listeners.forEach((cb) => cb());
  }, []);

  const font = getFontDefinition(fontId) ?? fonts[0];

  return <FontContext.Provider value={{ font, setFont }}>{children}</FontContext.Provider>;
}

export function useFont() {
  const ctx = useContext(FontContext);
  if (!ctx) throw new Error('useFont must be used within FontProvider');
  return ctx;
}
