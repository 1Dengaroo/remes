import { HeroIllustrations } from '@/components/landing/hero-illustrations';

export const HERO_THEMES = {
  void: {
    '--landing-hero-bg': '#09090b',
    '--landing-hero-stroke': 'rgba(161, 161, 170, 0.12)',
    '--landing-hero-stroke-light': 'rgba(161, 161, 170, 0.06)',
    '--landing-hero-fg': '#fafafa',
    '--landing-hero-fg-secondary': '#a1a1aa',
    '--hero-cone-color': 'rgba(161, 161, 170, 0.06)',
    '--hero-glow-color': 'rgba(113, 113, 122, 0.02)',
    '--hero-radial-glow': 'rgba(113, 113, 122, 0.03)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(113, 113, 122, 0.10) 0%, rgba(161, 161, 170, 0.03) 40%, transparent 70%)'
  },
  charcoal: {
    '--landing-hero-bg': '#18181b',
    '--landing-hero-stroke': 'rgba(212, 212, 216, 0.10)',
    '--landing-hero-stroke-light': 'rgba(212, 212, 216, 0.05)',
    '--landing-hero-fg': '#f4f4f5',
    '--landing-hero-fg-secondary': '#71717a',
    '--hero-cone-color': 'rgba(212, 212, 216, 0.05)',
    '--hero-glow-color': 'rgba(161, 161, 170, 0.02)',
    '--hero-radial-glow': 'rgba(161, 161, 170, 0.03)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(161, 161, 170, 0.08) 0%, rgba(212, 212, 216, 0.03) 40%, transparent 70%)'
  },
  'midnight-blue': {
    '--landing-hero-bg': '#020617',
    '--landing-hero-stroke': 'rgba(56, 189, 248, 0.20)',
    '--landing-hero-stroke-light': 'rgba(56, 189, 248, 0.08)',
    '--landing-hero-fg': '#e0f2fe',
    '--landing-hero-fg-secondary': '#7dd3fc',
    '--hero-cone-color': 'rgba(56, 189, 248, 0.10)',
    '--hero-glow-color': 'rgba(14, 165, 233, 0.04)',
    '--hero-radial-glow': 'rgba(14, 165, 233, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(14, 165, 233, 0.18) 0%, rgba(56, 189, 248, 0.06) 40%, transparent 70%)'
  },
  'deep-navy': {
    '--landing-hero-bg': '#0f172a',
    '--landing-hero-stroke': 'rgba(148, 163, 184, 0.18)',
    '--landing-hero-stroke-light': 'rgba(148, 163, 184, 0.07)',
    '--landing-hero-fg': '#e2e8f0',
    '--landing-hero-fg-secondary': '#94a3b8',
    '--hero-cone-color': 'rgba(148, 163, 184, 0.08)',
    '--hero-glow-color': 'rgba(100, 116, 139, 0.03)',
    '--hero-radial-glow': 'rgba(100, 116, 139, 0.05)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(100, 116, 139, 0.15) 0%, rgba(148, 163, 184, 0.05) 40%, transparent 70%)'
  },
  'indigo-abyss': {
    '--landing-hero-bg': '#1e1b4b',
    '--landing-hero-stroke': 'rgba(165, 180, 252, 0.22)',
    '--landing-hero-stroke-light': 'rgba(165, 180, 252, 0.10)',
    '--landing-hero-fg': '#e0e7ff',
    '--landing-hero-fg-secondary': '#a5b4fc',
    '--hero-cone-color': 'rgba(165, 180, 252, 0.14)',
    '--hero-glow-color': 'rgba(129, 140, 248, 0.05)',
    '--hero-radial-glow': 'rgba(129, 140, 248, 0.07)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(129, 140, 248, 0.20) 0%, rgba(165, 180, 252, 0.07) 40%, transparent 70%)'
  },
  'violet-depths': {
    '--landing-hero-bg': '#2e1065',
    '--landing-hero-stroke': 'rgba(196, 181, 253, 0.22)',
    '--landing-hero-stroke-light': 'rgba(196, 181, 253, 0.10)',
    '--landing-hero-fg': '#ede9fe',
    '--landing-hero-fg-secondary': '#c4b5fd',
    '--hero-cone-color': 'rgba(196, 181, 253, 0.14)',
    '--hero-glow-color': 'rgba(167, 139, 250, 0.05)',
    '--hero-radial-glow': 'rgba(167, 139, 250, 0.07)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(167, 139, 250, 0.22) 0%, rgba(196, 181, 253, 0.07) 40%, transparent 70%)'
  },
  'dark-purple': {
    '--landing-hero-bg': '#3b0764',
    '--landing-hero-stroke': 'rgba(192, 132, 252, 0.25)',
    '--landing-hero-stroke-light': 'rgba(192, 132, 252, 0.12)',
    '--landing-hero-fg': '#e9d5ff',
    '--landing-hero-fg-secondary': '#c084fc',
    '--hero-cone-color': 'rgba(192, 132, 252, 0.14)',
    '--hero-glow-color': 'rgba(168, 85, 247, 0.05)',
    '--hero-radial-glow': 'rgba(168, 85, 247, 0.08)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(168, 85, 247, 0.22) 0%, rgba(192, 132, 252, 0.08) 40%, transparent 70%)'
  },
  'crimson-night': {
    '--landing-hero-bg': '#450a0a',
    '--landing-hero-stroke': 'rgba(252, 165, 165, 0.22)',
    '--landing-hero-stroke-light': 'rgba(252, 165, 165, 0.10)',
    '--landing-hero-fg': '#fecaca',
    '--landing-hero-fg-secondary': '#fca5a5',
    '--hero-cone-color': 'rgba(252, 165, 165, 0.12)',
    '--hero-glow-color': 'rgba(248, 113, 113, 0.04)',
    '--hero-radial-glow': 'rgba(248, 113, 113, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(248, 113, 113, 0.16) 0%, rgba(252, 165, 165, 0.05) 40%, transparent 70%)'
  },
  'dark-emerald': {
    '--landing-hero-bg': '#022c22',
    '--landing-hero-stroke': 'rgba(110, 231, 183, 0.20)',
    '--landing-hero-stroke-light': 'rgba(110, 231, 183, 0.08)',
    '--landing-hero-fg': '#d1fae5',
    '--landing-hero-fg-secondary': '#6ee7b7',
    '--hero-cone-color': 'rgba(110, 231, 183, 0.10)',
    '--hero-glow-color': 'rgba(52, 211, 153, 0.03)',
    '--hero-radial-glow': 'rgba(52, 211, 153, 0.05)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(52, 211, 153, 0.14) 0%, rgba(110, 231, 183, 0.05) 40%, transparent 70%)'
  },
  'dark-amber': {
    '--landing-hero-bg': '#451a03',
    '--landing-hero-stroke': 'rgba(252, 211, 77, 0.20)',
    '--landing-hero-stroke-light': 'rgba(252, 211, 77, 0.08)',
    '--landing-hero-fg': '#fef3c7',
    '--landing-hero-fg-secondary': '#fcd34d',
    '--hero-cone-color': 'rgba(252, 211, 77, 0.10)',
    '--hero-glow-color': 'rgba(245, 158, 11, 0.03)',
    '--hero-radial-glow': 'rgba(245, 158, 11, 0.05)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(245, 158, 11, 0.14) 0%, rgba(252, 211, 77, 0.05) 40%, transparent 70%)'
  },
  'obsidian-teal': {
    '--landing-hero-bg': '#042f2e',
    '--landing-hero-stroke': 'rgba(94, 234, 212, 0.20)',
    '--landing-hero-stroke-light': 'rgba(94, 234, 212, 0.08)',
    '--landing-hero-fg': '#ccfbf1',
    '--landing-hero-fg-secondary': '#5eead4',
    '--hero-cone-color': 'rgba(94, 234, 212, 0.10)',
    '--hero-glow-color': 'rgba(45, 212, 191, 0.03)',
    '--hero-radial-glow': 'rgba(45, 212, 191, 0.05)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(45, 212, 191, 0.14) 0%, rgba(94, 234, 212, 0.05) 40%, transparent 70%)'
  },
  'dark-rose': {
    '--landing-hero-bg': '#4c0519',
    '--landing-hero-stroke': 'rgba(251, 113, 133, 0.22)',
    '--landing-hero-stroke-light': 'rgba(251, 113, 133, 0.10)',
    '--landing-hero-fg': '#ffe4e6',
    '--landing-hero-fg-secondary': '#fb7185',
    '--hero-cone-color': 'rgba(251, 113, 133, 0.12)',
    '--hero-glow-color': 'rgba(244, 63, 94, 0.04)',
    '--hero-radial-glow': 'rgba(244, 63, 94, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(244, 63, 94, 0.16) 0%, rgba(251, 113, 133, 0.05) 40%, transparent 70%)'
  },
  'deep-violet': {
    '--landing-hero-bg': 'rgb(8, 5, 42)',
    '--landing-hero-stroke': 'rgba(86, 67, 204, 0.55)',
    '--landing-hero-stroke-light': 'rgba(86, 67, 204, 0.20)',
    '--landing-hero-fg': '#e0e7ff',
    '--landing-hero-fg-secondary': '#a5b4fc',
    '--hero-cone-color': 'rgba(86, 67, 204, 0.14)',
    '--hero-glow-color': 'rgba(86, 67, 204, 0.05)',
    '--hero-radial-glow': 'rgba(86, 67, 204, 0.08)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(86, 67, 204, 0.30) 0%, rgba(86, 67, 204, 0.08) 40%, transparent 70%)'
  },
  'ocean-depth': {
    '--landing-hero-bg': 'rgb(4, 20, 50)',
    '--landing-hero-stroke': 'rgba(56, 165, 220, 0.55)',
    '--landing-hero-stroke-light': 'rgba(56, 165, 220, 0.20)',
    '--landing-hero-fg': '#e0f2fe',
    '--landing-hero-fg-secondary': '#7dd3fc',
    '--hero-cone-color': 'rgba(56, 165, 220, 0.10)',
    '--hero-glow-color': 'rgba(56, 165, 220, 0.04)',
    '--hero-radial-glow': 'rgba(56, 165, 220, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(56, 165, 220, 0.22) 0%, rgba(56, 165, 220, 0.07) 40%, transparent 70%)'
  },
  'indigo-ink': {
    '--landing-hero-bg': '#0c0a2a',
    '--landing-hero-stroke': 'rgba(99, 102, 241, 0.30)',
    '--landing-hero-stroke-light': 'rgba(99, 102, 241, 0.12)',
    '--landing-hero-fg': '#e0e7ff',
    '--landing-hero-fg-secondary': '#818cf8',
    '--hero-cone-color': 'rgba(99, 102, 241, 0.12)',
    '--hero-glow-color': 'rgba(99, 102, 241, 0.04)',
    '--hero-radial-glow': 'rgba(99, 102, 241, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(99, 102, 241, 0.20) 0%, rgba(129, 140, 248, 0.06) 40%, transparent 70%)'
  },
  'indigo-dusk': {
    '--landing-hero-bg': '#14133d',
    '--landing-hero-stroke': 'rgba(129, 140, 248, 0.28)',
    '--landing-hero-stroke-light': 'rgba(129, 140, 248, 0.12)',
    '--landing-hero-fg': '#eef2ff',
    '--landing-hero-fg-secondary': '#a5b4fc',
    '--hero-cone-color': 'rgba(129, 140, 248, 0.16)',
    '--hero-glow-color': 'rgba(99, 102, 241, 0.05)',
    '--hero-radial-glow': 'rgba(99, 102, 241, 0.08)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(99, 102, 241, 0.24) 0%, rgba(129, 140, 248, 0.08) 40%, transparent 70%)'
  },
  'indigo-slate': {
    '--landing-hero-bg': '#0f1629',
    '--landing-hero-stroke': 'rgba(99, 102, 241, 0.22)',
    '--landing-hero-stroke-light': 'rgba(99, 102, 241, 0.08)',
    '--landing-hero-fg': '#e2e8f0',
    '--landing-hero-fg-secondary': '#94a3b8',
    '--hero-cone-color': 'rgba(99, 102, 241, 0.08)',
    '--hero-glow-color': 'rgba(99, 102, 241, 0.03)',
    '--hero-radial-glow': 'rgba(99, 102, 241, 0.05)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(99, 102, 241, 0.14) 0%, rgba(129, 140, 248, 0.04) 40%, transparent 70%)'
  },
  'red-ember': {
    '--landing-hero-bg': '#1a0505',
    '--landing-hero-stroke': 'rgba(239, 68, 68, 0.25)',
    '--landing-hero-stroke-light': 'rgba(239, 68, 68, 0.10)',
    '--landing-hero-fg': '#fef2f2',
    '--landing-hero-fg-secondary': '#f87171',
    '--hero-cone-color': 'rgba(239, 68, 68, 0.10)',
    '--hero-glow-color': 'rgba(220, 38, 38, 0.04)',
    '--hero-radial-glow': 'rgba(220, 38, 38, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(220, 38, 38, 0.16) 0%, rgba(239, 68, 68, 0.05) 40%, transparent 70%)'
  },
  'red-oxide': {
    '--landing-hero-bg': '#2a0a0a',
    '--landing-hero-stroke': 'rgba(248, 113, 113, 0.28)',
    '--landing-hero-stroke-light': 'rgba(248, 113, 113, 0.12)',
    '--landing-hero-fg': '#fecaca',
    '--landing-hero-fg-secondary': '#f87171',
    '--hero-cone-color': 'rgba(248, 113, 113, 0.14)',
    '--hero-glow-color': 'rgba(239, 68, 68, 0.05)',
    '--hero-radial-glow': 'rgba(239, 68, 68, 0.07)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(239, 68, 68, 0.20) 0%, rgba(248, 113, 113, 0.06) 40%, transparent 70%)'
  },
  'scarlet-deep': {
    '--landing-hero-bg': '#350808',
    '--landing-hero-stroke': 'rgba(252, 165, 165, 0.30)',
    '--landing-hero-stroke-light': 'rgba(252, 165, 165, 0.14)',
    '--landing-hero-fg': '#fee2e2',
    '--landing-hero-fg-secondary': '#fca5a5',
    '--hero-cone-color': 'rgba(252, 165, 165, 0.16)',
    '--hero-glow-color': 'rgba(248, 113, 113, 0.06)',
    '--hero-radial-glow': 'rgba(248, 113, 113, 0.08)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(248, 113, 113, 0.22) 0%, rgba(252, 165, 165, 0.07) 40%, transparent 70%)'
  },
  'slate-indigo': {
    '--landing-hero-bg': '#2d3258',
    '--landing-hero-stroke': 'rgba(165, 180, 252, 0.28)',
    '--landing-hero-stroke-light': 'rgba(165, 180, 252, 0.12)',
    '--landing-hero-fg': '#e0e7ff',
    '--landing-hero-fg-secondary': '#a5b4fc',
    '--hero-cone-color': 'rgba(165, 180, 252, 0.12)',
    '--hero-glow-color': 'rgba(129, 140, 248, 0.04)',
    '--hero-radial-glow': 'rgba(129, 140, 248, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(129, 140, 248, 0.18) 0%, rgba(165, 180, 252, 0.06) 40%, transparent 70%)'
  },
  'steel-blue': {
    '--landing-hero-bg': '#1e3a5f',
    '--landing-hero-stroke': 'rgba(125, 211, 252, 0.25)',
    '--landing-hero-stroke-light': 'rgba(125, 211, 252, 0.10)',
    '--landing-hero-fg': '#e0f2fe',
    '--landing-hero-fg-secondary': '#7dd3fc',
    '--hero-cone-color': 'rgba(125, 211, 252, 0.12)',
    '--hero-glow-color': 'rgba(56, 189, 248, 0.04)',
    '--hero-radial-glow': 'rgba(56, 189, 248, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(56, 189, 248, 0.16) 0%, rgba(125, 211, 252, 0.05) 40%, transparent 70%)'
  },
  'muted-plum': {
    '--landing-hero-bg': '#3d2a5c',
    '--landing-hero-stroke': 'rgba(196, 181, 253, 0.25)',
    '--landing-hero-stroke-light': 'rgba(196, 181, 253, 0.10)',
    '--landing-hero-fg': '#ede9fe',
    '--landing-hero-fg-secondary': '#c4b5fd',
    '--hero-cone-color': 'rgba(196, 181, 253, 0.12)',
    '--hero-glow-color': 'rgba(167, 139, 250, 0.04)',
    '--hero-radial-glow': 'rgba(167, 139, 250, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(167, 139, 250, 0.18) 0%, rgba(196, 181, 253, 0.06) 40%, transparent 70%)'
  },
  'warm-stone': {
    '--landing-hero-bg': '#44403c',
    '--landing-hero-stroke': 'rgba(214, 211, 209, 0.22)',
    '--landing-hero-stroke-light': 'rgba(214, 211, 209, 0.10)',
    '--landing-hero-fg': '#fafaf9',
    '--landing-hero-fg-secondary': '#a8a29e',
    '--hero-cone-color': 'rgba(214, 211, 209, 0.08)',
    '--hero-glow-color': 'rgba(168, 162, 158, 0.03)',
    '--hero-radial-glow': 'rgba(168, 162, 158, 0.04)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(168, 162, 158, 0.12) 0%, rgba(214, 211, 209, 0.04) 40%, transparent 70%)'
  },
  'forest-fog': {
    '--landing-hero-bg': '#1a3a2a',
    '--landing-hero-stroke': 'rgba(110, 231, 183, 0.22)',
    '--landing-hero-stroke-light': 'rgba(110, 231, 183, 0.10)',
    '--landing-hero-fg': '#d1fae5',
    '--landing-hero-fg-secondary': '#6ee7b7',
    '--hero-cone-color': 'rgba(110, 231, 183, 0.10)',
    '--hero-glow-color': 'rgba(52, 211, 153, 0.03)',
    '--hero-radial-glow': 'rgba(52, 211, 153, 0.05)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(52, 211, 153, 0.14) 0%, rgba(110, 231, 183, 0.05) 40%, transparent 70%)'
  },
  'wine-dusk': {
    '--landing-hero-bg': '#4a1942',
    '--landing-hero-stroke': 'rgba(244, 114, 182, 0.25)',
    '--landing-hero-stroke-light': 'rgba(244, 114, 182, 0.10)',
    '--landing-hero-fg': '#fce7f3',
    '--landing-hero-fg-secondary': '#f472b6',
    '--hero-cone-color': 'rgba(244, 114, 182, 0.12)',
    '--hero-glow-color': 'rgba(236, 72, 153, 0.04)',
    '--hero-radial-glow': 'rgba(236, 72, 153, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(236, 72, 153, 0.16) 0%, rgba(244, 114, 182, 0.05) 40%, transparent 70%)'
  },
  'burnt-sienna': {
    '--landing-hero-bg': '#5c2d12',
    '--landing-hero-stroke': 'rgba(251, 146, 60, 0.25)',
    '--landing-hero-stroke-light': 'rgba(251, 146, 60, 0.10)',
    '--landing-hero-fg': '#ffedd5',
    '--landing-hero-fg-secondary': '#fb923c',
    '--hero-cone-color': 'rgba(251, 146, 60, 0.12)',
    '--hero-glow-color': 'rgba(249, 115, 22, 0.04)',
    '--hero-radial-glow': 'rgba(249, 115, 22, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(249, 115, 22, 0.16) 0%, rgba(251, 146, 60, 0.05) 40%, transparent 70%)'
  },
  'dusty-rose': {
    '--landing-hero-bg': '#5c2a3a',
    '--landing-hero-stroke': 'rgba(251, 113, 133, 0.25)',
    '--landing-hero-stroke-light': 'rgba(251, 113, 133, 0.10)',
    '--landing-hero-fg': '#ffe4e6',
    '--landing-hero-fg-secondary': '#fb7185',
    '--hero-cone-color': 'rgba(251, 113, 133, 0.12)',
    '--hero-glow-color': 'rgba(244, 63, 94, 0.04)',
    '--hero-radial-glow': 'rgba(244, 63, 94, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(244, 63, 94, 0.16) 0%, rgba(251, 113, 133, 0.05) 40%, transparent 70%)'
  },
  'light-indigo': {
    '--landing-hero-bg': '#eef2ff',
    '--landing-hero-stroke': 'rgba(99, 102, 241, 0.45)',
    '--landing-hero-stroke-light': 'rgba(99, 102, 241, 0.20)',
    '--landing-hero-fg': '#312e81',
    '--landing-hero-fg-secondary': '#4338ca',
    '--hero-cone-color': 'rgba(200, 190, 255, 0.18)',
    '--hero-glow-color': 'rgba(140, 120, 255, 0.04)',
    '--hero-radial-glow': 'rgba(120, 100, 255, 0.06)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(99, 102, 241, 0.12) 0%, rgba(129, 140, 248, 0.04) 40%, transparent 70%)'
  },
  'light-violet': {
    '--landing-hero-bg': '#f5f3ff',
    '--landing-hero-stroke': 'rgba(139, 92, 246, 0.42)',
    '--landing-hero-stroke-light': 'rgba(139, 92, 246, 0.18)',
    '--landing-hero-fg': '#4c1d95',
    '--landing-hero-fg-secondary': '#6d28d9',
    '--hero-cone-color': 'rgba(196, 181, 253, 0.20)',
    '--hero-glow-color': 'rgba(139, 92, 246, 0.03)',
    '--hero-radial-glow': 'rgba(139, 92, 246, 0.05)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(139, 92, 246, 0.12) 0%, rgba(167, 139, 250, 0.04) 40%, transparent 70%)'
  },
  'light-rose': {
    '--landing-hero-bg': '#fff1f2',
    '--landing-hero-stroke': 'rgba(244, 63, 94, 0.40)',
    '--landing-hero-stroke-light': 'rgba(244, 63, 94, 0.18)',
    '--landing-hero-fg': '#881337',
    '--landing-hero-fg-secondary': '#be123c',
    '--hero-cone-color': 'rgba(255, 200, 200, 0.18)',
    '--hero-glow-color': 'rgba(244, 63, 94, 0.03)',
    '--hero-radial-glow': 'rgba(244, 63, 94, 0.05)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(244, 63, 94, 0.12) 0%, rgba(251, 113, 133, 0.04) 40%, transparent 70%)'
  },
  'light-red': {
    '--landing-hero-bg': '#fef2f2',
    '--landing-hero-stroke': 'rgba(220, 38, 38, 0.40)',
    '--landing-hero-stroke-light': 'rgba(220, 38, 38, 0.18)',
    '--landing-hero-fg': '#991b1b',
    '--landing-hero-fg-secondary': '#b91c1c',
    '--hero-cone-color': 'rgba(252, 165, 165, 0.18)',
    '--hero-glow-color': 'rgba(220, 38, 38, 0.03)',
    '--hero-radial-glow': 'rgba(220, 38, 38, 0.05)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(220, 38, 38, 0.10) 0%, rgba(248, 113, 113, 0.04) 40%, transparent 70%)'
  },
  'light-sky': {
    '--landing-hero-bg': '#f0f9ff',
    '--landing-hero-stroke': 'rgba(14, 165, 233, 0.40)',
    '--landing-hero-stroke-light': 'rgba(14, 165, 233, 0.18)',
    '--landing-hero-fg': '#0c4a6e',
    '--landing-hero-fg-secondary': '#0369a1',
    '--hero-cone-color': 'rgba(125, 211, 252, 0.18)',
    '--hero-glow-color': 'rgba(14, 165, 233, 0.03)',
    '--hero-radial-glow': 'rgba(14, 165, 233, 0.05)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(14, 165, 233, 0.10) 0%, rgba(56, 189, 248, 0.04) 40%, transparent 70%)'
  },
  'light-emerald': {
    '--landing-hero-bg': '#ecfdf5',
    '--landing-hero-stroke': 'rgba(16, 185, 129, 0.40)',
    '--landing-hero-stroke-light': 'rgba(16, 185, 129, 0.18)',
    '--landing-hero-fg': '#064e3b',
    '--landing-hero-fg-secondary': '#047857',
    '--hero-cone-color': 'rgba(167, 243, 208, 0.20)',
    '--hero-glow-color': 'rgba(16, 185, 129, 0.03)',
    '--hero-radial-glow': 'rgba(16, 185, 129, 0.05)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(16, 185, 129, 0.10) 0%, rgba(110, 231, 183, 0.04) 40%, transparent 70%)'
  },
  'light-amber': {
    '--landing-hero-bg': '#fffbeb',
    '--landing-hero-stroke': 'rgba(217, 119, 6, 0.40)',
    '--landing-hero-stroke-light': 'rgba(217, 119, 6, 0.18)',
    '--landing-hero-fg': '#78350f',
    '--landing-hero-fg-secondary': '#92400e',
    '--hero-cone-color': 'rgba(252, 211, 77, 0.20)',
    '--hero-glow-color': 'rgba(217, 119, 6, 0.03)',
    '--hero-radial-glow': 'rgba(217, 119, 6, 0.05)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(217, 119, 6, 0.10) 0%, rgba(252, 211, 77, 0.04) 40%, transparent 70%)'
  },
  cloud: {
    '--landing-hero-bg': '#f8fafc',
    '--landing-hero-stroke': 'rgba(148, 163, 184, 0.38)',
    '--landing-hero-stroke-light': 'rgba(148, 163, 184, 0.18)',
    '--landing-hero-fg': '#1e293b',
    '--landing-hero-fg-secondary': '#64748b',
    '--hero-cone-color': 'rgba(148, 163, 184, 0.10)',
    '--hero-glow-color': 'rgba(100, 116, 139, 0.02)',
    '--hero-radial-glow': 'rgba(100, 116, 139, 0.03)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(100, 116, 139, 0.06) 0%, rgba(148, 163, 184, 0.02) 40%, transparent 70%)'
  },
  snow: {
    '--landing-hero-bg': '#ffffff',
    '--landing-hero-stroke': 'rgba(99, 102, 241, 0.30)',
    '--landing-hero-stroke-light': 'rgba(99, 102, 241, 0.14)',
    '--landing-hero-fg': '#1e1b4b',
    '--landing-hero-fg-secondary': '#4338ca',
    '--hero-cone-color': 'rgba(99, 102, 241, 0.06)',
    '--hero-glow-color': 'rgba(99, 102, 241, 0.02)',
    '--hero-radial-glow': 'rgba(99, 102, 241, 0.03)',
    '--login-card-glow':
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(99, 102, 241, 0.06) 0%, rgba(129, 140, 248, 0.02) 40%, transparent 70%)'
  }
} as const;

