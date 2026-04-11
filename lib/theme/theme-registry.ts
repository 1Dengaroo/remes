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
  },
  {
    id: 'daybreak',
    name: 'Daybreak',
    description: 'Clean slate-blue with electric blue accents — crisp, professional',
    isDark: false,
    previewColors: {
      bg: '#f5f7fa',
      primary: '#4c6ef5',
      secondary: '#718096',
      tertiary: '#d4a017'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Bold midnight navy with electric blue — sharp, data-driven',
    isDark: true,
    previewColors: {
      bg: '#0d1117',
      primary: '#4c6ef5',
      secondary: '#7d8590',
      tertiary: '#fbbf24'
    }
  }
];

export const themeIds = themes.map((t) => t.id);
export const darkThemeIds = themes.filter((t) => t.isDark).map((t) => t.id);

export function getThemeDefinition(id: string): ThemeDefinition | undefined {
  return themes.find((t) => t.id === id);
}
