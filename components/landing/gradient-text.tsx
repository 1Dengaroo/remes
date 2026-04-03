export function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block"
      style={{
        backgroundImage: 'var(--landing-brand-gradient)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}
    >
      {children}
    </span>
  );
}
