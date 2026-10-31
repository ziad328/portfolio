import { SiteProfile } from '@/types/portfolio';
import { ArrowDown } from 'lucide-react';
import Button from '@/components/Button';
import TextReveal from '@/components/TextReveal';

interface HeroProps {
  profile: SiteProfile;
}

export default function Hero({ profile }: HeroProps) {
  return (
    <section id="top" className="flex min-h-svh flex-col justify-end pb-16 pt-32 sm:pb-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-fg-muted">
          Hi, I&apos;m {profile.name}
        </p>

        {/* Title is admin-editable and SplitText rebuilds the DOM, so remount on change */}
        <TextReveal key={profile.title}>
          <h1 className="mt-6 max-w-6xl text-[clamp(3rem,9vw,8.75rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em]">
            {profile.title}
          </h1>
        </TextReveal>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[500px] text-lg leading-relaxed text-fg-muted">
            {profile.bio.length > 180 ? `${profile.bio.substring(0, 180)}...` : profile.bio}
          </p>
          <Button href="#work" className="self-start sm:self-auto">
            <span>Explore My Work</span>
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
