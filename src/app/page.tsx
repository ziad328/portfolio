'use client';

import { useState, useEffect } from 'react';
import { SiteProfile } from '@/types/portfolio';
import { supabase } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/utils';
import { fallbackProfile } from '@/data/static-fallback';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MyWorkSection from '@/components/MyWorkSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

export default function HomePage() {
  const [profile, setProfile] = useState<SiteProfile>(fallbackProfile);

  useEffect(() => {
    async function loadProfile() {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('site_profile')
          .select('*')
          .limit(1)
          .single();

        if (data && !error) {
          setProfile({
            id: data.id,
            name: data.name || fallbackProfile.name,
            title: data.title || fallbackProfile.title,
            bio: data.bio || fallbackProfile.bio,
            resumeUrl: data.resume_url || fallbackProfile.resumeUrl,
            resumeUpdatedAt: data.resume_updated_at,
            email: data.email || fallbackProfile.email,
            phone: data.phone || fallbackProfile.phone,
            githubUrl: data.github_url || fallbackProfile.githubUrl,
            linkedinUrl: data.linkedin_url || fallbackProfile.linkedinUrl,
            location: data.location || fallbackProfile.location,
            updatedAt: data.updated_at,
          });
        }
      } catch {
        // Fallback to static data
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar name={profile.name} />
      {/* The fixed Navbar stays outside, so the transition's transform never moves it */}
      <PageTransition>
        <main>
          <Hero profile={profile} />
          <MyWorkSection />
          <AboutSection profile={profile} />
          <ContactSection profile={profile} />
        </main>
        <Footer profile={profile} />
      </PageTransition>
    </div>
  );
}
