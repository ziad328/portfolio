'use client';

import { useState } from 'react';
import { SiteProfile } from '@/types/portfolio';
import { ArrowRight, Copy, Check, Phone } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/Icons';
import Button from './Button';
import TextReveal from './TextReveal';

interface ContactSectionProps {
  profile: SiteProfile;
}

const rowLink = 'flex items-center gap-2 text-fg-muted transition-colors hover:text-fg';

export default function ContactSection({ profile }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    if (!profile.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is unavailable
    }
  };

  return (
    <section id="contact" className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {profile.location && (
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-fg-muted">{profile.location}</p>
        )}

        <TextReveal>
          <h2 className="mt-6 max-w-5xl text-[clamp(3rem,10vw,7.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em]">
            Let&apos;s work together
          </h2>
        </TextReveal>

        <p className="mt-8 max-w-[500px] text-lg leading-relaxed text-fg-muted">
          I&apos;m available for freelance work and collaborations.
        </p>

        {profile.email && (
          <Button href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`} className="mt-10">
            Get In Touch
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}

        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border pt-8 text-sm">
          {profile.email && (
            <div className="flex items-center gap-3">
              <span className="text-fg">{profile.email}</span>
              <button
                onClick={handleCopyEmail}
                aria-label="Copy email"
                className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-fg-muted transition-colors hover:text-fg"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone}`} aria-label={`Call ${profile.phone}`} className={rowLink}>
              <Phone className="h-4 w-4" />
              {profile.phone}
            </a>
          )}
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit GitHub Profile" className={rowLink}>
              <GithubIcon className="h-5 w-5" />
            </a>
          )}
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn Profile" className={rowLink}>
              <LinkedinIcon className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
