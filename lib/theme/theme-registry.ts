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
    description: 'Purple and sand on white',
    isDark: false,
    previewColors: {
      bg: '#f7f7f5',
      primary: '#6f42d6',
      secondary: '#7a7774',
      tertiary: 'hsl(220, 50%, 48%)'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Purple and sand on charcoal',
    isDark: true,
    previewColors: {
      bg: '#121110',
      primary: '#a48efa',
      secondary: '#7a7774',
      tertiary: 'hsl(220, 50%, 58%)'
    }
  }
];

export const themeIds = themes.map((t) => t.id);
export const darkThemeIds = themes.filter((t) => t.isDark).map((t) => t.id);

export function getThemeDefinition(id: string): ThemeDefinition | undefined {
  return themes.find((t) => t.id === id);
}
