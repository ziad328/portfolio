'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Reveals the headings inside it line by line, each line sliding up out of a mask.
// SplitText rebuilds the DOM, so React can't update the text afterwards:
// give it a `key` from any dynamic text (e.g. key={profile.name}) so it remounts on change.
export default function TextReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    SplitText.create(el.children, {
      type: 'lines',
      mask: 'lines',
      // Re-split when fonts load or the width changes, since line breaks move
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        }),
    });
  });

  return <div ref={ref}>{children}</div>;
}
