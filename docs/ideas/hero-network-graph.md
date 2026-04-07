# Hero Network Graph Animation

## Problem Statement

How might we give visitors an instant "aha" about Remes's intelligence pipeline — distinct from the step-by-step showcase below — using an animated network graph that reveals the signal-to-email web?

## Recommended Direction

**Progressive reveal network graph** — fixed node positions in a left-to-right flow across 4 columns: Signals → Companies → Contacts → Emails. Nodes appear column by column, then SVG connector lines draw between them, revealing the intelligence web that powers Remes.

This is fundamentally different from the showcase section (which shows mock UI components in a vertical walkthrough). The graph shows the _data relationships_ — how signals connect to companies, companies to contacts, contacts to personalized emails. It's abstract enough to intrigue, concrete enough to understand.

## MVP Scope

- 4 columns: 3 signal nodes, 2 company nodes, 3 contact nodes, 2 email nodes
- Nodes: small labeled pills with icons or initials
- SVG path connectors between related nodes (curated connections, not every-to-every)
- GSAP timeline: column 1 → lines draw → column 2 → lines draw → column 3 → lines draw → column 4
- ~1s pause between each column reveal
- Plays once, holds final state
- Desktop only

## Not Doing (and Why)

- **No interactive hover** — passive animation
- **No mock UI cards** — showcase handles that
- **No looping** — plays once
- **No mobile** — graph needs horizontal space
- **No physics** — fixed positions for predictability
