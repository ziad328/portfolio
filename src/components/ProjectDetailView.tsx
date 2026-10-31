import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { projectMeta } from '@/lib/projects';
import Button from './Button';
import TagPill from './TagPill';
import TextReveal from './TextReveal';
import AnimatedSection from './AnimatedSection';
import MediaViewer from './MediaViewer';

export default function ProjectDetailView({ project }: { project: Project }) {
  const meta = projectMeta(project);

  return (
    <article className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <Link
        href="/#work"
        className="font-mono text-xs uppercase tracking-[0.12em] text-fg-muted transition-colors hover:text-fg"
      >
        ← All projects
      </Link>

      <header className="mt-12 grid gap-10 md:mt-20 md:grid-cols-[1.5fr_1fr] md:items-end md:gap-16">
        <div>
          {meta && <p className="mb-5 font-mono text-xs uppercase tracking-[0.12em] text-accent">{meta}</p>}
          <TextReveal key={project.title}>
            <h1 className="text-[clamp(2.75rem,8vw,7rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em]">
              {project.title}
            </h1>
          </TextReveal>
        </div>

        <AnimatedSection>
          {project.tagline && <p className="text-lg leading-relaxed text-fg-muted sm:text-xl">{project.tagline}</p>}
          {project.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <TagPill key={tag}>{tag}</TagPill>
              ))}
            </div>
          )}
          {(project.demoUrl || project.repoUrl) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.demoUrl && (
                <Button href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  Live demo ↗
                </Button>
              )}
              {project.repoUrl && (
                <Button href={project.repoUrl} variant="ghost" target="_blank" rel="noopener noreferrer">
                  Source code
                </Button>
              )}
            </div>
          )}
        </AnimatedSection>
      </header>

      <AnimatedSection>
        <div className="mt-14 overflow-hidden rounded-(--card-radius) md:mt-20">
          <MediaViewer
            mediaType={project.mediaType}
            mediaUrl={project.mediaUrl}
            youtubeUrl={project.youtubeUrl}
            title={project.title}
          />
        </div>
      </AnimatedSection>
    </article>
  );
}
