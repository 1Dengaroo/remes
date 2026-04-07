'use client';

import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ChevronDown } from 'lucide-react';

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon }
] as const;

type LandingTheme = (typeof THEMES)[number]['id'];

export function LandingThemeSwitcher() {
  const [theme, setTheme] = useState<LandingTheme>('light');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = document.querySelector('.marketing');
    if (!wrapper) return;
    wrapper.setAttribute('data-landing-theme', theme);
  }, [theme]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];
  const ActiveIcon = active.icon;

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-landing-fg-muted hover:text-landing-fg flex items-center gap-1.5 rounded-full bg-(--landing-skel-base) px-2.5 py-1 text-xs transition-colors duration-150 hover:bg-(--landing-surface-active)"
      >
        <ActiveIcon size={13} />
        <span>{active.label}</span>
        <ChevronDown
          size={11}
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-1.5 overflow-hidden rounded-lg border border-(--landing-border-card) bg-(--landing-bg-card) shadow-(--landing-shadow-header)">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const isActive = t.id === theme;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3.5 py-2 text-xs transition-colors duration-100 ${
                  isActive
                    ? 'text-landing-fg bg-(--landing-surface-active)'
                    : 'text-landing-fg-secondary hover:text-landing-fg hover:bg-(--landing-surface-hover)'
                }`}
              >
                <Icon size={13} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
