import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { findProject, getProjects } from '@/lib/projects';
import ProjectDetailView from '@/components/ProjectDetailView';

// Projects are edited from /admin without a redeploy, so they're read per request, not cached.
// Cache Components needs that runtime work (params + Supabase) inside a Suspense boundary.
export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main data-theme="dark" className="min-h-screen flex-1">
      <Suspense>{params.then(({ id }) => <ProjectContent slugOrId={id} />)}</Suspense>
    </main>
  );
}

async function ProjectContent({ slugOrId }: { slugOrId: string }) {
  const project = findProject(await getProjects(), slugOrId);
  if (!project) notFound();
  return <ProjectDetailView project={project} />;
}
