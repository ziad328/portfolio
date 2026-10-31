import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { projectHref, projectMeta, thumbnailUrl } from '@/lib/projects';
import Button from './Button';
import TagPill from './TagPill';
import TextReveal from './TextReveal';
import AnimatedSection from './AnimatedSection';
import MediaViewer from './MediaViewer';

// Screenshots alternate between a full-width row and a two-column row
export function showcaseRows(screenshots: string[]) {
  const rows: string[][] = [];
  for (let i = 0; i < screenshots.length; ) {
    const size = rows.length % 2 === 0 ? 1 : 2;
    rows.push(screenshots.slice(i, i + size));
    i += size;
  }
  return rows;
}

const subheading = 'font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold uppercase tracking-tight';

export default function ProjectDetailView({ project, next }: { project: Project; next?: Project }) {
  const meta = projectMeta(project);
  const highlights = project.highlights ?? [];
  const rows = showcaseRows(project.screenshots ?? []);

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
        <div className="mt-14 overflow-hidden rounded-(--card-radius-lg) md:mt-20">
          <MediaViewer
            mediaType={project.mediaType}
            mediaUrl={project.mediaUrl}
            youtubeUrl={project.youtubeUrl}
            title={project.title}
          />
        </div>
      </AnimatedSection>

      {highlights.length > 0 && (
        <AnimatedSection>
          <dl className="mt-16 grid grid-cols-1 border-y border-border sm:grid-cols-3 md:mt-24">
            {highlights.map((h, i) => (
              // Label first for screen readers, value shown on top
              <div key={i} className="flex flex-col-reverse gap-3 border-border py-8 sm:px-8 sm:first:pl-0 sm:not-first:border-l max-sm:not-first:border-t">
                <dt className="font-mono text-xs uppercase tracking-[0.12em] text-fg-muted">{h.label}</dt>
                <dd className="font-display text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-none tracking-tight">
                  {h.value}
                </dd>
              </div>
            ))}
          </dl>
        </AnimatedSection>
      )}

      {(project.description || project.contributions.length > 0) && (
        <div className="mt-16 max-w-[65ch] space-y-14 md:mt-24">
          {project.description && (
            <AnimatedSection>
              <h2 className={subheading}>Overview</h2>
              <p className="mt-5 whitespace-pre-line text-lg leading-[1.7] text-fg-muted">{project.description}</p>
            </AnimatedSection>
          )}
          {project.contributions.length > 0 && (
            <AnimatedSection>
              <h2 className={subheading}>What I built</h2>
              <ul className="mt-5 space-y-3 text-lg leading-[1.7] text-fg-muted">
                {project.contributions.map((c, i) => (
                  <li key={i} className="flex gap-4">
                    <span aria-hidden="true" className="text-accent">→</span>
                    {c}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          )}
        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-16 flex flex-col gap-4 md:mt-24 md:gap-6">
          {rows.map((row, r) => (
            <AnimatedSection key={r}>
              <div className={`grid gap-4 md:gap-6 ${row.length === 2 ? 'md:grid-cols-[3fr_2fr]' : ''}`}>
                {row.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src + i}
                    src={src}
                    alt={`${project.title} screenshot`}
                    loading="lazy"
                    className={`w-full rounded-(--card-radius-lg) bg-surface object-cover ${row.length === 2 ? 'aspect-4/3 h-full' : 'aspect-video'}`}
                  />
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>
      )}

      {next && <NextCase project={next} />}
    </article>
  );
}

function NextCase({ project }: { project: Project }) {
  const image = thumbnailUrl(project);
  const meta = projectMeta(project);

  return (
    <section className="group relative isolate mt-24 overflow-hidden rounded-(--card-radius-lg) border border-border bg-surface px-6 py-12 sm:px-12 sm:py-16 md:mt-32">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20 transition-[opacity,transform] duration-700 ease-(--ease-out-expo) group-hover:scale-105 group-hover:opacity-30"
        />
      )}

      <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.12em]">
        <span className="text-fg-muted">Next case</span>
        {/* z-10 keeps it clickable above the title link, whose ::after covers the whole card */}
        <Link href="/#work" className="relative z-10 text-fg-muted transition-colors hover:text-fg">
          ← All projects
        </Link>
      </div>

      <Link
        href={projectHref(project)}
        data-cursor="view"
        className="mt-10 block font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em] after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:mt-16"
      >
        {project.title}{' '}
        <span aria-hidden="true" className="inline-block text-accent transition-transform duration-500 group-hover:translate-x-3">
          →
        </span>
      </Link>

      {project.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <TagPill key={tag}>{tag}</TagPill>
          ))}
        </div>
      )}
      {meta && <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-fg-muted">{meta}</p>}
    </section>
  );
}
