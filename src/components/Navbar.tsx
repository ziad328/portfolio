'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Menu, X, Shield } from 'lucide-react';

interface NavbarProps {
  name?: string;
}

const navLinks = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({ name = 'Portfolio' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from(ref.current, { y: -40, opacity: 0, duration: 0.8, ease: 'expo.out' });
  });

  // Match the theme of whatever section is under the navbar, so it flips light <-> dark while scrolling
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = ref.current;
      if (!header) return;
      const { top, bottom } = header.getBoundingClientRect();
      const under = document
        .elementsFromPoint(window.innerWidth / 2, (top + bottom) / 2)
        .find((el) => !header.contains(el));
      setTheme(under?.closest('[data-theme="dark"]') ? 'dark' : 'light');
      setScrolled(window.scrollY > 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      ref={ref}
      data-theme={theme}
      data-scrolled={scrolled}
      className={`fixed inset-x-4 top-4 z-50 mx-auto max-w-5xl border border-border bg-bg/75 text-fg backdrop-blur-md transition-[background-color,color,border-color,box-shadow] duration-300 data-[scrolled=true]:shadow-lg ${
        mobileMenuOpen ? 'rounded-3xl' : 'rounded-full'
      }`}
    >
      <div className="flex h-14 items-center justify-between gap-4 pl-5 pr-2">
        {/* Brand */}
        <Link href="/" className="font-display text-sm font-bold uppercase tracking-tight">
          <span className="font-mono font-normal text-fg-muted">{'// '}</span>
          {name}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/admin"
            aria-label="Admin portal"
            className="hidden rounded-full p-2.5 text-fg-muted transition-colors hover:bg-surface hover:text-fg md:inline-flex"
          >
            <Shield className="h-4 w-4" />
          </Link>
          <a
            href="#contact"
            className="hidden rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-hover md:inline-flex"
          >
            Get In Touch
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="rounded-full p-2.5 text-fg transition-colors hover:bg-surface md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav id="mobile-menu" className="flex flex-col gap-1 border-t border-border px-3 pb-4 pt-3 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-base font-medium transition-colors hover:bg-surface"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg"
          >
            <Shield className="h-4 w-4" />
            Admin Dashboard
          </Link>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 flex justify-center rounded-full bg-accent px-5 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-accent-hover"
          >
            Get In Touch
          </a>
        </nav>
      )}
    </header>
  );
}
