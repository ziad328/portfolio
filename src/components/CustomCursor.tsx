'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

// A dot that follows the mouse and grows into a "VIEW ↗" circle over [data-cursor="view"].
// Desktop only (fine pointer), and off for reduced motion and the admin pages.
export default function CustomCursor() {
  const isAdmin = usePathname().startsWith('/admin');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    document.body.classList.add('cursor-custom');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.style.opacity = '1';
      const overView = (e.target as Element).closest?.('[data-cursor="view"]');
      el.dataset.state = overView ? 'view' : '';
    };
    const onLeave = () => (el.style.opacity = '0');

    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('cursor-custom');
      gsap.killTweensOf(el);
    };
  }, [isAdmin]);

  if (isAdmin) return null;

  // GSAP owns the outer transform, so the size change lives on the inner element's `scale`.
  // Blend mode sits on the outer element because it's the one that forms the stacking context.
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-testid="custom-cursor"
      style={{ opacity: 0 }}
      className="group pointer-events-none fixed left-0 top-0 z-100 mix-blend-difference transition-opacity duration-200 data-[state=view]:mix-blend-normal"
    >
      <div className="flex size-20 -translate-x-1/2 -translate-y-1/2 scale-10 items-center justify-center rounded-full bg-white transition-[scale,background-color] duration-300 ease-(--ease-out-expo) group-data-[state=view]:scale-100 group-data-[state=view]:bg-accent">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white opacity-0 transition-opacity duration-200 group-data-[state=view]:opacity-100">
          View ↗
        </span>
      </div>
    </div>
  );
}
