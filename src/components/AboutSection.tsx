'use client';

import { SiteProfile } from '@/types/portfolio';
import AnimatedSection from './AnimatedSection';
import ResumeViewer from './ResumeViewer';
import { UserCheck, Award, Code2 } from 'lucide-react';

interface AboutSectionProps {
  profile: SiteProfile;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 border-t border-neutral-800/60 bg-neutral-900/40">
      <AnimatedSection>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-100">About Me</h2>
          <p className="mt-2 text-neutral-400">
            Background, engineering philosophy, and curriculum vitae
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Narrative / Bio Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800 text-neutral-200">
                  <UserCheck className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-100">{profile.name}</h3>
                  <p className="text-sm text-neutral-400">{profile.title}</p>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-neutral-300 leading-relaxed space-y-4">
                <p className="text-base text-neutral-300 whitespace-pre-line">
                  {profile.bio}
                </p>
              </div>

              {/* Highlights */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4">
                  <div className="flex items-center gap-2 text-neutral-200 font-semibold text-sm">
                    <Code2 className="h-4 w-4 text-blue-400" />
                    Full-Stack Craftsmanship
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    High-performance modern web apps built with Next.js, TypeScript, and cloud-native databases.
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4">
                  <div className="flex items-center gap-2 text-neutral-200 font-semibold text-sm">
                    <Award className="h-4 w-4 text-amber-400" />
                    Production Reliability
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    Test-driven quality, clean architecture, responsive layouts, and accessible interfaces.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CV / Resume Viewer Column */}
          <div className="lg:col-span-5">
            <ResumeViewer resumeUrl={profile.resumeUrl} />
          </div>
        </div>
      </div>
      </AnimatedSection>
    </section>
  );
}
