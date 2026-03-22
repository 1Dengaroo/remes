# Theme Framework

This project uses a token-based theming system that powers all visual styling through CSS custom properties. Every color, shadow, radius, and spacing decision must trace back to a token — never hardcode raw values.

## Architecture Overview

```
styles/themes/<name>.css       Token definitions per theme (scoped via [data-theme='<name>'])
styles/themes/_contract.css    Documentation of all required tokens (the contract)
styles/globals.css             Tailwind bridge (@theme inline) + base styles + font switching
lib/theme/theme-registry.ts    Theme metadata (id, name, isDark, preview colors)
lib/theme/theme-provider.tsx   next-themes wrapper, sets data-theme attribute + .dark class
lib/theme/font-registry.ts     Font metadata (id, name, CSS variable)
lib/theme/font-provider.tsx    Font context, sets data-font attribute on <html>
components/settings/appearance-tab.client.tsx  UI for switching theme + font
```

## Two Token Layers

Every theme file must implement **both** layers:

### 1. Semantic Tokens (oklch L C H components)

Three space-separated numbers. Consumed via `oklch(var(--token))` or with alpha `oklch(var(--token) / 0.5)`. These are bridged to Tailwind in `globals.css` as `--color-*` custom properties.

| Group        | Tokens                                                                                |
| ------------ | ------------------------------------------------------------------------------------- |
| **Accents**  | `--accent-primary`, `--accent-secondary`                                              |
| **Surfaces** | `--surface-primary`, `--surface-secondary`, `--surface-elevated`, `--surface-overlay` |
| **Borders**  | `--border-default`, `--border-subtle`, `--border-strong`                              |
| **Text**     | `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse`                |
| **Shadows**  | `--shadow-sm`, `--shadow-md`, `--shadow-lg` (full CSS shadow values, not components)  |

Usage in Tailwind classes: `bg-surface-primary`, `text-text-secondary`, `border-border-default`, etc.

### 2. Shadcn Bridge Tokens (complete color values)

Full color values (use `hsl()` or `oklch()` wrapper — bare component numbers will NOT work). These power all shadcn/ui components through the `@theme inline` bridge in `globals.css`.

| Group           | Tokens                                                                                                                                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page**        | `--background`, `--foreground`                                                                                                                                                                                                                                    |
| **Components**  | `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground` |
| **UI Elements** | `--border`, `--input`, `--ring`, `--radius`                                                                                                                                                                                                                       |
| **Charts**      | `--chart-1` through `--chart-5`                                                                                                                                                                                                                                   |
| **Sidebar**     | `--sidebar-background`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`                                                                      |

Usage in Tailwind classes: `bg-primary`, `text-muted-foreground`, `border-border`, etc.

**CRITICAL:** Bridge tokens must be complete color values wrapped in `hsl()` or `oklch()`. Writing bare numbers like `36 20% 93%` without the `hsl()` wrapper will result in transparent/broken colors across the entire app.

### 3. Card Style Tokens

Control card appearance per theme (sharp editorial vs soft rounded):

```css
--card-radius: 2px; /* or 16px for rounded themes */
--card-border-width: 1px;
--card-border-opacity: 0.4;
--card-shadow: none;
--card-hover-shadow: var(--shadow-md);
--card-hover-y: -2px;
--card-accent-bar-height: 0px;
--card-accent-bar-scale: 0;
```

## How to Add a New Theme

1. **Create** `styles/themes/<name>.css` scoped under `[data-theme='<name>']`
   - Optionally add a `[data-theme='<name>'] body { ... }` rule for background textures/gradients
   - Implement ALL semantic tokens and ALL shadcn bridge tokens from the contract
   - Wrap all bridge token color values in `hsl()` or `oklch()`
2. **Import** in `styles/globals.css`:
   ```css
   @import '../styles/themes/<name>.css';
   ```
3. **Register** in `lib/theme/theme-registry.ts`:

   ```ts
   {
     id: '<name>',
     name: 'Display Name',
     description: 'Short description',
     isDark: true | false,
     previewColors: { bg: '...', primary: '...', secondary: '...', tertiary: '...' }
   }
   ```

   - Set `isDark: true` for dark themes — this toggles the `.dark` class on `<html>` for Tailwind's `dark:` variant

## How Theme Switching Works

- `next-themes` sets `data-theme="<name>"` on `<html>`
- CSS specificity does the rest — `[data-theme='light'] { ... }` overrides all token values
- `DarkClassManager` in `theme-provider.tsx` reads `isDark` from the registry and toggles the `.dark` class
- Font switching uses a parallel `data-font` attribute on `<html>`, managed by `FontProvider`

## Rules

- **Never hardcode colors** — always use a token via Tailwind class (`bg-primary`, `text-muted-foreground`) or CSS variable (`var(--shadow-md)`)
- **Never use raw hex/rgb in components** — if a color doesn't have a token, add one to the theme files
- **Every theme must implement the full contract** — missing tokens cause components to silently inherit wrong values or go transparent
- **Prefer shadcn/ui semantic classes** (`bg-card`, `text-foreground`, `border-border`) for component styling
- **Use semantic tokens** (`bg-surface-elevated`, `text-text-secondary`) for custom components that need the design system's vocabulary
- **Test every theme** after changes — switching themes should never produce invisible text, missing borders, or broken backgrounds
- **Keep `_contract.css` updated** if you add new token categories

## Current Themes

| ID      | Name  | Type  | Character                                      |
| ------- | ----- | ----- | ---------------------------------------------- |
| `light` | Light | Light | Purple and sand on white, sharp 2px corners    |
| `dark`  | Dark  | Dark  | Purple and sand on charcoal, sharp 2px corners |

## Font System

Fonts are orthogonal to themes — any font works with any theme. Managed via `data-font` attribute on `<html>`.

| ID              | Font          | Character                     |
| --------------- | ------------- | ----------------------------- |
| `sora`          | Sora          | Modern geometric sans-serif   |
| `inter`         | Inter         | Clean and neutral             |
| `space-grotesk` | Space Grotesk | Technical and sharp (default) |

To add a font: register in `font-registry.ts`, load in `app/layout.tsx` via `next/font/google`, add a `[data-font='<id>']` rule in `globals.css`.
