'use client';

/**
 * Linear-style ambient glow background.
 * Clean white/purple radial gradients instead of aurora blobs.
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
            'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 35%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'glow-pulse-0 12s ease-in-out infinite'
        }}
      />

      {/* Purple accent glow — left */}
      <div
        className="absolute will-change-transform"
        style={{
          width: 600,
          height: 600,
          left: '25%',
          top: '40%',
          translate: '-50% -50%',
          background:
            'radial-gradient(circle, rgba(86,67,204,0.12) 0%, rgba(86,67,204,0.04) 40%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'glow-pulse-1 16s ease-in-out infinite'
        }}
      />

      {/* Soft white glow — right */}
      <div
        className="absolute will-change-transform"
        style={{
          width: 700,
          height: 500,
          left: '70%',
          top: '30%',
          translate: '-50% -50%',
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'glow-pulse-2 14s ease-in-out infinite'
        }}
      />

      {/* Deep purple accent — bottom */}
      <div
        className="absolute will-change-transform"
        style={{
          width: 500,
          height: 500,
          left: '55%',
          top: '70%',
          translate: '-50% -50%',
          background: 'radial-gradient(circle, rgba(103,63,215,0.08) 0%, transparent 60%)',
          filter: 'blur(100px)',
          animation: 'glow-pulse-3 18s ease-in-out infinite'
        }}
      />

      <style>{`
        @keyframes glow-pulse-0 {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes glow-pulse-1 {
          0%, 100% { opacity: 1; transform: scale(1) translate(0, 0); }
          50% { opacity: 0.6; transform: scale(1.1) translate(20px, -10px); }
        }
        @keyframes glow-pulse-2 {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.95); }
        }
        @keyframes glow-pulse-3 {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
