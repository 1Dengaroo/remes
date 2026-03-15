'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
  if (!def) return;
  document.documentElement.setAttribute('data-font', id);
}

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [fontId, setFontId] = useState(defaultFontId);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && getFontDefinition(saved)) {
      setFontId(saved);
      applyFont(saved);
    } else {
      applyFont(defaultFontId);
    }
  }, []);

  const setFont = useCallback((id: string) => {
    if (!getFontDefinition(id)) return;
    setFontId(id);
    localStorage.setItem(STORAGE_KEY, id);
    applyFont(id);
  }, []);

  const font = getFontDefinition(fontId) ?? fonts[0];

  return <FontContext.Provider value={{ font, setFont }}>{children}</FontContext.Provider>;
}

export function useFont() {
  const ctx = useContext(FontContext);
  if (!ctx) throw new Error('useFont must be used within FontProvider');
  return ctx;
}
