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
    description: 'Warm and refined',
    isDark: false,
    previewColors: {
      bg: 'oklch(0.97 0.008 75)',
      primary: 'oklch(0.55 0.12 55)',
      accent: 'oklch(0.58 0.1 15)'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Rich and elegant',
    isDark: true,
    previewColors: {
      bg: 'oklch(0.18 0.012 50)',
      primary: 'oklch(0.65 0.12 65)',
      accent: 'oklch(0.62 0.1 25)'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep blue',
    isDark: true,
    previewColors: {
      bg: 'oklch(0.16 0.025 260)',
      primary: 'oklch(0.62 0.18 250)',
      accent: 'oklch(0.65 0.12 195)'
    }
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Soft and elegant',
    isDark: false,
    previewColors: {
      bg: 'oklch(0.97 0.008 350)',
      primary: 'oklch(0.58 0.12 350)',
      accent: 'oklch(0.52 0.1 310)'
    }
  }
];

export const themeIds = themes.map((t) => t.id);
export const darkThemeIds = themes.filter((t) => t.isDark).map((t) => t.id);

export function getThemeDefinition(id: string): ThemeDefinition | undefined {
  return themes.find((t) => t.id === id);
}
