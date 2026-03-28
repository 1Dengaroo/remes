'use client';

const BLOBS = [
  { color: 'rgba(99,102,241,0.2)', size: 500, x: '15%', y: '20%', duration: 22, delay: 0 },
  { color: 'rgba(124,58,237,0.2)', size: 550, x: '70%', y: '15%', duration: 26, delay: -4 },
  { color: 'rgba(168,85,247,0.18)', size: 480, x: '45%', y: '60%', duration: 20, delay: -8 },
  { color: 'rgba(217,70,239,0.15)', size: 520, x: '80%', y: '70%', duration: 24, delay: -12 },
  { color: 'rgba(236,72,153,0.15)', size: 460, x: '25%', y: '75%', duration: 28, delay: -6 },
  { color: 'rgba(79,70,229,0.18)', size: 500, x: '60%', y: '40%', duration: 23, delay: -10 },
  { color: 'rgba(45,212,191,0.12)', size: 440, x: '35%', y: '30%', duration: 25, delay: -3 },
  { color: 'rgba(139,92,246,0.16)', size: 480, x: '50%', y: '85%', duration: 21, delay: -7 }
];

export function AuroraCanvas({ className }: { className?: string }) {
  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            translate: '-50% -50%',
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            animation: `aurora-drift-${i % 4} ${blob.duration}s ease-in-out infinite`,
            animationDelay: `${blob.delay}s`
          }}
        />
      ))}
      <style>{`
        @keyframes aurora-drift-0 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(80px, -60px) scale(1.15); }
          66% { transform: translate(-50px, 40px) scale(0.9); }
        }
        @keyframes aurora-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-70px, 50px) scale(0.85); }
          66% { transform: translate(60px, -40px) scale(1.1); }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, 70px) scale(1.1); }
          66% { transform: translate(-80px, -30px) scale(0.9); }
        }
        @keyframes aurora-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(0.95); }
          33% { transform: translate(-60px, -50px) scale(1.1); }
          66% { transform: translate(70px, 60px) scale(1); }
        }
      `}</style>
    </div>
  );
}
