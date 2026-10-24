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
  contributions: string[]; // Bullet points of what you built
  orderIndex?: number;
  createdAt?: string;
}

export interface SiteProfile {
  id?: string;
  name: string;
  title: string;
  bio: string;
  resumeUrl: string;
  resumeUpdatedAt?: string;
  email: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  location?: string;
  updatedAt?: string;
}
