'use client';

import { useState } from 'react';
import { SiteProfile } from '@/types/portfolio';
import { Mail, Phone, MapPin, Copy, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/Icons';

interface ContactSectionProps {
  profile: SiteProfile;
}

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
    <section id="contact" className="py-20 border-t border-neutral-800/60 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-100">How to Reach Me</h2>
          <p className="mt-2 text-neutral-400">
            Direct communication channels for collaborations, inquiries, or freelance opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Email Card */}
          {profile.email && (
            <div className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400">Email</h3>
                  <a
                    href={`mailto:${profile.email}`}
                    aria-label={`Email ${profile.email}`}
                    className="text-sm font-semibold text-neutral-100 hover:underline break-all"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800">
                <button
                  onClick={handleCopyEmail}
                  aria-label="Copy email"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/60 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Phone / WhatsApp Card */}
          {profile.phone && (
            <div className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400">Phone / WhatsApp</h3>
                  <a
                    href={`tel:${profile.phone}`}
                    aria-label={`Call ${profile.phone}`}
                    className="text-sm font-semibold text-neutral-100 hover:underline"
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800 text-xs text-neutral-500">
                Direct phone & messaging
              </div>
            </div>
          )}

          {/* GitHub Card */}
          {profile.githubUrl && (
            <div className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                  <GithubIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400">GitHub</h3>
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit GitHub Profile"
                    className="text-sm font-semibold text-neutral-100 hover:underline"
                  >
                    View Repositories
                  </a>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800 text-xs text-neutral-500">
                Code & open source activity
              </div>
            </div>
          )}

          {/* LinkedIn Card */}
          {profile.linkedinUrl && (
            <div className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                  <LinkedinIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400">LinkedIn</h3>
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit LinkedIn Profile"
                    className="text-sm font-semibold text-neutral-100 hover:underline"
                  >
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800 text-xs text-neutral-500">
                Professional network & endorsements
              </div>
            </div>
          )}
        </div>

        {/* Location / Status Banner */}
        {profile.location && (
          <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-neutral-800/80 bg-neutral-900/60 py-3 px-4 text-sm text-neutral-400">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <span className="font-medium text-neutral-200">{profile.location}</span>
          </div>
        )}
      </div>
    </section>
  );
}
