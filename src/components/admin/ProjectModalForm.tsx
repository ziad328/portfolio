'use client';

import { useState } from 'react';
import { Project, MediaType } from '@/types/portfolio';
import { supabase } from '@/lib/supabase/client';
import {
  isSupabaseConfigured,
  extractYouTubeId,
  getYouTubeThumbnailUrl,
  validateMediaFile,
  parseTags,
  tagsToString,
} from '@/lib/utils';
import { X, Image as ImageIcon, Sparkles, Upload, Loader2, AlertCircle } from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/Icons';

interface ProjectModalFormProps {
  project?: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (savedProject: Project) => void;
}

export default function ProjectModalForm({
  project,
  isOpen,
  onClose,
  onSave,
}: ProjectModalFormProps) {
  const isEditing = Boolean(project?.id);

  const [title, setTitle] = useState(project?.title || '');
  const [tagline, setTagline] = useState(project?.tagline || '');
  const [description, setDescription] = useState(project?.description || '');
  const [tagsInput, setTagsInput] = useState(tagsToString(project?.tags || []));
  const [role, setRole] = useState(project?.role || '');
  const [contributionsInput, setContributionsInput] = useState(
    (project?.contributions || []).join('\n')
  );
  const [mediaType, setMediaType] = useState<MediaType>(project?.mediaType || 'youtube');
  const [youtubeUrl, setYoutubeUrl] = useState(project?.youtubeUrl || '');
  const [mediaUrl, setMediaUrl] = useState(project?.mediaUrl || '');
  const [demoUrl, setDemoUrl] = useState(project?.demoUrl || '');
  const [repoUrl, setRepoUrl] = useState(project?.repoUrl || '');
  const [featured, setFeatured] = useState(project?.featured ?? false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const detectedYouTubeId = extractYouTubeId(youtubeUrl);
  const youtubeThumb = detectedYouTubeId ? getYouTubeThumbnailUrl(detectedYouTubeId) : null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateMediaFile(file, 'image');
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Invalid image file.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMsg('Supabase storage is not configured yet. Upload requires NEXT_PUBLIC_SUPABASE_URL.');
      return;
    }

    setUploadingImage(true);
    setErrorMsg(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `projects/project-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('portfolio-media')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(data.path);

      setMediaUrl(publicUrlData.publicUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload screenshot.';
      setErrorMsg(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const parsedTags = parseTags(tagsInput);
    const parsedContributions = contributionsInput
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const projectData: Project = {
      id: project?.id || `proj-${Date.now()}`,
      title,
      tagline,
      description,
      tags: parsedTags,
      mediaType,
      mediaUrl: mediaType === 'image' ? mediaUrl : undefined,
      youtubeUrl: mediaType === 'youtube' ? youtubeUrl : undefined,
      demoUrl: demoUrl.trim() || undefined,
      repoUrl: repoUrl.trim() || undefined,
      featured,
      role: role.trim() || undefined,
      contributions: parsedContributions,
      orderIndex: project?.orderIndex ?? 0,
      createdAt: project?.createdAt || new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured()) {
        const dbPayload = {
          title: projectData.title,
          tagline: projectData.tagline,
          description: projectData.description,
          tags: projectData.tags,
          media_type: projectData.mediaType,
          media_url: projectData.mediaUrl || null,
          youtube_url: projectData.youtubeUrl || null,
          demo_url: projectData.demoUrl || null,
          repo_url: projectData.repoUrl || null,
          featured: projectData.featured,
          role: projectData.role || null,
          contributions: projectData.contributions,
          order_index: projectData.orderIndex,
        };

        if (isEditing && project?.id) {
          const { error } = await supabase
            .from('projects')
            .update(dbPayload)
            .eq('id', project.id);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from('projects')
            .insert([dbPayload])
            .select()
            .single();
          if (error) throw error;
          if (data?.id) projectData.id = data.id;
        }
      }

      onSave(projectData);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save project.';
      setErrorMsg(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-xl font-bold text-white">
              {isEditing ? `Edit Project: ${project?.title}` : 'Add New Project'}
            </h3>
            <p className="text-xs text-neutral-400">
              Showcase with unlisted YouTube demo videos, screenshots, or code repos
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI Agent Platform"
                className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300">Tagline *</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Real-time multi-agent conversational AI"
                className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300">Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does the project do, who is it for, and what technical challenges did it solve?"
              className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300">
                Tech Stack Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Next.js, TypeScript, Tailwind, Supabase"
                className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300">Your Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Lead Developer / Solo Architect"
                className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300">
              Key Contributions (one per line)
            </label>
            <textarea
              rows={2}
              value={contributionsInput}
              onChange={(e) => setContributionsInput(e.target.value)}
              placeholder="Architected streaming pipeline&#10;Integrated Stripe payment system"
              className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Media Selection Radio */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 space-y-3">
            <span className="block text-xs font-semibold text-neutral-300">Project Showcase Media</span>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-neutral-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  value="youtube"
                  checked={mediaType === 'youtube'}
                  onChange={() => setMediaType('youtube')}
                  className="accent-amber-500"
                />
                <YoutubeIcon className="h-4 w-4 text-red-500" />
                <span>Unlisted YouTube Video</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  value="image"
                  checked={mediaType === 'image'}
                  onChange={() => setMediaType('image')}
                  className="accent-amber-500"
                />
                <ImageIcon className="h-4 w-4 text-blue-400" />
                <span>Screenshot Image</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  value="none"
                  checked={mediaType === 'none'}
                  onChange={() => setMediaType('none')}
                  className="accent-amber-500"
                />
                <Sparkles className="h-4 w-4 text-neutral-400" />
                <span>None (Gradient Card)</span>
              </label>
            </div>

            {/* YouTube Inputs */}
            {mediaType === 'youtube' && (
              <div className="mt-3 space-y-2">
                <label className="block text-xs text-neutral-400">
                  YouTube Video URL (Unlisted / Public)
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=..."
                  className="block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                {youtubeThumb && (
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={youtubeThumb}
                      alt="Thumbnail preview"
                      className="h-12 w-20 object-cover rounded"
                    />
                    <div className="text-xs text-neutral-300">
                      <p className="font-semibold text-emerald-400">Valid YouTube ID Detected</p>
                      <p className="text-neutral-500 truncate max-w-xs">{detectedYouTubeId}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Image Screenshot Inputs */}
            {mediaType === 'image' && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-700">
                    {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    <span>{uploadingImage ? 'Uploading Screenshot...' : 'Upload Image (Max 5MB)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-neutral-500">or enter image URL directly:</span>
                </div>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/screenshot.png"
                  className="block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300">Live Demo URL</label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://myproject.com"
                className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300">GitHub Repository URL</label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 accent-amber-500"
            />
            <label htmlFor="featured-checkbox" className="text-xs font-medium text-neutral-300">
              Feature this project prominently on the homepage
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-neutral-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              <span>{saving ? 'Saving Project...' : isEditing ? 'Save Changes' : 'Publish Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
