'use client';

import { useSyncExternalStore } from 'react';
import { Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { themes } from '@/lib/theme/theme-registry';
import { fonts } from '@/lib/theme/font-registry';
import { useFont } from '@/lib/theme/font-provider';

const subscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const { font: currentFont, setFont } = useFont();
  const mounted = useMounted();

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-3 text-sm font-medium">Theme</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`hover:bg-accent/50 flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-colors ${
                mounted && t.id === theme ? 'border-primary ring-primary ring-1' : 'border-border'
              }`}
            >
              <div className="flex gap-1">
                <span
                  className="border-border/50 inline-block size-3.5 rounded-full border"
                  style={{ background: t.previewColors.bg }}
                />
                <span
                  className="border-border/50 inline-block size-3.5 rounded-full border"
                  style={{ background: t.previewColors.primary }}
                />
                <span
                  className="border-border/50 inline-block size-3.5 rounded-full border"
                  style={{ background: t.previewColors.secondary }}
                />
                <span
                  className="border-border/50 inline-block size-3.5 rounded-full border"
                  style={{ background: t.previewColors.tertiary }}
                />
              </div>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-medium">Font</h3>
        <div className="flex flex-col gap-1">
          {fonts.map((f) => (
            <button
              key={f.id}
              onClick={() => setFont(f.id)}
              className={`hover:bg-accent/50 flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                mounted && f.id === currentFont.id
                  ? 'border-primary ring-primary ring-1'
                  : 'border-border'
              }`}
              style={f.variable ? { fontFamily: `var(${f.variable})` } : undefined}
            >
              <div className="flex flex-col items-start gap-0.5">
                <span>{f.name}</span>
                <span className="text-muted-foreground text-xs">{f.description}</span>
              </div>
              {mounted && f.id === currentFont.id && <Check className="text-primary size-3.5" />}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
