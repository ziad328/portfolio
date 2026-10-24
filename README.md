# Developer Portfolio Application

A high-performance modern developer portfolio with Next.js (App Router), TypeScript, Tailwind CSS, Supabase, and Vitest testing suite.

## 🚀 Features

- **My Work (Projects)**: Filter tabs (All, Featured, YouTube Demos), unlisted YouTube video embeds with privacy facade player and instant thumbnail previews, screenshots, tags, contributions, demo & repo links.
- **About Me**: Bio narrative, professional highlights, and dynamic in-browser CV/Resume viewer with download and preview iframe.
- **How to Reach**: Direct communication channels (Email with Copy button, Phone/WhatsApp, GitHub, LinkedIn, Location).
- **All-in-One Admin Dashboard (`/admin`)**: 100% of the content displayed on the site can be edited from the dashboard:
  - Edit name, title, bio, and upload new CV PDF files to cloud storage.
  - Edit email, phone, GitHub URL, LinkedIn URL, and location.
  - Add, edit, or delete projects with unlisted YouTube URLs or screenshots.
  - Future visual live editor blueprint documented for Phase 3!

## 🧪 Testing (Vitest & React Testing Library)

To run the complete test suite:

```cmd
npm test
```

For watch mode:

```cmd
npm run test:watch
```

## 💻 Running the App

```cmd
cd d:\Frontend\portfolio\app
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public portfolio and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin portal.

## 🗄️ Supabase Setup (Optional for Cloud Sync)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase, paste the contents of `supabase_schema.sql`, and execute it.
3. In `Project Settings > API`, copy your project URL and anon key.
4. Create a `.env.local` file in this directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Create your admin user in Supabase under **Authentication > Users > Add user**.
6. Sign in at `http://localhost:3000/admin/login` to manage your portfolio!
