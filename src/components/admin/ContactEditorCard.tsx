'use client';

import { useState } from 'react';
import { SiteProfile } from '@/types/portfolio';
import { supabase } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/utils';
import { Mail, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ContactEditorCardProps {
  initialProfile: SiteProfile;
  onProfileUpdated?: (updated: SiteProfile) => void;
}

export default function ContactEditorCard({ initialProfile, onProfileUpdated }: ContactEditorCardProps) {
  const [profile, setProfile] = useState<SiteProfile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      if (isSupabaseConfigured()) {
        const payload = {
          email: profile.email,
          phone: profile.phone,
          github_url: profile.githubUrl,
          linkedin_url: profile.linkedinUrl,
          location: profile.location,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('site_profile')
          .upsert(payload, { onConflict: 'id' });

        if (error) throw error;
      }

      onProfileUpdated?.(profile);
      setStatusMessage({ type: 'success', text: 'How to Reach contact info saved successfully!' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save contact info.';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 pb-6 border-b border-neutral-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-neutral-300">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">How to Reach (Contact Info) Editor</h2>
          <p className="text-xs text-neutral-400">
            Control email, phone, GitHub profile, LinkedIn profile, and location status
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

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300">Email Address</label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="developer@example.com"
              className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300">Phone / WhatsApp</label>
            <input
              type="text"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300">GitHub Profile URL</label>
            <input
              type="url"
              value={profile.githubUrl || ''}
              onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
              placeholder="https://github.com/username"
              className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300">LinkedIn Profile URL</label>
            <input
              type="url"
              value={profile.linkedinUrl || ''}
              onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300">Location / Availability Status</label>
          <input
            type="text"
            value={profile.location || ''}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            placeholder="Remote / Available Worldwide"
            className="mt-1.5 block w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? 'Saving...' : 'Save Contact Info'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
