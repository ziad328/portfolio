'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Project, SiteProfile } from '@/types/portfolio';
import { supabase } from '@/lib/supabase/client';
import { getSession, signOut } from '@/lib/supabase/auth-helper';
import { isSupabaseConfigured } from '@/lib/utils';
import { rowToProject } from '@/lib/projects';
import { fallbackProfile, fallbackProjects } from '@/data/static-fallback';
import ProfileEditorCard from '@/components/admin/ProfileEditorCard';
import ContactEditorCard from '@/components/admin/ContactEditorCard';
import ProjectModalForm from '@/components/admin/ProjectModalForm';
import ProjectCard from '@/components/ProjectCard';
import {
  Shield,
  ExternalLink,
  LogOut,
  Plus,
  Loader2,
  Sparkles,
  Info,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<SiteProfile>(fallbackProfile);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [filter, setFilter] = useState<'all' | 'featured' | 'videos'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    async function init() {
      if (isSupabaseConfigured()) {
        const session = await getSession();
        if (!session) {
          router.push('/admin/login');
          return;
        }

        // Fetch site_profile
        const { data: profileData } = await supabase
          .from('site_profile')
          .select('*')
          .limit(1)
          .single();

        if (profileData) {
          setProfile({
            id: profileData.id,
            name: profileData.name || fallbackProfile.name,
            title: profileData.title || fallbackProfile.title,
            bio: profileData.bio || fallbackProfile.bio,
            resumeUrl: profileData.resume_url || fallbackProfile.resumeUrl,
            resumeUpdatedAt: profileData.resume_updated_at,
            email: profileData.email || fallbackProfile.email,
            phone: profileData.phone || fallbackProfile.phone,
            githubUrl: profileData.github_url || fallbackProfile.githubUrl,
            linkedinUrl: profileData.linkedin_url || fallbackProfile.linkedinUrl,
            location: profileData.location || fallbackProfile.location,
            updatedAt: profileData.updated_at,
          });
        }

        // Fetch projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .order('order_index', { ascending: true });

        if (projectsData && projectsData.length > 0) {
          setProjects(projectsData.map(rowToProject));
        }
      }
      setLoading(false);
    }

    init();
  }, [router]);

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      await signOut();
    }
    router.push('/admin/login');
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    if (isSupabaseConfigured()) {
      await supabase.from('projects').delete().eq('id', projectId);
    }
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleSaveProject = (saved: Project) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      if (exists) {
        return prev.map((p) => (p.id === saved.id ? saved : p));
      }
      return [saved, ...prev];
    });
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === 'featured') return p.featured;
    if (filter === 'videos') return p.mediaType === 'youtube';
    return true;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-sm text-neutral-400">Loading admin workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-theme="dark" className="min-h-screen bg-black text-neutral-100">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Portfolio Admin Dashboard</h1>
              <p className="text-[11px] text-neutral-500">
                100% editable content: About Me, CV, How to Reach & Projects
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Live Site</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-xl border border-red-900/60 bg-red-950/30 px-3.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-950/60 hover:text-red-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {!isSupabaseConfigured() && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-800/60 bg-amber-950/30 p-4 text-xs text-amber-300">
            <Info className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Local Fallback Mode Active</p>
              <p className="text-neutral-400">
                Supabase environment variables are not set in <code>.env.local</code> yet. You can test form fields locally. Once you connect your Supabase database and run <code>supabase_schema.sql</code>, all updates will sync automatically to the cloud!
              </p>
            </div>
          </div>
        )}

        {/* Section 1: About Me & CV */}
        <section>
          <ProfileEditorCard
            initialProfile={profile}
            onProfileUpdated={(updated) => setProfile(updated)}
          />
        </section>

        {/* Section 2: How to Reach */}
        <section>
          <ContactEditorCard
            initialProfile={profile}
            onProfileUpdated={(updated) => setProfile(updated)}
          />
        </section>

        {/* Section 3: My Work (Projects) */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <h2 className="text-lg font-bold text-white">My Work (Projects Showcase)</h2>
              <p className="text-xs text-neutral-400">
                Add unlisted YouTube video demos, screenshots, tags, and contributions
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-semibold text-neutral-950 transition-colors hover:bg-amber-400"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Project</span>
            </button>
          </div>

          {/* Filter tabs */}
          <div className="mt-6 flex gap-2">
            {[
              { key: 'all', label: 'All Projects' },
              { key: 'featured', label: 'Featured' },
              { key: 'videos', label: 'YouTube Demos' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-neutral-700 text-white'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="mt-6">
            {filteredProjects.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-neutral-800 text-center text-xs text-neutral-500">
                <p>No projects match this filter.</p>
                <button
                  onClick={handleOpenAddModal}
                  className="mt-2 text-amber-400 hover:underline"
                >
                  Create your first project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((proj) => (
                  <ProjectCard
                    key={proj.id}
                    project={proj}
                    isAdmin={true}
                    onEdit={() => handleOpenEditModal(proj)}
                    onDelete={() => handleDeleteProject(proj.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Future Roadmap Card: Visual Live-Editor CMS Idea */}
        <section className="rounded-2xl border border-neutral-800/80 bg-neutral-950/60 p-6 text-xs text-neutral-400 space-y-2">
          <div className="flex items-center gap-2 text-neutral-200 font-semibold text-sm">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Future Feature Blueprint: Visual Live-Editor Mode (Phase 3)</span>
          </div>
          <p>
            Your idea has been recorded in the architecture specification: in Phase 3, this dashboard can be upgraded into an in-place visual live editor where you can hover over any section on the live site to reveal inline edit handles, edit text directly on-screen, and drag-and-drop to reorder sections.
          </p>
        </section>
      </main>

      {/* Project Add/Edit Modal */}
      <ProjectModalForm
        isOpen={isModalOpen}
        project={editingProject}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
}
