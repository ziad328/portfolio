'use client';

import { useState, useEffect } from 'react';
import { SiteProfile } from '@/types/portfolio';
import { ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/Icons';

interface FooterProps {
  profile: SiteProfile;
}

const footerLink = 'flex items-center gap-1.5 transition-colors hover:text-fg';

export default function Footer({ profile }: FooterProps) {
  // Set after mount so the server-rendered year can't mismatch the client's
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border py-10 font-mono text-xs uppercase tracking-[0.12em] text-fg-muted">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p>
          © {currentYear} {profile.name}
        </p>

        <div className="flex items-center gap-6">
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={footerLink}>
              <GithubIcon className="h-4 w-4" />
            </a>
          )}
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={footerLink}>
              <LinkedinIcon className="h-4 w-4" />
            </a>
          )}
          {/* Anchor link so Lenis handles the smooth scroll */}
          <a href="#top" className={footerLink}>
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
