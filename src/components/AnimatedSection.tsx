'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Fades its content up the first time it scrolls into view.
export default function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    // gsap.from sets the hidden state in JS, so content stays visible without JS or before hydration
    gsap.from(ref.current, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      ease: 'expo.out',
      scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
    });
  });

  return <div ref={ref}>{children}</div>;
}
