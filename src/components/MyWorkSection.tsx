'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types/portfolio';
import { supabase } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/utils';
import { fallbackProjects } from '@/data/static-fallback';
import ProjectCard from './ProjectCard';
import TextReveal from './TextReveal';
import { rowToProject } from '@/lib/projects';
import MarqueeTicker from './MarqueeTicker';
import AnimatedSection from './AnimatedSection';

export default function MyWorkSection() {
  const [projects, setProjects] = useState<Project[]>([]);
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
        setProjects(data.map(rowToProject));
      }
      setLoading(false);
    }
    load();
  }, []);

  // Editorial layout: pairs of cards whose large/small columns swap every row
  const rows: Project[][] = [];
  for (let i = 0; i < projects.length; i += 2) rows.push(projects.slice(i, i + 2));
  const rowColumns = (row: Project[], index: number) =>
    row.length === 1 ? '' : index % 2 === 0 ? 'md:grid-cols-[1.8fr_1fr]' : 'md:grid-cols-[1fr_1.8fr]';

  return (
    <section id="work" data-theme="dark" className="pb-24 pt-20 sm:pb-32">
      <MarqueeTicker items={projects.flatMap((p) => p.tags)} />
      <div className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6 lg:px-8">
        <TextReveal>
          <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em]">
            Selected Work
          </h2>
        </TextReveal>

        {/* Nothing while loading; the cards fade in on their own once they arrive */}
        {!loading && projects.length === 0 ? (
          <p className="mt-12 font-mono text-xs uppercase tracking-[0.12em] text-fg-muted">
            No projects yet.
          </p>
        ) : (
          <div className="mt-12 flex flex-col gap-10 sm:mt-16 md:gap-14">
            {rows.map((row, index) => (
              <div key={row[0].id} className={`grid grid-cols-1 gap-10 md:gap-8 ${rowColumns(row, index)}`}>
                {row.map((project) => (
                  <AnimatedSection key={project.id}>
                    <ProjectCard project={project} />
                  </AnimatedSection>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
