-- =====================================================================
-- SUPABASE DATABASE & STORAGE INITIALIZATION SCRIPT
-- Paste this script into your Supabase project's SQL Editor and run it.
-- =====================================================================

-- 1. Create the projects table ("My Work")
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  media_type TEXT NOT NULL DEFAULT 'image', -- 'image', 'youtube', or 'none'
  media_url TEXT,                           -- Supabase Storage public image URL
  youtube_url TEXT,                         -- Unlisted YouTube video URL (e.g. https://youtu.be/xyz)
  demo_url TEXT,                            -- Live website link
  repo_url TEXT,                            -- GitHub repo link
  featured BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'Developer',
  contributions TEXT[] DEFAULT '{}',        -- Key bullet points
  order_index INTEGER DEFAULT 0,            -- For custom ordering
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the site_profile table ("About Me" & "How to Reach" content)
CREATE TABLE IF NOT EXISTS public.site_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Developer',
  title TEXT NOT NULL DEFAULT 'Full-Stack Software Engineer',
  bio TEXT DEFAULT 'Passionate software developer crafting high-performance, modern web applications.',
  resume_url TEXT NOT NULL DEFAULT '/resume.pdf',
  resume_updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  -- "How to Reach" contact fields
  email TEXT DEFAULT 'developer@example.com',
  phone TEXT DEFAULT '+1 (555) 000-0000',
  github_url TEXT DEFAULT 'https://github.com',
  linkedin_url TEXT DEFAULT 'https://linkedin.com',
  location TEXT DEFAULT 'Remote / Available Worldwide',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default profile row if not present
INSERT INTO public.site_profile (name, title, bio, resume_url, email, phone, github_url, linkedin_url, location)
VALUES (
  'My Name', 
  'Full-Stack Software Engineer', 
  'Passionate software developer crafting high-performance, modern web applications.', 
  '/resume.pdf',
  'developer@example.com',
  '+1 (555) 000-0000',
  'https://github.com',
  'https://linkedin.com',
  'Remote / Available Worldwide'
)
ON CONFLICT DO NOTHING;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_profile ENABLE ROW LEVEL SECURITY;

-- 4. Policies: Anyone can view, only authenticated admin can modify
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view projects" 
ON public.projects FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admin can manage projects" ON public.projects;
CREATE POLICY "Admin can manage projects" 
ON public.projects FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view profile" ON public.site_profile;
CREATE POLICY "Public can view profile" 
ON public.site_profile FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Admin can update profile" ON public.site_profile;
CREATE POLICY "Admin can update profile" 
ON public.site_profile FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Create Storage Bucket for Screenshots & Resumes (Videos hosted via YouTube)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Bucket Security Policies
-- Anyone can view uploaded screenshots and resumes
DROP POLICY IF EXISTS "Public Access to portfolio-media" ON storage.objects;
CREATE POLICY "Public Access to portfolio-media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'portfolio-media');

-- Only authenticated admin can upload, update, and delete files
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;
CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'portfolio-media');
