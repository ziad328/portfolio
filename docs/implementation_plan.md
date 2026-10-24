# Portfolio Website — Master Implementation Plan & Architecture Specification

## 1. Project Vision & Phased Development Philosophy

### 1.1 Overview
This project is a modern, high-performance **Developer Portfolio Website** built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

The public portfolio is organized into three clean, focused sections:
1. **My Work (Projects Showcase)**:
   - High-quality showcase cards featuring **unlisted YouTube video demos** or **high-resolution screenshots**.
   - Tech stack tags, roles, bulleted contributions, and clickable "Live Demo" and "Source Code" links.
2. **About Me (Bio & CV / Resume)**:
   - Professional narrative: who you are, your problem-solving philosophy, and technical highlights.
   - **In-Browser CV Viewer & Download Button**: Public visitors can preview your resume directly inside an embedded viewer or download it with one click.
3. **How to Reach (Contact & Social Links)**:
   - Direct communication channels: Email address, Phone/WhatsApp number, GitHub profile, LinkedIn, and location.
   - "Copy Email" or "Send Message" action buttons.

---

### 1.2 Core Requirement: 100% Content Editable via Admin Dashboard
**Every single piece of data displayed on the website must be editable by you from the `/admin` dashboard**:
- **Projects**: Add, edit, reorder, or delete projects; attach unlisted YouTube video links or upload screenshots.
- **About Me**: Edit your name, professional title, bio text, and upload a new resume PDF file (or paste an external CV link).
- **How to Reach**: Update your email address, phone number, GitHub URL, LinkedIn profile, and location directly in the browser.
- **Zero code changes, zero Git commits, and zero redeployments required.**

---

### 1.3 Future Implementation Idea: Visual Live-Editor / CMS Builder
*(Documented for future implementation — keeping Phase 1 simple first)*

The long-term vision is to transform the `/admin` experience into a **Visual In-Place Live Editor**:
- **Hover-to-Edit**: When logged in as admin, viewing your portfolio reveals subtle pencil/edit icons over each section upon hover.
- **Click-to-Edit**: Clicking any text, bio, or card opens an instant in-place editor or slide-over drawer to update content on the fly.
- **Drag-and-Drop Section Reordering**: An intuitive handle allowing you to drag sections around (e.g. moving "About Me" above "My Work" or vice-versa) using modern drag-and-drop primitives (such as `@dnd-kit`).
- **Phase 1 Strategy**: To ensure rapid delivery and zero initial complexity, **Phase 1 keeps it simple** with a clean, unified dashboard form card on `/admin`. The visual in-place live editor will be introduced in a future update.

---

### 1.4 Two-Phase Philosophy: "Make It Work Good First"
- **Phase 1 (Core Focus — "Make It Work Good First")**:
  - Focus **100% on bulletproof functionality, correct architecture, and reliability**.
  - Clean, distraction-free neutral dark styling.
  - Zero hydration errors, zero broken links, robust screenshot & CV uploads, and responsive YouTube player integration.
  - Test-Driven Development (TDD) for critical functions and components using Vitest & React Testing Library.
  - All content (Projects, About Me, How to Reach) fully editable via the unified `/admin` dashboard.
  - No premature animation bloat or complex visual tricks until all features work flawlessly.
- **Phase 2 (Design Enhancement — "Make It Beautiful Afterwards")**:
  - Once all Phase 1 tests pass and all features are proven to work:
  - Add visual polish: glassmorphism cards, spotlight cursor glow, smooth Framer Motion / CSS micro-animations, and aesthetic typography accents.

---

## 2. Technical Stack Specification

