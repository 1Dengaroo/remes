export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  isDark: boolean;
  previewColors: {
    bg: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

export const themes: ThemeDefinition[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Dreamy blue-violet — soft, hazy, gentle twilight',
    isDark: false,
    previewColors: {
      bg: '#f6f5fc',
      primary: '#6366f1',
      secondary: '#7e7c9a',
      tertiary: '#8b5cf6'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Neutral dark with periwinkle accents — clean, focused',
    isDark: true,
    previewColors: {
      bg: '#0e0e0e',
      primary: '#8b8ef8',
      secondary: '#7e7e7e',
      tertiary: '#a78bfa'
    }
  }
];

export const themeIds = themes.map((t) => t.id);
export const darkThemeIds = themes.filter((t) => t.isDark).map((t) => t.id);

export function getThemeDefinition(id: string): ThemeDefinition | undefined {
  return themes.find((t) => t.id === id);
}
