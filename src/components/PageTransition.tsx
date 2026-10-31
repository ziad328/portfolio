'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { hasFlight, landFlight, revealPage } from '@/lib/pageTransition';

gsap.registerPlugin(useGSAP);

// The first page load already has its own entrance animations (navbar, TextReveal),
// and fading it here would flash the server-rendered page out and back in.
let firstMount = true;

// Brings a page in after a client-side navigation: lands a project image flying in from a card
// (see lib/pageTransition), lifts the curtain TransitionLink put up, and otherwise fades the page up.
// Used inside pages rather than app/template.tsx, because the root template doesn't remount
// between /projects/a and /projects/b.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (firstMount) {
      firstMount = false;
      return;
    }
    const landing = hasFlight();
    // Next frame: outside this effect's GSAP context, so a cleanup can't revert the curtain or the flight
    const frame = requestAnimationFrame(() => {
      if (landing) landFlight(ref.current?.querySelector<HTMLElement>('[data-flip-target]') ?? null);
      revealPage();
    });
    // The hero is the flight's target, so it must not move while the image lands on it
    if (!landing && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      // clearProps: a leftover transform would turn this div into the containing block for fixed children
      gsap.from(ref.current, { opacity: 0, y: 30, duration: 0.6, ease: 'expo.out', clearProps: 'opacity,transform' });
    }
    return () => cancelAnimationFrame(frame);
  });

  return <div ref={ref}>{children}</div>;
}
