import { MediaType, Project, ProjectHighlight } from '@/types/portfolio';
import { supabase } from '@/lib/supabase/client';
import { extractYouTubeId, getYouTubeThumbnailUrl, isSupabaseConfigured } from '@/lib/utils';
import { fallbackProjects } from '@/data/static-fallback';

// A row of the Supabase `projects` table (see supabase_schema.sql)
export interface ProjectRow {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[] | null;
  media_type: MediaType;
  media_url: string | null;
  youtube_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  featured: boolean;
  role: string | null;
  contributions: string[] | null;
  order_index: number;
  created_at: string;
  // Phase 2 columns; undefined until the migration in supabase_schema.sql has been run
  slug?: string | null;
  year?: string | null;
  highlights?: ProjectHighlight[] | null;
  screenshots?: string[] | null;
}

export function rowToProject(r: ProjectRow): Project {
  return {
    id: r.id,
    title: r.title,
    tagline: r.tagline,
    description: r.description,
    tags: r.tags ?? [],
    mediaType: r.media_type,
    mediaUrl: r.media_url ?? undefined,
    youtubeUrl: r.youtube_url ?? undefined,
    demoUrl: r.demo_url ?? undefined,
    repoUrl: r.repo_url ?? undefined,
    featured: r.featured,
    role: r.role ?? undefined,
    contributions: r.contributions ?? [],
    orderIndex: r.order_index,
    createdAt: r.created_at,
    slug: r.slug ?? undefined,
    year: r.year ?? undefined,
    highlights: r.highlights ?? [],
    screenshots: r.screenshots ?? [],
  };
}

// Columns written by the admin form (id and created_at are set by the database)
export function projectToRow(p: Project) {
  return {
    title: p.title,
    tagline: p.tagline,
    description: p.description,
    tags: p.tags,
    media_type: p.mediaType,
    media_url: p.mediaUrl || null,
    youtube_url: p.youtubeUrl || null,
    demo_url: p.demoUrl || null,
    repo_url: p.repoUrl || null,
    featured: p.featured,
    role: p.role || null,
    contributions: p.contributions,
    order_index: p.orderIndex,
    slug: p.slug || null,
    year: p.year || null,
    highlights: p.highlights ?? [],
    screenshots: p.screenshots ?? [],
  };
}

// All projects in display order: Supabase when configured, otherwise (or on error) the fallback data
export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return fallbackProjects;
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true });
  return error || !data ? fallbackProjects : data.map(rowToProject);
}

// Detail URLs use the slug when there is one, else the id
export function projectHref(project: Project) {
  return `/projects/${project.slug ?? project.id}`;
}

export function findProject(projects: Project[], slugOrId: string) {
  return projects.find((p) => p.slug === slugOrId || p.id === slugOrId);
}

// "ROLE · YEAR"; the year falls back to createdAt for projects saved before the year field
export function projectMeta(project: Project) {
  const year = project.year || (project.createdAt ? new Date(project.createdAt).getUTCFullYear() : undefined);
  return [project.role, year].filter(Boolean).join(' · ');
}

// The project after this one, wrapping from last to first; none when it's the only project
export function nextProject(projects: Project[], current: Project) {
  if (projects.length < 2) return undefined;
  const index = projects.findIndex((p) => p.id === current.id);
  return projects[(index + 1) % projects.length];
}

// A still preview: the screenshot, or the YouTube thumbnail
export function thumbnailUrl(project: Project) {
  if (project.mediaType === 'image') return project.mediaUrl || undefined;
  if (project.mediaType === 'youtube') {
    const videoId = extractYouTubeId(project.youtubeUrl);
    return videoId ? getYouTubeThumbnailUrl(videoId) : undefined;
  }
}
