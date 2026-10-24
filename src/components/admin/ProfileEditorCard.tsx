'use client';

import { useState } from 'react';
import { SiteProfile } from '@/types/portfolio';
import { supabase } from '@/lib/supabase/client';
import { isSupabaseConfigured, validateMediaFile } from '@/lib/utils';
import { FileText, Upload, Save, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

interface ProfileEditorCardProps {
  initialProfile: SiteProfile;
  onProfileUpdated?: (updated: SiteProfile) => void;
}

export default function ProfileEditorCard({ initialProfile, onProfileUpdated }: ProfileEditorCardProps) {
  const [profile, setProfile] = useState<SiteProfile>(initialProfile);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateMediaFile(file, 'pdf');
    if (!validation.valid) {
      setStatusMessage({ type: 'error', text: validation.error || 'Invalid PDF file.' });
      return;
    }

    if (!isSupabaseConfigured()) {
      setStatusMessage({
        type: 'error',
        text: 'Supabase storage is not configured yet. Set NEXT_PUBLIC_SUPABASE_URL in .env.local to enable uploads.',
      });
      return;
    }

    setUploadingPdf(true);
    setStatusMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `resumes/resume-${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(data.path);

      setProfile((prev) => ({
        ...prev,
        resumeUrl: publicUrlData.publicUrl,
        resumeUpdatedAt: new Date().toISOString(),
      }));

      setStatusMessage({ type: 'success', text: 'Resume PDF uploaded successfully! Remember to click "Save About Me & CV".' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload PDF.';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      if (isSupabaseConfigured()) {
        const payload = {
          name: profile.name,
          title: profile.title,
          bio: profile.bio,
          resume_url: profile.resumeUrl,
          resume_updated_at: profile.resumeUpdatedAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('site_profile')
          .upsert(payload, { onConflict: 'id' });

        if (error) throw error;
      }

      onProfileUpdated?.(profile);
      setStatusMessage({ type: 'success', text: 'About Me & CV changes saved successfully!' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save changes.';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 pb-6 border-b border-neutral-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-neutral-300">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">About Me & CV Editor</h2>
          <p className="text-xs text-neutral-400">
            Control your name, headline, professional bio, and active resume
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs ${
            statusMessage.type === 'success'
              ? 'border border-emerald-800/60 bg-emerald-950/40 text-emerald-300'
              : 'border border-red-800/60 bg-red-950/40 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300">Full Name</label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300">Professional Title</label>
            <input
              type="text"
              required
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300">Bio Narrative</label>
          <textarea
            rows={4}
            required
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Tell your story, specialties, and developer journey..."
            className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
          />
        </div>

        {/* CV Management */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-neutral-300">Active Resume / CV</span>
              <p className="text-xs text-neutral-500 truncate max-w-md">{profile.resumeUrl}</p>
            </div>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Preview Current CV</span>
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-850">
            {/* Upload PDF */}
            <div>
              <label className="block text-xs font-medium text-neutral-400">
                Upload New PDF Resume (Max 10MB)
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-700">
                  {uploadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  <span>{uploadingPdf ? 'Uploading...' : 'Choose PDF File'}</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    disabled={uploadingPdf}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* External URL alternative */}
            <div>
              <label className="block text-xs font-medium text-neutral-400">
                Or Paste External CV URL
              </label>
              <input
                type="text"
                value={profile.resumeUrl}
                onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                placeholder="https://drive.google.com/... or /resume.pdf"
                className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{saving ? 'Saving...' : 'Save About Me & CV'}</span>
        </button>
      </form>
    </div>
  );
}
