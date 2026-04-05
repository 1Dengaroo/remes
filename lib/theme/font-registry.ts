export interface FontDefinition {
  id: string;
  name: string;
  variable: string;
  description: string;
}

export const fonts: FontDefinition[] = [
  {
    id: 'default',
    name: 'Default',
    variable: '--font-space-grotesk',
    description: 'Technical and sharp'
  },
  {
    id: 'serif',
    name: 'Serif',
    variable: '--font-source-serif',
    description: 'Classic and readable'
  },
  {
    id: 'system',
    name: 'System',
    variable: '',
    description: 'Your device\u2019s native font'
  },
  {
    id: 'dyslexic',
    name: 'Dyslexic Friendly',
    variable: '--font-lexend',
    description: 'Optimized for readability'
  }
];

export const fontIds = fonts.map((f) => f.id);
export const defaultFontId = 'default';

export function getFontDefinition(id: string): FontDefinition | undefined {
  return fonts.find((f) => f.id === id);
}