| Layer | Technology | Purpose & Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 14/15 (App Router) | High-performance React framework with server components and API routes |
| **Language** | TypeScript (Strict mode) | Type safety across database schemas, UI props, and media models |
| **Styling** | Tailwind CSS | Utility-first styling with sleek dark mode palette and responsive grids |
| **Icons** | `lucide-react` | Vector icons (Play, Youtube, Image, FileText, Upload, Download, Mail, Phone, Github, Linkedin, Eye, Trash, Edit, Plus, LogOut) |
| **Database** | Supabase (Free Tier PostgreSQL) | Stores project records, site profile, CV metadata, and contact info |
| **Media & File Storage**| Supabase Storage (`portfolio-media` bucket) | Cloud storage for uploaded project screenshots and CV/Resume PDFs |
| **Video Player** | YouTube Privacy-Enhanced Embeds (`youtube-nocookie.com`) | High-performance responsive video embeds for unlisted project demo videos |
| **Authentication** | Supabase Auth | Secure email/password login protecting the `/admin` dashboard |
| **Testing Suite** | Vitest + React Testing Library + jsdom | Fast test runner for TDD: unit tests for utilities & integration tests for major components |
| **Deployment** | Vercel / Netlify | Continuous deployment with environment variables for Supabase keys |

---

## 3. Directory Structure (Clean & Unified Architecture)

```
d:/Frontend/portfolio/
├── public/
│   ├── resume.pdf                # Default fallback CV file
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Global metadata, fonts, navbar & footer
│   │   ├── page.tsx              # Public homepage (Hero, My Work, About Me, How to Reach)
│   │   ├── globals.css           # Tailwind base styles and theme colors
│   │   └── admin/
│   │       ├── page.tsx          # ALL-IN-ONE ADMIN DASHBOARD (Manage Projects, About Me, & How to Reach)
│   │       └── login/
│   │           └── page.tsx      # Admin Login Screen (email & password)
│   ├── components/
│   │   ├── Navbar.tsx            # Sticky header with links: #work, #about, #contact, & Admin portal link
│   │   ├── Hero.tsx              # Bio headline, availability badge, quick jump CTAs
│   │   ├── MyWorkSection.tsx     # Section 1: "My Work" projects showcase with filter tabs
│   │   ├── ProjectCard.tsx       # Media showcase card (supports screenshots and YouTube video embeds)
│   │   ├── MediaViewer.tsx       # Smart player: renders screenshot, YouTube embed player, or fallback
│   │   ├── AboutSection.tsx      # Section 2: "About Me" (bio narrative + embedded ResumeViewer)
│   │   ├── ResumeViewer.tsx      # In-browser dynamic CV viewer & download button
│   │   ├── ContactSection.tsx    # Section 3: "How to Reach" (Email, Phone, GitHub, LinkedIn, Location)
│   │   ├── Footer.tsx            # Footer with copyright, social handles, and back-to-top
│   │   └── admin/
│   │       ├── ProjectModalForm.tsx  # Inline modal/form to add or edit a project without leaving /admin
│   │       ├── ProfileEditorCard.tsx # In-page widget to edit About Me bio & upload new CV PDF
│   │       └── ContactEditorCard.tsx # In-page widget to edit How to Reach contact info
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser Supabase client
│   │   │   └── auth-helper.ts    # Authentication state helpers
│   │   └── utils.ts              # Core utilities (YouTube ID parser, file validation, tag parser)
│   ├── types/
│   │   └── portfolio.ts          # TypeScript interfaces for Project, Media, and SiteProfile
│   └── data/
│       └── static-fallback.ts    # Fallback initial data in case Supabase is not yet configured
├── tests/
│   ├── setup.ts                  # Test setup (@testing-library/jest-dom)
│   ├── unit/
│   │   └── utils.test.ts         # Tests for YouTube ID extractor, file size & extension validator
│   └── components/
│       ├── MediaViewer.test.tsx  # Tests for YouTube player, screenshot, and fallback card rendering
│       ├── ProjectCard.test.tsx  # Tests for tags, links, and contribution rendering
│       ├── ResumeViewer.test.tsx # Tests for dynamic CV URL binding
│       └── ContactSection.test.tsx # Tests for dynamic contact links rendering
├── vitest.config.ts              # Vitest configuration with jsdom environment
├── supabase_schema.sql           # Database tables and storage bucket setup script
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## 4. Database Schema & Storage Setup (`supabase_schema.sql`)

Paste this SQL script directly into the **Supabase SQL Editor** to create the tables, security policies, and media storage bucket:

```sql
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
DROP POLICY IF EXISTS "Public Access to portfolio-media" ON storage.objects;
CREATE POLICY "Public Access to portfolio-media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'portfolio-media');

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
```

---

## 5. TypeScript Data Contracts (`src/types/portfolio.ts`)

```typescript
export type MediaType = 'image' | 'youtube' | 'none';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  mediaType: MediaType;
  mediaUrl?: string;       // Screenshot image URL (from Supabase Storage)
  youtubeUrl?: string;     // Unlisted YouTube video URL
  demoUrl?: string;        // Live demo link
  repoUrl?: string;        // GitHub repository link
  featured: boolean;
  role?: string;
  contributions: string[]; // Bullet points
  orderIndex?: number;
  createdAt?: string;
}

