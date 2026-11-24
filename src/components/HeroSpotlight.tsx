import { useEffect, useRef } from 'react';

export default function HeroSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let targetX = width * 0.65;
    let targetY = height * 0.38;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = 0;

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    const draw = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // Subtle architectural grid dots
      const spacing = 44;
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const dx = x - currentX;
          const dy = y - currentY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const intensity = Math.max(0, 1 - dist / 340);

          ctx.fillStyle = `rgba(245, 245, 243, ${0.06 + intensity * 0.24})`;
          ctx.beginPath();
          ctx.arc(x, y, 1 + intensity * 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Soft ambient spotlight mesh
      const accent =
        getComputedStyle(document.documentElement).getPropertyValue('--ambient-accent').trim() ||
        '#d4a373';

      const grad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 420);
      grad.addColorStop(0, `${accent}26`);
      grad.addColorStop(0.5, `${accent}0d`);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      rafId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
    />
  );
}
