# Signals Section Redesign

## Problem Statement

How might we make the signals section feel alive and show visitors what happens when each signal fires — rather than just listing 9 static cards?

## Recommended Direction

Two-panel layout. Signal cards in a compact 2-column grid on the left (~40% width). Animated preview panel on the right (~60%) that shows detection results streaming in, then an email opener referencing the signal.

The preview tells the full story for each signal: **signal detected -> companies matched -> outreach generated**. This transforms a forgettable card grid into proof that Remes works for _any_ signal type the visitor cares about.

Inherits light/dark theme from the interactive demo above via shared state, so both sections feel like one cohesive product preview.

## Key Assumptions to Validate

- [ ] Users engage with signal cards rather than scrolling past — mitigate with auto-cycling (same pattern as interactive demo)
- [ ] 9 signal types each need convincing mock data — reuse company name patterns, vary match reasons per signal
- [ ] Theme state can be shared cleanly between interactive demo and signals section — lift to parent or lightweight store

## MVP Scope

**Left panel (2-col grid, ~40% width):**

- 9 signal cards: icon, source name, short example
- Selected card is highlighted
- Custom Signals card at bottom (full-width) with rainbow border
- Auto-cycles through signals every ~5s, pauses on user interaction

**Right panel (sticky preview, ~60% width):**

- Phase 1: 2-3 matched companies stream in with signal match reason (fade-in, staggered)
- Phase 2: Email opener streams character-by-character referencing the signal
- Smooth transition between signals (crossfade)
- Uses app theme tokens via inherited data-theme attribute

**Shared state:**

- Theme toggle in the interactive demo controls both sections
- Lift theme state to landing.tsx or use a tiny Zustand store

**Mobile:**

- Stacked layout: signal cards grid above, preview below
- Preview still auto-plays

## Not Doing (and Why)

- **Real API calls** — landing page is static, mock data only
- **Scroll-to-demo linking** — clicking a signal scrolling up to the interactive demo adds complexity for marginal value, revisit later
- **Multiple email previews per signal** — one opener is enough to prove the point, keep it snappy
- **Custom signal input with live preview** — just show the "define any signal" message for now, real input needs backend
- **Animated arrows between sections** — component exists, but save for a later polish pass

## Open Questions

- Should the custom signal card behave differently in this layout (e.g. span both columns with special treatment)?
- What company names/data to use per signal type — should they feel like real companies or clearly fictional?
