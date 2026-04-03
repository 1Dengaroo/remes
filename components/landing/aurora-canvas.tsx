'use client';

/**
 * Ambient glow background for the hero section.
 * White + primary purple radial gradients with slow pulse animations.
 */
export function AuroraCanvas({ className }: { className?: string }) {
  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      {/* Primary white glow — top center */}
      <div
        className="absolute will-change-transform"
        style={{
          width: 900,
          height: 600,
          left: '50%',
          top: '15%',
          translate: '-50% -50%',
          background:
            'radial-gradient(ellipse at center, var(--landing-aurora-white) 0%, var(--landing-aurora-white-edge) 35%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'glow-pulse-0 12s ease-in-out infinite'
        }}
      />

      {/* Large purple glow — center left */}
      <div
        className="absolute will-change-transform"
        style={{
          width: 800,
          height: 700,
          left: '20%',
          top: '40%',
          translate: '-50% -50%',
          background:
            'radial-gradient(circle, var(--landing-aurora-purple-l) 0%, var(--landing-aurora-purple-l-edge) 35%, transparent 65%)',
          filter: 'blur(70px)',
          animation: 'glow-pulse-1 16s ease-in-out infinite'
        }}
      />

      {/* Purple glow — center right */}
      <div
        className="absolute will-change-transform"
        style={{
          width: 600,
          height: 500,
          left: '75%',
          top: '35%',
          translate: '-50% -50%',
          background:
            'radial-gradient(circle, var(--landing-aurora-blue-r) 0%, var(--landing-aurora-blue-r-edge) 40%, transparent 65%)',
          filter: 'blur(80px)',
          animation: 'glow-pulse-2 14s ease-in-out infinite'
        }}
      />

      {/* Soft white glow — right */}
      <div
        className="absolute will-change-transform"
        style={{
          width: 700,
          height: 500,
          left: '70%',
          top: '25%',
          translate: '-50% -50%',
          background:
            'radial-gradient(ellipse at center, var(--landing-aurora-white-soft) 0%, var(--landing-aurora-white-soft-edge) 40%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'glow-pulse-3 18s ease-in-out infinite'
        }}
      />

      {/* Deep purple bloom — bottom center */}
      <div
        className="absolute will-change-transform"
        style={{
          width: 700,
          height: 600,
          left: '50%',
          top: '70%',
          translate: '-50% -50%',
          background:
            'radial-gradient(circle, var(--landing-aurora-deep) 0%, var(--landing-aurora-deep-edge) 40%, transparent 65%)',
          filter: 'blur(90px)',
          animation: 'glow-pulse-4 20s ease-in-out infinite'
        }}
      />

      {/* Purple accent — top right */}
      <div
        className="absolute will-change-transform"
        style={{
          width: 500,
          height: 400,
          left: '80%',
          top: '15%',
          translate: '-50% -50%',
          background: 'radial-gradient(circle, var(--landing-aurora-accent) 0%, transparent 60%)',
          filter: 'blur(70px)',
          animation: 'glow-pulse-0 22s ease-in-out infinite'
        }}
      />

      <style>{`
        @keyframes glow-pulse-0 {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes glow-pulse-1 {
          0%, 100% { opacity: 1; transform: scale(1) translate(0, 0); }
          50% { opacity: 0.7; transform: scale(1.1) translate(20px, -10px); }
        }
        @keyframes glow-pulse-2 {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }
        @keyframes glow-pulse-3 {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes glow-pulse-4 {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
