'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteProfile } from '@/types/portfolio';
import { ArrowUp, Shield } from 'lucide-react';

interface FooterProps {
  profile: SiteProfile;
}

export default function Footer({ profile }: FooterProps) {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-900 bg-black py-12 text-sm text-neutral-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand & copyright */}
          <div className="flex flex-col items-center gap-1 md:items-start">
            <span className="font-semibold text-neutral-300">{profile.name}</span>
            <p className="text-xs text-neutral-500">
              © {currentYear} {profile.name}. All rights reserved.
            </p>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <a href="#work" className="transition-colors hover:text-white">
              My Work
            </a>
            <a href="#about" className="transition-colors hover:text-white">
              About Me
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              How to Reach
            </a>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-amber-500 transition-colors hover:text-amber-400"
            >
              <Shield className="h-3 w-3" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white"
          >
            <span>Back to Top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
