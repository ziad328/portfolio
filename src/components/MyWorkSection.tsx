'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types/portfolio';
import { supabase } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/utils';
import { fallbackProjects } from '@/data/static-fallback';
import ProjectCard from './ProjectCard';

type Filter = 'all' | 'featured' | 'videos';

export default function MyWorkSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        setProjects(fallbackProjects);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (error || !data) {
        setProjects(fallbackProjects);
      } else {
        setProjects(
          data.map((r) => ({
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
          }))
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = projects.filter((p) => {
    if (filter === 'featured') return p.featured;
    if (filter === 'videos') return p.mediaType === 'youtube';
    return true;
  });

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'featured', label: 'Featured' },
    { key: 'videos', label: 'Video Demos' },
  ];

  return (
    <section id="work" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-100">My Work</h2>
          <p className="mt-2 text-neutral-500">Featured projects and open-source contributions</p>
        </div>

        {/* Filter tabs */}
        <div className="mb-8 flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              id={`filter-${tab.key}`}
              onClick={() => setFilter(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-xl bg-neutral-800" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-neutral-800 text-neutral-500">
            No projects found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
