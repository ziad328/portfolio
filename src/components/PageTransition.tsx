'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// The first page load already has its own entrance animations (navbar, TextReveal),
// and fading it here would flash the server-rendered page out and back in.
let firstMount = true;

// Fades a page in after a client-side navigation. Used inside pages rather than app/template.tsx,
// because the root template doesn't remount between /projects/a and /projects/b.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (firstMount) {
      firstMount = false;
      return;
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    // clearProps: a leftover transform would turn this div into the containing block for fixed children
    gsap.from(ref.current, { opacity: 0, y: 30, duration: 0.6, ease: 'expo.out', clearProps: 'opacity,transform' });
  });

  return <div ref={ref}>{children}</div>;
}
