'use client';

import { useEffect, useRef } from 'react';

interface AuroraBlob {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  baseRadius: number;
  color: [number, number, number];
  phase: number;
  speed: number;
  orbitX: number;
  orbitY: number;
  pulseSpeed: number;
  pulseAmount: number;
}

const COLORS: [number, number, number][] = [
  [99, 102, 241], // indigo
  [124, 58, 237], // violet
  [168, 85, 247], // purple
  [217, 70, 239], // fuchsia
  [236, 72, 153], // pink
  [79, 70, 229], // deep indigo
  [45, 212, 191], // teal
  [56, 189, 248], // sky
  [251, 146, 60], // warm amber (accent)
  [139, 92, 246] // mid violet
];

function createBlob(w: number, h: number, i: number, total: number): AuroraBlob {
  // Distribute blobs across the canvas more intentionally
  const angle = (i / total) * Math.PI * 2;
  const cx = w * 0.5;
  const cy = h * 0.5;
  const spread = Math.min(w, h) * 0.35;

  const baseX = cx + Math.cos(angle) * spread * (0.5 + Math.random() * 0.5);
  const baseY = cy + Math.sin(angle) * spread * (0.5 + Math.random() * 0.5);
  const baseRadius = 250 + Math.random() * 350;

  return {
    x: baseX,
    y: baseY,
    baseX,
    baseY,
    radius: baseRadius,
    baseRadius,
    color: COLORS[i % COLORS.length],
    phase: Math.random() * Math.PI * 2,
    speed: 0.06 + Math.random() * 0.08,
    orbitX: 150 + Math.random() * 250,
    orbitY: 120 + Math.random() * 200,
    pulseSpeed: 0.1 + Math.random() * 0.15,
    pulseAmount: 0.2 + Math.random() * 0.25
  };
}

export function AuroraCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let blobs: AuroraBlob[] = [];
    let time = 0;
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      const newW = rect.width;
      const newH = rect.height;
      canvas.width = newW * dpr;
      canvas.height = newH * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Only regenerate blobs on first call or significant size change
      if (blobs.length === 0 || Math.abs(newW - w) > 100 || Math.abs(newH - h) > 100) {
        const count = 10;
        blobs = Array.from({ length: count }, (_, i) => createBlob(newW, newH, i, count));
      }
      w = newW;
      h = newH;
    }

    function render() {
      if (!canvas || !ctx) return;

      time += 0.008;

      ctx.clearRect(0, 0, w, h);

      // dark base
      ctx.fillStyle = '#08080c';
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';

      for (const blob of blobs) {
        // Orbital / swirl motion
        blob.x = blob.baseX + Math.sin(time * blob.speed + blob.phase) * blob.orbitX;
        blob.y = blob.baseY + Math.cos(time * blob.speed * 0.7 + blob.phase + 1.5) * blob.orbitY;

        // Pulsing radius
        blob.radius =
          blob.baseRadius * (1 + Math.sin(time * blob.pulseSpeed + blob.phase) * blob.pulseAmount);

        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        const [r, g, b] = blob.color;
        grad.addColorStop(0, `rgba(${r},${g},${b},0.2)`);
        grad.addColorStop(0.3, `rgba(${r},${g},${b},0.1)`);
        grad.addColorStop(0.7, `rgba(${r},${g},${b},0.03)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      animId = requestAnimationFrame(render);
    }

    resize();
    render();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
