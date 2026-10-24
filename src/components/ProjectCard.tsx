import { Project } from '@/types/portfolio';
import MediaViewer from './MediaViewer';
import { ExternalLink, Star } from 'lucide-react';
import { GithubIcon } from '@/components/icons/Icons';

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ProjectCard({ project, isAdmin, onEdit, onDelete }: ProjectCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-colors hover:border-neutral-700">
      {/* Media */}
      <div className="relative">
        <MediaViewer
          mediaType={project.mediaType}
          mediaUrl={project.mediaUrl}
          youtubeUrl={project.youtubeUrl}
          title={project.title}
        />
        {project.featured && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-xs font-semibold text-white">
            <Star className="h-3 w-3 fill-white" />
            Featured
          </div>
        )}
        {project.mediaType === 'youtube' && (
          <div className="absolute left-2 top-2 rounded bg-red-600/80 px-1.5 py-0.5 text-xs text-white">
            Video Demo
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {project.role && (
          <span className="text-xs font-medium text-neutral-500">{project.role}</span>
        )}
        <div>
          <h3 className="text-base font-semibold text-neutral-100">{project.title}</h3>
          <p className="mt-0.5 text-sm text-neutral-400">{project.tagline}</p>
        </div>

        <p className="text-sm leading-relaxed text-neutral-500 line-clamp-3">{project.description}</p>

        {/* Contributions */}
        {project.contributions && project.contributions.length > 0 && (
          <ul className="space-y-1">
            {project.contributions.slice(0, 3).map((c, i) => (
              <li key={i} className="flex gap-2 text-xs text-neutral-400">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-600" />
                {c}
              </li>
            ))}
          </ul>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo for ${project.title}`}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Source code for ${project.title}`}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              Source Code
            </a>
          )}
          {isAdmin && (
            <>
              <button
                onClick={onEdit}
                className="ml-auto rounded-lg border border-blue-700/50 px-3 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:border-blue-500 hover:text-blue-300"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="rounded-lg border border-red-800/50 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:border-red-600 hover:text-red-400"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
