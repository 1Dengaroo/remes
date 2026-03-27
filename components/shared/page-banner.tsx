'use client';

export function PageBanner() {
  return (
    <div
      className="h-44 w-full"
      style={{
        background:
          'linear-gradient(160deg, oklch(var(--accent-primary) / 0.14), oklch(var(--accent-tertiary) / 0.10) 50%, oklch(var(--accent-secondary) / 0.08))'
      }}
    />
  );
}
