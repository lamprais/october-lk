import { useEffect, useRef, useState } from 'react';

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>('');
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (!isFine) return;

    document.body.classList.add('has-magnetic-cursor');

    let mouseX = -100;
    let mouseY = -100;
    let posX = -100;
    let posY = -100;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>('[data-cursor-label], a, button');
      if (interactive) {
        setActive(true);
        setLabel(interactive.dataset.cursorLabel || '');
      } else {
        setActive(false);
        setLabel('');
      }
    };

    const onLeave = () => setVisible(false);

    const loop = () => {
      posX += (mouseX - posX) * 0.78;
      posY += (mouseY - posY) * 0.78;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('has-magnetic-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:flex items-center justify-center transition-[width,height,background-color] duration-150 ease-out"
      style={{
        willChange: 'transform',
        width: label ? '96px' : active ? '40px' : '12px',
        height: label ? '96px' : active ? '40px' : '12px',
        borderRadius: '9999px',
        backgroundColor: label
          ? 'rgba(245, 245, 243, 0.96)'
          : active
            ? 'rgba(245, 245, 243, 0.14)'
            : 'var(--ambient-accent, #d4a373)',
        border: active && !label ? '1px solid rgba(245, 245, 243, 0.5)' : 'none',
        mixBlendMode: label ? 'normal' : 'difference',
      }}
    >
      {label && (
        <span className="px-2 text-center text-[10px] font-semibold tracking-[0.14em] text-[#0A0A0B] uppercase">
          {label}
        </span>
      )}
    </div>
  );
}