export type HeroTheme = keyof typeof HERO_THEMES;

interface HeroBackdropProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  cone?: boolean;
  theme?: HeroTheme;
}

const GRAIN_SVG =
  "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='grain'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='noise'/><feComponentTransfer in='noise'><feFuncA type='linear' slope='0.4' intercept='0.6'/></feComponentTransfer></filter><rect width='100%25' height='100%25' filter='url(%23grain)'/></svg>\")";

export function HeroBackdrop({
  children,
  className,
  style,
  cone = true,
  theme
}: HeroBackdropProps) {
  const themeVars = theme ? (HERO_THEMES[theme] as unknown as React.CSSProperties) : undefined;

  return (
    <div
      className={`relative overflow-hidden ${className ?? ''}`}
      style={{
        backgroundColor: 'var(--landing-hero-bg)',
        borderBottom: '1px solid var(--landing-hero-stroke-light)',
        ...themeVars,
        ...style
      }}
    >
      <HeroIllustrations />

      {cone && (
        <div
          className="pointer-events-none absolute -top-16 left-0 z-1 w-full"
          aria-hidden="true"
          style={
            {
              '--cone-spread': '10%',
              '--cone-gap': '3%',
              '--cone-offset-y': '-5%',
              '--cone-color': 'var(--hero-cone-color, rgba(200, 190, 255, 0.18))',
              '--glow-spread': '4%',
              '--glow-color': 'var(--hero-glow-color, rgba(140, 120, 255, 0.04))',
              '--cone-start': 'calc(50% - var(--cone-spread))',
              '--cone-end': 'calc(50% + var(--cone-spread))',
              '--glow-start': 'calc(var(--cone-start) - var(--glow-spread))',
              '--glow-end': 'calc(var(--cone-end) + var(--glow-spread))',
              '--mask-width': '100%',
              '--mask-height': '720px',
              '--mask-fade-start': '0px',
              '--mask-fade-end': '100px',
              '--radial-glow': 'var(--hero-radial-glow, rgba(120, 100, 255, 0.06))',
              height: 'var(--mask-height)',
              background: [
                'conic-gradient(from 0deg at 50% var(--cone-offset-y), #0000 0, #0000 var(--glow-start), var(--glow-color) var(--cone-start), var(--cone-color) calc(var(--cone-start) + var(--cone-gap)), var(--cone-color) 50%, var(--cone-color) calc(var(--cone-end) - var(--cone-gap)), var(--glow-color) var(--cone-end), #0000 var(--glow-end), #0000 100%)',
                'radial-gradient(ellipse 30% 60% at 50% 10%, var(--radial-glow) 0%, transparent 100%)'
              ].join(', '),
              maskImage: [
                GRAIN_SVG,
                'linear-gradient(to bottom, #0000 var(--mask-fade-start), #000 var(--mask-fade-end))',
                'radial-gradient(ellipse var(--mask-width) var(--mask-height) at 50% 0, #000 0, #000 30%, #0000 100%)'
              ].join(', '),
              maskComposite: 'intersect, intersect',
              WebkitMaskComposite: 'source-in, source-in'
            } as React.CSSProperties
          }
        />
      )}

      {/* Noise texture */}
      <div
        className="pointer-events-none fixed inset-0 z-1 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage: 'var(--landing-noise)',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />

      {children}
    </div>
  );
}
