export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  isDark: boolean;
  previewColors: {
    bg: string;
    primary: string;
    accent: string;
  };
}

export const themes: ThemeDefinition[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Coral and teal on cream',
    isDark: false,
    previewColors: {
      bg: '#faf6f1',
      primary: 'hsl(12, 75%, 55%)',
      accent: 'hsl(175, 45%, 42%)'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Coral and teal on midnight',
    isDark: true,
    previewColors: {
      bg: '#101114',
      primary: 'hsl(12, 75%, 58%)',
      accent: 'hsl(175, 50%, 50%)'
    }
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Warm sand & terracotta',
    isDark: true,
    previewColors: {
      bg: '#1a1614',
      primary: 'hsl(24, 70%, 55%)',
      accent: 'hsl(15, 50%, 52%)'
    }
  },
  {
    id: 'print',
    name: 'Print',
    description: 'Paper and ink',
    isDark: false,
    previewColors: {
      bg: '#f2efea',
      primary: 'hsl(218, 55%, 48%)',
      accent: 'hsl(200, 40%, 42%)'
    }
  }
];

export const themeIds = themes.map((t) => t.id);
export const darkThemeIds = themes.filter((t) => t.isDark).map((t) => t.id);

export function getThemeDefinition(id: string): ThemeDefinition | undefined {
  return themes.find((t) => t.id === id);
}
