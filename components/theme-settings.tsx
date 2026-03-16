'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { themes } from '@/lib/theme/theme-registry';
import { fonts } from '@/lib/theme/font-registry';
import { useFont } from '@/lib/theme/font-provider';

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const { font: currentFont, setFont } = useFont();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          label="Settings"
          className="text-muted-foreground hover:text-foreground hover:bg-accent/60"
        >
          <Settings className="size-[15px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your appearance.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <section>
            <h3 className="mb-3 text-sm font-medium">Theme</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`hover:bg-accent/50 flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-colors ${
                    mounted && t.id === theme
                      ? 'border-primary ring-primary ring-1'
                      : 'border-border'
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
                      style={{ background: t.previewColors.accent }}
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
                  style={{ fontFamily: `var(${f.variable})` }}
                >
                  <div className="flex flex-col items-start gap-0.5">
                    <span>{f.name}</span>
                    <span className="text-muted-foreground text-xs">{f.description}</span>
                  </div>
                  {mounted && f.id === currentFont.id && (
                    <Check className="text-primary size-3.5" />
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
