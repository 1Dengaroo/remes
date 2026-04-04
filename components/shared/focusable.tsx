import { type ComponentProps, type ElementType } from 'react';

/**
 * Wrapper that makes any element focusable via Tab key.
 * Renders as a <span> by default (no layout side-effects).
 * Shows a visible focus ring only on keyboard navigation (focus-visible).
 */
export function Focusable<T extends ElementType = 'span'>({
  as,
  className = '',
  ...props
}: { as?: T } & Omit<ComponentProps<T>, 'as'>) {
  const Tag = as ?? 'span';
  return (
    <Tag
      tabIndex={0}
      className={`focus-visible:ring-primary rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${className}`}
      {...props}
    />
  );
}
