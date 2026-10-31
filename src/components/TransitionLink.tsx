'use client';

import type { AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { leavePage } from '@/lib/pageTransition';

interface TransitionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  // Fly the link's [data-flip-source] element onto the next page's [data-flip-target]
  flip?: boolean;
}

// A Link that fades the page out before navigating. New-tab clicks and reduced motion behave like a plain Link.
export default function TransitionLink({ href, flip, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();

  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
        e.preventDefault();
        const link = e.currentTarget;
        leavePage(href, router.push, link, flip ? link.querySelector('[data-flip-source]') : null);
      }}
    />
  );
}
