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
    description: 'Purple frost — modern, clean, balanced',
    isDark: false,
    previewColors: {
      bg: '#f4f2fb',
      primary: '#7950e8',
      secondary: '#807498',
      tertiary: '#6366f1'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Neutral dark with purple accents — clean, focused',
    isDark: true,
    previewColors: {
      bg: '#101010',
      primary: '#9b7af0',
      secondary: '#848484',
      tertiary: 'hsl(220, 50%, 58%)'
    }
  },
  {
    id: 'lavender',
    name: 'Lavender',
    description: 'Warm rosy-purple — soft, airy, gentle',
    isDark: false,
    previewColors: {
      bg: '#f8f4fc',
      primary: '#9040d0',
      secondary: '#8c7a9e',
      tertiary: '#7c5ccc'
    }
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    description: 'Deep violet-indigo — crisp, saturated, polished',
    isDark: false,
    previewColors: {
      bg: '#f5f2fb',
      primary: '#5b2ebd',
      secondary: '#706490',
      tertiary: '#5050c8'
    }
  },
  {
    id: 'legacy',
    name: 'Legacy',
    description: 'Original — warm sand neutrals on white',
    isDark: false,
    previewColors: {
      bg: '#f7f7f5',
      primary: '#6f42d6',
      secondary: '#7a7774',
      tertiary: 'hsl(220, 50%, 48%)'
    }
  },
  {
    id: 'periwinkle',
    name: 'Periwinkle',
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
    id: 'periwinkle-dark',
    name: 'Periwinkle Dark',
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
    id: 'seafoam',
    name: 'Seafoam',
    description: 'Coastal calm — soft teal-green, breezy, serene',
    isDark: false,
    previewColors: {
      bg: '#f4faf9',
      primary: '#2ba89a',
      secondary: '#6e8e8a',
      tertiary: '#3b82a0'
    }
  },
  {
    id: 'iris',
    name: 'Iris',
    description: 'Soft indigo garden — muted, elegant, contemplative',
    isDark: false,
    previewColors: {
      bg: '#f6f3fc',
      primary: '#6b3dc0',
      secondary: '#847498',
      tertiary: '#8b40d0'
    }
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'Muted forest — earthy green, grounded, quiet',
    isDark: false,
    previewColors: {
      bg: '#f5f8f4',
      primary: '#4a8c5c',
      secondary: '#6e8874',
      tertiary: '#3a8a6a'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep still water — soft navy-blue, calm, focused',
    isDark: false,
    previewColors: {
      bg: '#f4f6fc',
      primary: '#3b5ec0',
      secondary: '#6e7896',
      tertiary: '#5050c8'
    }
  },
  {
    id: 'mint',
    name: 'Mint',
    description: 'Fresh spearmint — cool green-cyan, crisp, clean',
    isDark: false,
    previewColors: {
      bg: '#f2faf6',
      primary: '#28a07a',
      secondary: '#608c78',
      tertiary: '#2a90a0'
    }
  },
  {
    id: 'wisteria',
    name: 'Wisteria',
    description: 'Purple-blue twilight — dusky, romantic, atmospheric',
    isDark: false,
    previewColors: {
      bg: '#f7f4fc',
      primary: '#7c42c8',
      secondary: '#867498',
      tertiary: '#5c5cc8'
    }
  }
];

export const themeIds = themes.map((t) => t.id);
export const darkThemeIds = themes.filter((t) => t.isDark).map((t) => t.id);

export function getThemeDefinition(id: string): ThemeDefinition | undefined {
  return themes.find((t) => t.id === id);
}
