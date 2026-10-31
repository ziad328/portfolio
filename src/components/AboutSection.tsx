import { SiteProfile } from '@/types/portfolio';
import AnimatedSection from './AnimatedSection';
import TextReveal from './TextReveal';
import ResumeViewer from './ResumeViewer';

interface AboutSectionProps {
  profile: SiteProfile;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[2fr_3fr] lg:gap-16 lg:px-8">
        <TextReveal>
          <h2 className="text-[clamp(3rem,8vw,7rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em]">
            About
          </h2>
        </TextReveal>

        <AnimatedSection>
          <p className="max-w-[55ch] whitespace-pre-line text-lg leading-[1.7]">{profile.bio}</p>
          <ResumeViewer resumeUrl={profile.resumeUrl} />
        </AnimatedSection>
      </div>
    </section>
  );
}
