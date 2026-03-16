'use client';

import { useEffect } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { themeIds, getThemeDefinition } from './theme-registry';

function DarkClassManager() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    const def = getThemeDefinition(resolvedTheme);
    document.documentElement.classList.toggle('dark', def?.isDark ?? false);
  }, [resolvedTheme]);

  return null;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system'
}: {
  children: React.ReactNode;
  defaultTheme?: string;
}) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={defaultTheme}
      themes={themeIds}
      enableSystem
      disableTransitionOnChange
    >
      <DarkClassManager />
      {children}
    </NextThemesProvider>
  );
}
