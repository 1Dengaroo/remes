import type { HeroTheme } from '@/components/shared/hero-backdrop';

/** App-wide layout constants. Change max-width here to update every page. */
export const MAX_WIDTH = 'max-w-7xl';

/** Theme assignment for each hero backdrop section. */
export interface ThemeConfig {
  hero: HeroTheme;
  useCases: HeroTheme;
  signals: HeroTheme;
  cta: HeroTheme;
  login: HeroTheme;
}

export const HERO_THEME: ThemeConfig = {
  hero: 'indigo-dusk',
  useCases: 'slate-indigo',
  signals: 'light-indigo',
  cta: 'light-indigo',
  login: 'indigo-abyss'
};
