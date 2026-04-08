---
name: ui-audit
description: Audit the codebase for ad-hoc interactive elements that should use shadcn/ui components, and for repeated className overrides on shadcn components that should be variants or base style changes. Use when the user asks to audit components, check for raw buttons/inputs, find DRY violations in UI component usage, or clean up className overrides.
---

# UI Audit

Audit the codebase for two categories of issues:

1. **Ad-hoc elements** that should use the shared `components/ui/` components.
2. **Repeated className overrides** on shadcn components that violate DRY and should be variants or base style updates.

## How to run

### Pass 1: Ad-hoc interactive elements

Search for raw HTML interactive elements outside of `components/ui/` that should use the corresponding shadcn component instead.

```bash
# Raw <button> elements (should be <Button>)
rg '<button' --glob '*.tsx' --glob '!components/ui/*' -l

# Raw <input> elements without a wrapper component (should be <Input>)
rg '<input ' --glob '*.tsx' --glob '!components/ui/*' -l

# Raw <textarea> elements (should be <Textarea>)
rg '<textarea' --glob '*.tsx' --glob '!components/ui/*' -l

# Raw <select> elements (should be <Select>)
rg '<select' --glob '*.tsx' --glob '!components/ui/*' -l

# Raw <a> tags acting as buttons (onClick without href)
rg '<a ' --glob '*.tsx' --glob '!components/ui/*' | rg 'onClick'

# <span> or <div> with onClick (should be <Button>)
rg '<(span|div)' --glob '*.tsx' --glob '!components/ui/*' | rg 'onClick'
```

**Exceptions** (do NOT flag these):

- `components/ui/` files themselves — they ARE the base components.
- `error-boundary.client.tsx` — uses inline styles intentionally (renders before CSS loads).
- Elements inside Radix primitives using `asChild` — these are composition, not ad-hoc.
- `<input type="hidden">` — not interactive, doesn't need `<Input>`.
- `<a>` tags with `href` and no `onClick` — these are real links, not button replacements.

For each finding, report:

- File path and line number
- What element was found
- What shadcn component should replace it
- Whether it's keyboard accessible (does it have proper focus handling?)

### Pass 2: Repeated className overrides (DRY violations)

Search for patterns where the same className modifications are applied to a shadcn component 3+ times across the codebase. These should either become a variant on the base component or a default style change.

```bash
# Find all className overrides on Button components
rg '<Button[^>]*className="[^"]*"' --glob '*.tsx' -o | sort | uniq -c | sort -rn

# Find all className overrides on Card components
rg '<Card[^>]*className="[^"]*"' --glob '*.tsx' -o | sort | uniq -c | sort -rn

# Find all className overrides on Input components
rg '<Input[^>]*className="[^"]*"' --glob '*.tsx' -o | sort | uniq -c | sort -rn
```

Look for these specific DRY smells:

1. **Same className on 3+ instances** of the same component — extract to a variant.
2. **Overriding base styles** that the component already provides (e.g., adding `cursor-pointer` to `<Button>` which already has it).
3. **Undoing default styles** repeatedly (e.g., `!py-0 !gap-0` on every `<Card>`) — change the default.
4. **Layout overrides** like `w-full`, `h-auto`, `rounded-none` appearing on most instances — consider whether the base should change or a variant should exist.
5. **Ghost buttons used as non-button interactive rows** — if `<Button variant="ghost">` is consistently used with `h-auto w-full justify-start rounded-none` for list items, consider a `list-item` variant.

For each DRY violation, report:

- The repeated className pattern
- How many times it appears
- Which files
- Recommendation: new variant, base style change, or wrapper component

### Pass 3: Variant opportunities

Check if the existing variants on shadcn components cover actual usage patterns:

1. Read each component in `components/ui/` that has variants (Button, Badge, Tabs, etc.)
2. Compare variant options against actual usage in the codebase
3. Identify className patterns that appear 3+ times and could be a named variant

Example: if `<Button variant="ghost" className="h-auto p-0 hover:bg-transparent">` appears 5 times, recommend a `"link-plain"` variant.

## Output format

Organize findings into three sections:

```
## Ad-hoc Elements
| File | Line | Element | Should Be | Accessible? |
|------|------|---------|-----------|-------------|

## DRY Violations
| Pattern | Count | Files | Recommendation |
|---------|-------|-------|----------------|

## Variant Opportunities
| Component | Repeated className | Count | Suggested Variant |
|-----------|-------------------|-------|-------------------|
```

## When to fix vs. flag

- **Fix immediately**: Raw `<button>`, `<span onClick>`, `<div onClick>` — these are accessibility bugs (no focus ring, no keyboard support).
- **Fix immediately**: className overrides that undo a base style you just changed (means the base is wrong).
- **Flag for discussion**: Patterns that appear 3-5 times — might be a variant, might be intentional variation.
- **Create variant**: Patterns that appear 6+ times — definitely should be a variant.

## Principles

- The goal is zero className overrides in the ideal case. Every override is a potential DRY violation.
- Variants are cheap. If a pattern repeats, make it a variant.
- The base component should handle the 80% case with no className needed.
- Only override className for truly one-off layout needs (positioning in a specific parent).
