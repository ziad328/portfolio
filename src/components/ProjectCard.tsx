import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '@/lib/utils';
import TagPill from './TagPill';

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Cards show a still preview; the YouTube player lives on the detail page.
function thumbnailUrl(project: Project) {
  if (project.mediaType === 'image') return project.mediaUrl;
  if (project.mediaType === 'youtube') {
    const videoId = extractYouTubeId(project.youtubeUrl);
    return videoId ? getYouTubeThumbnailUrl(videoId) : undefined;
  }
}

export default function ProjectCard({ project, isAdmin, onEdit, onDelete }: ProjectCardProps) {
  const thumbnail = thumbnailUrl(project);
  const initials = project.title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const year = project.year || (project.createdAt ? new Date(project.createdAt).getUTCFullYear() : undefined);
  const meta = [project.role, year].filter(Boolean).join(' · ');

  return (
    <article>
      <Link
        href={`/projects/${project.id}`}
        className="group block rounded-(--card-radius) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div data-cursor="view" className="card-image-wrap relative aspect-16/10 bg-surface">
          {/* Shown when there's no media, or when the image fails and hides itself */}
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-display text-5xl font-semibold text-fg-muted">
            {initials}
          </div>
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt=""
              className="relative"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          )}

          {project.tags.length > 0 && (
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-end gap-2 bg-linear-to-t from-black/70 to-transparent p-4 pt-12">
              {project.tags.slice(0, 3).map((tag) => (
                <TagPill key={tag}>{tag}</TagPill>
              ))}
            </div>
          )}

          {/* The custom cursor already says VIEW; this pill covers keyboard focus and devices without it */}
          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-1/2 rounded-full bg-accent px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [.cursor-custom_&]:hidden">
            View ↗
          </span>
        </div>

        <h3 className="mt-5 font-display text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
          {project.title}
        </h3>
        {meta && (
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-fg-muted">{meta}</p>
        )}
      </Link>

      {isAdmin && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={onEdit}
            className="rounded-lg border border-blue-700/50 px-3 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:border-blue-500 hover:text-blue-300"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg border border-red-800/50 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:border-red-600 hover:text-red-400"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
