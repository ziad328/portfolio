import { SiteProfile } from '@/types/portfolio';
import { ArrowDown, Mail, FileText } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/Icons';

interface HeroProps {
  profile: SiteProfile;
}

export default function Hero({ profile }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden py-24 sm:py-32">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-linear-to-tr from-blue-600/10 via-emerald-500/10 to-purple-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Availability badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Available for new opportunities & collaborations
          </div>

          {/* Headline & Title */}
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-fg sm:text-6xl">
            Hi, I&apos;m <span className="text-accent">{profile.name}</span>
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-semibold text-fg-muted">
            {profile.title}
          </p>

          <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-fg-muted">
            {profile.bio.length > 180 ? `${profile.bio.substring(0, 180)}...` : profile.bio}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#work"
              className="flex items-center gap-2 rounded-xl bg-fg px-5 py-3 text-sm font-semibold text-bg transition-opacity hover:opacity-80"
            >
              <span>Explore My Work</span>
              <ArrowDown className="h-4 w-4" />
            </a>

            <a
              href="#about"
              className="flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-fg-muted hover:text-fg"
            >
              <FileText className="h-4 w-4 text-fg-muted" />
              <span>View CV / Resume</span>
            </a>

            <a
              href="#contact"
              className="flex items-center gap-2 rounded-xl border border-transparent px-5 py-3 text-sm font-semibold text-fg-muted transition-colors hover:text-fg"
            >
              <Mail className="h-4 w-4" />
              <span>Get In Touch</span>
            </a>
          </div>

          {/* Quick Social Handles */}
          <div className="mt-12 flex items-center gap-5 text-fg-muted">
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="transition-colors hover:text-fg"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="transition-colors hover:text-fg"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                aria-label="Send Email"
                className="transition-colors hover:text-fg"
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