export interface SiteProfile {
  id?: string;
  name: string;
  title: string;
  bio: string;
  resumeUrl: string;       // Active CV URL (Supabase Storage or external link)
  resumeUpdatedAt?: string;
  // How to Reach contact data
  email: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  location?: string;
  updatedAt?: string;
}
```

---

## 6. Public Section Specifications

### 6.1 Section 1: "My Work" (`<MyWorkSection />`)
- **Header**: "My Work" with subtitle: "Featured projects and open-source contributions".
- **Filter Tabs**: "All Projects", "Featured Only", "Video Demos".
- **Grid Layout**: Responsive 1 col (mobile), 2 cols (tablet), 3 cols (desktop).
- **Cards (`<ProjectCard />`)**:
  - Image screenshot OR unlisted YouTube video facade player (`<MediaViewer />`).
  - Title, tagline, tags pills, contribution highlights.
  - "Live Demo" and "Source Code" buttons.

### 6.2 Section 2: "About Me" (`<AboutSection />`)
- **Header**: "About Me".
- **Narrative**: Bio text from `siteProfile.bio` describing background, technical strengths, and approach.
- **Embedded CV (`<ResumeViewer />`)**:
  - "Download CV" action button (with dynamic download attribute).
  - "Open in New Tab" link.
  - In-browser interactive preview iframe.

### 6.3 Section 3: "How to Reach" (`<ContactSection />`)
- **Header**: "How to Reach Me".
- **Contact Cards**:
  - **Email**: Clickable `mailto:` link with "Copy Email" button.
  - **Phone / WhatsApp**: Clickable `tel:` link.
  - **GitHub**: Icon card linking to your GitHub profile.
  - **LinkedIn**: Icon card linking to your LinkedIn profile.
  - **Location**: Status badge (e.g. "Available for Remote & Relocation").

---

## 7. The All-in-One Dashboard UI (`/admin`)

Every single section of the website is manageable from **one unified screen at `/admin`**:

```
+-----------------------------------------------------------------------------------+
|  [Logo] Portfolio Admin                     [View Live Site]  [Sign Out (Exit)]   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  📝 ABOUT ME & CV CARD                                                            |
|  Name: [ Full Name ]    Title: [ Software Engineer ]                              |
|  Bio: [ Textarea with bio narrative...                                          ] |
|  Active CV: "resume-v2.pdf" (Updated 2 hours ago)     [Preview Current CV]        |
|  [ Upload New PDF Resume ]   OR   External Link: [ https://... ]                  |
|  [ Save About Me & CV ]                                                           |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  📫 HOW TO REACH (CONTACT INFO) CARD                                              |
|  Email: [ developer@example.com ]       Phone: [ +1 (555) 000-0000 ]              |
|  GitHub: [ https://github.com/myhandle ] LinkedIn: [ https://linkedin.com/in/... ]|
|  Location: [ Remote / Worldwide ]                                                 |
|  [ Save Contact Info ]                                                            |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  🚀 MY WORK (PROJECTS SHOWCASE)                           [ + Add New Project ]   |
|                                                                                   |
|  [Filter: All | Featured | YouTube Demos]                                         |
|                                                                                   |
|  +--------------------+  +--------------------+  +--------------------+           |
|  | [YouTube Video]    |  | [Screenshot Image] |  | [Screenshot Image] |           |
|  | AI Voice Assistant |  | E-Commerce App     |  | DevOps Pipeline    |           |
|  | Next.js, OpenAI    |  | React, Stripe      |  | Docker, Go         |           |
|  | [ Edit ] [Delete]  |  | [ Edit ] [Delete]  |  | [ Edit ] [Delete]  |           |
|  +--------------------+  +--------------------+  +--------------------+           |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  ✨ INLINE PROJECT MODAL / DRAWER (Opens when clicking "+ Add" or "Edit"):        |
|  - Title, Tagline, Description                                                    |
|  - Tech Tags (comma separated) & Contributions                                    |
|  - Media Choice:                                                                  |
|    (*) Unlisted YouTube Video: [ Paste YouTube URL: https://youtu.be/... ]        |
|    ( ) Upload Screenshot: [ Choose File: screenshot.png ]                         |
|    ( ) None (Gradient Fallback)                                                   |
|  - Live Links: Demo URL & Repo URL                                                |
|  - [ Save Project ] [ Cancel ]                                                    |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 8. Master Engineering Constraints Across All Phases

Before writing any code, the implementing model and developer **MUST strictly adhere to these constraints**:

### 🎯 8.1 Phase-Specific Constraints

#### 🟢 Phase 1 Constraints: "Make It Work Good First"
1. **Functionality Over Fluff**: Focus on core capabilities: project listing, YouTube video embed playback, screenshot upload, resume management, contact info updates, and admin authentication.
2. **Clean Baseline UI**: Use standard, responsive Tailwind utility classes (`bg-neutral-900`, `border-neutral-800`, `rounded-xl`). **Do NOT** add complex Framer Motion transitions, custom cursor glow canvas, or 3D tilt effects in Phase 1.
3. **Resilience Over Complexity**: Ensure the application never crashes if Supabase is offline or if a project has missing media.

#### 🎨 Phase 2 Constraints: "Design Enhancement Afterwards"
1. **Pre-condition**: Only begin Phase 2 once **all Phase 1 features and test suites are 100% passing**.
2. **Visual Polish**: Add subtle backdrop blurs, refined hover states, smooth entry fade-ins, and typography rhythm without breaking any existing component functionality.

---

### 🧪 8.2 Testing & TDD Constraints (Vitest & React Testing Library)
We enforce **Test-Driven Development for major functions and core components**:

1. **Tests First, Implementation Second**:
   - Write unit and component tests **before** or alongside the component implementation.
   - Run `npm test` to verify tests fail initially, then write the code to make them pass.
2. **Major Functions to Test**:
   - **`tests/unit/utils.test.ts`**:
     * `extractYouTubeId(url)`:
       - Extracts `dQw4w9WgXcQ` from `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
       - Extracts `dQw4w9WgXcQ` from `https://youtu.be/dQw4w9WgXcQ`
       - Extracts `dQw4w9WgXcQ` from `https://www.youtube.com/embed/dQw4w9WgXcQ`
       - Returns `null` for invalid or non-YouTube URLs.
     * `validateMediaFile(file, type)`: accurately validates size limits (image ≤ 5MB, PDF ≤ 10MB) and allowed extensions.
     * `isSupabaseConfigured()`: returns true if env vars exist, false otherwise.
   - **`tests/components/MediaViewer.test.tsx`**:
     * Renders YouTube preview poster with play button when `mediaType === 'youtube'`.
     * Clicking play mounts the `youtube-nocookie.com` iframe with `autoplay=1`.
     * Renders `<img>` when `mediaType === 'image'`.
     * Renders the fallback gradient card when `mediaType === 'none'` or URL is missing.
   - **`tests/components/ProjectCard.test.tsx`**:
     * Renders title, tagline, description, tech stack pills, and contribution bullets.
     * Conditionally hides "Live Demo" button if `demoUrl` is missing; hides "Source Code" button if `repoUrl` is missing.
   - **`tests/components/ResumeViewer.test.tsx`**:
     * Dynamically sets download button `href` and preview `iframe` `src` to the active `resumeUrl`.
   - **`tests/components/ContactSection.test.tsx`**:
     * Renders dynamic email `mailto:`, phone `tel:`, GitHub link, and LinkedIn link from `siteProfile`.
3. **Pass Criteria**: `npm test` must run with **100% passing tests (0 failures)**.

---

### 🛡️ 8.3 Code Completeness Constraints
1. **Zero Placeholder Code**: Never generate `// TODO`, `/* Add styling here */`, or `...rest of component`. Every file must be 100% complete, fully implemented, and directly copy-pasteable.
2. **Strict TypeScript Typing**: No `any` types for core data structures. Always type props with `Project`, `SiteProfile`, and `MediaType` from `@/types/portfolio`.
3. **No Broken Imports**: Verify every import statement matches existing file paths and installed packages (`@supabase/supabase-js`, `lucide-react`, `next/image`).

---

### ⚡ 8.4 Next.js App Router & Hydration Constraints
1. **Hydration Safety**:
   - Never access browser globals (`window`, `document`, `localStorage`) during initial render. Use `useEffect` or standard state initialization.
   - Any component with interactivity (`useState`, `useEffect`, `useRouter`, `onClick`, `onChange`, file uploads) MUST have `'use client';` as the very first line.
   - Root `layout.tsx` must remain a **Server Component** (do not add `'use client'`).
2. **Image Optimization**:
   - Configure `next.config.mjs` with `images.remotePatterns` allowing Supabase storage host domain (`*.supabase.co`) and YouTube thumbnail domain (`img.youtube.com`).
   - All images must have an `alt` attribute and graceful error/fallback handlers.

---

### 🎥 8.5 Media & YouTube Playback Constraints
1. **YouTube Embed Standard**:
   - Use privacy-enhanced mode domain: `https://www.youtube-nocookie.com/embed/{id}`.
   - Include iframe attributes: `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen`.
2. **Upload Size Limits & Validation**:
   - Screenshot uploads: Maximum size **5 MB** (formats: `.png`, `.jpg`, `.jpeg`, `.webp`).
   - Resume CV uploads: Maximum size **10 MB** (format: `.pdf` only).
   - No direct video files uploaded to storage (hosted on YouTube instead).
3. **Graceful Fallbacks**:
   - If a project has no media, or if a YouTube URL is invalid, render the dark geometric gradient card with the project's initials and icon. **Never display a broken media player.**

---

### 🔒 8.6 Security & Supabase Integration Constraints
1. **Zero Hardcoded Secrets**:
   - Never hardcode the Supabase URL or Anon Key in component source files.
   - Always read from `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. **Offline / Unconfigured Fallback**:
   - If environment variables are missing during initial development, the app must gracefully fall back to `static-fallback.ts` so `npm run dev` and `npm run build` succeed with zero runtime crashes.
3. **Admin Route Protection**:
   - The `/admin` dashboard must check the Supabase auth session. If no authenticated user exists, immediately redirect to `/admin/login`.

---

## 9. Step-by-Step Prompts for Cheaper AI Models (Flash / Haiku / Mini)

To execute this project with budget or faster AI models, feed the following 8 prompts in sequential order:

### 🔹 Prompt 1: Project Setup, Config & Testing Infrastructure
```text
Task: Initialize the Next.js portfolio project setup with Supabase support and Vitest testing infrastructure.

Create the following files:
1. `package.json`:
   - Dependencies: next (14 or 15), react, react-dom, typescript, @supabase/supabase-js, lucide-react, tailwindcss, postcss, autoprefixer.
   - DevDependencies: vitest, @testing-library/react, @testing-library/jest-dom, jsdom.
   - Scripts:
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
     "lint": "next lint",
     "test": "vitest run",
     "test:watch": "vitest"

2. `tsconfig.json`:
   - Strict mode enabled with path alias: "@/*": ["./src/*"]

3. `vitest.config.ts`:
   - Configured with environment: 'jsdom', setupFiles: ['./tests/setup.ts'], and path alias '@/*'.

4. `tests/setup.ts`:
   - Import '@testing-library/jest-dom/vitest'.

5. `tailwind.config.ts`:
   - Content paths: "./src/**/*.{js,ts,jsx,tsx,mdx}"
   - Dark theme styling with neutral palette.

6. `postcss.config.mjs` and `next.config.mjs` (configured for Supabase image domains and img.youtube.com).
7. `.env.example`:
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

Output full, complete code for all files.
```

---

### 🔹 Prompt 2: Types, Utility Functions & TDD Unit Tests
```text
Task: Follow TDD to write tests first, then implement TypeScript interfaces and utility functions.

Step A: Create `tests/unit/utils.test.ts`:
Write unit tests using Vitest for:
1. `extractYouTubeId(url)`:
   - Extracts 'dQw4w9WgXcQ' from 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'.
   - Extracts 'dQw4w9WgXcQ' from 'https://youtu.be/dQw4w9WgXcQ'.
   - Extracts 'dQw4w9WgXcQ' from 'https://www.youtube.com/embed/dQw4w9WgXcQ'.
   - Returns null for non-YouTube links or invalid input.
2. `validateMediaFile(file, category)`:
   - Returns { valid: true } for PNG/JPG image < 5MB.
   - Returns { valid: false, error: 'Image exceeds 5MB limit' } for images > 5MB.
   - Returns { valid: true } for PDF < 10MB.
   - Returns { valid: false, error: 'Invalid file format' } for unsupported extensions.
3. `isSupabaseConfigured()`: returns true if env vars exist, false otherwise.

Step B: Create `src/types/portfolio.ts`:
Define `MediaType = 'image' | 'youtube' | 'none'`, `Project`, and `SiteProfile` interfaces (including email, phone, githubUrl, linkedinUrl, location).

Step C: Create `src/lib/utils.ts`:
Implement `extractYouTubeId`, `validateMediaFile`, and tag parsing helpers so all tests in `tests/unit/utils.test.ts` pass!

Step D: Create `src/lib/supabase/client.ts` and `src/data/static-fallback.ts`.
- In `static-fallback.ts`, include fallback profile (with contact data) and starter projects with both screenshots and sample unlisted YouTube demo links.

Run `npm test` and output the full code for all files.
```

---

### 🔹 Prompt 3: Component Tests & Media Showcase Components (TDD)
```text
Task: Follow TDD to write component tests first, then implement MediaViewer and ProjectCard.

Step A: Create tests:
1. `tests/components/MediaViewer.test.tsx`:
   - Test rendering YouTube poster with "Play Video Demo" button for 'youtube'.
   - Test that clicking play mounts the youtube-nocookie.com iframe with autoplay=1.
   - Test rendering <img> for 'image'.
   - Test rendering gradient fallback card when media is missing or 'none'.
2. `tests/components/ProjectCard.test.tsx`:
   - Test displaying title, tagline, description, tech stack tags, and contribution bullets.
   - Test that "Live Demo" button is rendered when demoUrl exists and hidden when omitted.
   - Test that "Source Code" button is rendered when repoUrl exists and hidden when omitted.

Step B: Create `src/components/MediaViewer.tsx` ('use client').
Step C: Create `src/components/ProjectCard.tsx`.

Run `npm test` to verify all component tests pass. Output full code for all files.
```

---

### 🔹 Prompt 4: Public Portfolio Sections ("My Work", "About Me", "How to Reach")
```text
Task: Create the public portfolio presentation components and dynamic Resume Viewer.

Step A: Create tests:
1. `tests/components/ResumeViewer.test.tsx`:
   - Test that the download button links to active resumeUrl.
   - Test that the preview iframe loads resumeUrl.
2. `tests/components/ContactSection.test.tsx`:
   - Test rendering email, phone, GitHub, and LinkedIn links dynamically.

Step B: Create the presentation components in `src/components/`:
1. `src/components/Navbar.tsx` (sticky header, links: #work, #about, #contact, admin keyhole link, mobile menu).
2. `src/components/Hero.tsx` (headline, tagline, status indicator, action buttons).
3. `src/components/MyWorkSection.tsx` (Section 1: filter tabs: All, Featured, YouTube Demos; renders ProjectCard grid).
4. `src/components/AboutSection.tsx` (Section 2: bio narrative text from siteProfile + renders <ResumeViewer />).
5. `src/components/ResumeViewer.tsx` (download button, in-page preview iframe).
6. `src/components/ContactSection.tsx` (Section 3: "How to Reach Me" with clickable cards for Email, Phone/WhatsApp, GitHub, LinkedIn).
7. `src/components/Footer.tsx` (dynamic year copyright, social links, back-to-top).

Output full code for all files.
```

---

### 🔹 Prompt 5: Admin Authentication & Login Page
```text
Task: Implement secure Admin Authentication using Supabase Auth.
Create:
1. `src/app/admin/login/page.tsx` ('use client') with dark-themed email/password login form, input validation, and error handling.
2. `src/lib/supabase/auth-helper.ts` with session validation and signOut function.
Output full code for all files.
```

---

### 🔹 Prompt 6: All-in-One Admin Dashboard (`/admin`)
```text
Task: Build the unified, all-in-one Admin Dashboard on `/admin` allowing the owner to edit ALL data on the website (About Me, CV, How to Reach, and My Work projects).

Create:
1. `src/components/admin/ProfileEditorCard.tsx` ('use client'):
   - Form inputs for Name, Title, and Bio textarea.
   - Resume uploader: File input to upload new PDF CV to Supabase Storage bucket 'portfolio-media/resumes/'.
   - Input for optional external CV link (Google Drive/Notion/LinkedIn).
   - "Save About Me & CV" button updating `site_profile` with toast feedback.

2. `src/components/admin/ContactEditorCard.tsx` ('use client'):
   - Form inputs for Email, Phone number, GitHub URL, LinkedIn URL, and Location.
   - "Save Contact Info" button updating `site_profile` with toast feedback.

3. `src/components/admin/ProjectModalForm.tsx` ('use client'):
   - Inline modal/drawer for creating or editing a project right on the `/admin` page.
   - Form fields: Title, Tagline, Description, Tech Tags (comma-separated), Role, Contributions.
   - Media section: Radio toggle between:
     * "Unlisted YouTube Video" -> text input for YouTube URL (with instant live thumbnail preview via extractYouTubeId).
     * "Screenshot Image" -> file input uploading to Supabase Storage.
     * "None" -> gradient fallback.
   - "Save Project" and "Cancel" buttons.

4. `src/app/admin/page.tsx` ('use client'):
   - Protected route: verifies Supabase auth session; if unauthenticated, redirects to `/admin/login`.
   - Top Header: "Portfolio Admin Dashboard", "View Live Site" link, and "Sign Out" button.
   - Section 1: `<ProfileEditorCard />` (edit bio and upload CV).
   - Section 2: `<ContactEditorCard />` (edit How to Reach contact channels).
   - Section 3: "My Work" management with "+ Add New Project" button (opens `<ProjectModalForm />`) and grid of existing projects with quick "Edit" and "Delete" buttons.

Output full code for all files.
```

---

### 🔹 Prompt 7: Assembly & Verification
```text
Task: Assemble the full application, run test suites, and verify the production build.
1. `src/app/globals.css` (Tailwind base styles, dark theme, smooth scroll).
2. `src/app/layout.tsx` (metadata, Navbar, {children}, Footer).
3. `src/app/page.tsx` (Hero, MyWorkSection, AboutSection, ContactSection).
4. Run `npm test` and ensure 100% of unit & component tests pass.
5. Run `npm run build` and ensure 0 errors.
```

---

### 🔹 Prompt 8: Phase 2 Visual Enhancements (Only After Phase 1 Passes)
```text
Task: Apply Phase 2 visual enhancements to the working portfolio.
1. Add subtle glassmorphism (`backdrop-blur-md bg-neutral-900/60 border border-neutral-800/80`) to cards.
2. Add subtle hover elevation and smooth scale transitions (`transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700`).
3. Add a soft gradient spotlight glow behind the Hero section.
4. Verify that running `npm test` and `npm run build` still pass with 0 errors.
```

---

## 10. Future Implementation Blueprint: Visual Live-Editor Mode (Phase 3)

When you are ready to implement the visual live-editor concept in the future, follow this architecture:

### 10.1 In-Place Hover-to-Edit Architecture
1. **Admin Session Overlay**:
   - When the owner visits the public site with an active admin cookie/session, an unobtrusive floating badge appears at the bottom corner: `"Editor Mode Active"`.
2. **Hover Outlines**:
   - Every editable section (`<MyWorkSection />`, `<AboutSection />`, `<ContactSection />`) gets wrapped in an `<EditableSection id="..." />` container.
   - On hover, a subtle dashed accent border appears with an edit button: `[✏️ Edit Section]`.
   - Clicking opens a slide-over drawer to edit that specific section's data in place without navigating away.

### 10.2 Drag-and-Drop Section Reordering
1. **Section Registry**:
   - Store an array in `site_profile`: `section_order: ['hero', 'work', 'about', 'contact']`.
2. **Reordering Engine**:
   - Use `@dnd-kit/core` and `@dnd-kit/sortable`.
   - In Editor Mode, a section reorder toolbar allows grabbing and dragging sections to change their vertical display order.
   - On drop, the new array order is persisted to `site_profile.section_order`.

---

## 11. Deployment Guide

1. Deploy the Next.js project to **Vercel** or **Netlify**.
2. Add the two environment variables in your deployment dashboard:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Visit `https://your-domain.com/admin/login` to access your all-in-one dashboard. Manage your About Me bio, upload your CV, update your contact channels, paste unlisted YouTube video demos, and publish projects all in one place!

---

## 12. Implementation Progress & Execution Log

| Date | Milestone / Action | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Core Architecture, Types & Utilities | ✅ Complete | Full contracts for `Project`, `SiteProfile`, YouTube parser, file validator |
| **Phase 1** | Public Showcase Sections (Work, About, Reach) | ✅ Complete | Responsive cards, YouTube facade embed, CV viewer, clipboard copy |
| **Phase 1** | All-in-One Admin Dashboard (`/admin`) | ✅ Complete | Bio editor, CV uploader, contact editor, project modal with instant video preview |
| **Phase 1** | Vitest Test Suite (5 suites, 29 tests) | ✅ 100% Pass | All unit & component tests passing with jsdom and native esbuild transform |
| **Phase 1** | Next.js Client Prerender Issue Fix | ✅ Resolved | Fixed `new Date()` in `Footer.tsx` by deferred hydration via `useEffect` |
| **Phase 1** | Browser Extension Hydration Fix | ✅ Resolved | Added `suppressHydrationWarning` to `html` and `body` in `layout.tsx` |
| **Phase 1** | Supabase Documentation & Live Connection | ✅ Complete | Created `SUPABASE_SETUP_GUIDE.md`, configured `.env.local` with live project |
| **Phase 1** | Clean Codebase & Hierarchy Audit | ✅ Complete | Removed redundant `src/utils` folder; unified all Supabase access under `src/lib/` |
| **Security** | Next.js Security Audit & Upgrade (16.4.3) | ✅ Complete | Upgraded from 16.4.0 to 16.4.3, set `experimental.agentUpgrade`, 0 vulnerabilities |
| **Phase 2** | Visual Polish & Aesthetics | ⏸️ On Standby | **Awaiting user's vision for the style, color palette, and visual identity** |
| **Phase 3** | Visual Live-Editor CMS | 📋 Planned | In-place hover-to-edit handles and drag-and-drop section reordering |


