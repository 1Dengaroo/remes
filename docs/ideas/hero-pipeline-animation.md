# Hero Pipeline Waterfall Animation

## Problem Statement

How might we show SMB founders what Remes does _instantly_ — without requiring them to scroll or interact — through a right-side hero animation that demonstrates the signal-to-email pipeline?

## Recommended Direction

**Auto-playing diagonal waterfall cascade** on the right side of the hero. Three cards — Signal, Contact, Email — appear in sequence with a diagonal offset (top-right to bottom-left), connected by clean geometric SVG lines that draw themselves between cards as each stage appears. The animation loops every ~9 seconds.

The hero layout shifts from centered full-width to a **left (headline + CTA) / right (animation)** split on desktop. On mobile, the animation is hidden entirely — hero stays as the current centered layout.

Each card contains realistic mock content (company name, contact details, email snippet) styled to match the product's actual UI, so the animation doubles as a product screenshot. The diagonal flow creates a visual "pipeline" metaphor — data flowing downhill from raw signal to finished outreach.

## Key Assumptions to Validate

- [ ] ~9s loop is the right timing — test with real users; too fast = anxiety, too slow = boring
- [ ] Card content is readable at the rendered size on 1280px+ screens — may need to simplify content for smaller desktop breakpoints
- [ ] The animation doesn't tank Lighthouse performance score — GSAP timeline with will-change should be fine, but measure CLS and LCP impact

## MVP Scope

- New `HeroPipeline` client component in `components/landing/`
- GSAP timeline with `useGSAP` hook — no ScrollTrigger needed
- 3 static card components (Signal, Contact, Email) with hardcoded mock data
- SVG connector lines that animate `stroke-dashoffset` in sync with card appearances
- Hero layout: CSS grid split (left text / right animation) at `lg:` breakpoint
- Desktop-only: `hidden lg:block` on the animation container
- Uses existing design tokens from `landing.css`

## Not Doing (and Why)

- **No scroll-triggered behavior** — hero animations should work on load without interaction
- **No mobile version** — small screens can't render readable card content; the centered hero already works well
- **No interactive cards** — this is a passive demo, not a clickable prototype; the showcase section below handles interactivity
- **No 3D transforms** — adds complexity and potential rendering issues for marginal visual gain
- **Not modifying the existing showcase section** — this is additive, sits in the hero only
- **No data cycling / multiple scenarios** — MVP shows one pipeline run (one company, one contact, one email). Multiple scenarios can come later

## Open Questions

- Should the cards have a subtle glow/shadow matching the aurora background, or stay flat?
- Should there be a brief label ("Signal detected", "Contact enriched", "Email drafted") that fades in alongside each card, or let the card content speak for itself?
