export interface FontDefinition {
  id: string;
  name: string;
  variable: string;
  description: string;
}

export const fonts: FontDefinition[] = [
  {
    id: 'sora',
    name: 'Sora',
    variable: '--font-sora',
    description: 'Modern geometric sans-serif'
  },
  {
    id: 'inter',
    name: 'Inter',
    variable: '--font-inter',
    description: 'Clean and neutral'
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    variable: '--font-space-grotesk',
    description: 'Technical and sharp'
  },
  {
    id: 'geist-mono',
    name: 'Geist Mono',
    variable: '--font-geist-mono',
    description: 'Monospaced'
  }
];

export const fontIds = fonts.map((f) => f.id);
export const defaultFontId = 'sora';

export function getFontDefinition(id: string): FontDefinition | undefined {
  return fonts.find((f) => f.id === id);
}
