import type { ProjectHighlight } from '@/types/portfolio';

// ── YouTube ID Extraction ──────────────────────────────────────────────────────
export function extractYouTubeId(url: string | undefined | null): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
}

export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// ── File Validation ────────────────────────────────────────────────────────────
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const IMAGE_MAX_BYTES = 5 * 1024 * 1024;   // 5 MB
const PDF_MAX_BYTES   = 10 * 1024 * 1024;  // 10 MB

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const ALLOWED_PDF_TYPES   = ['application/pdf'];

export function validateMediaFile(
  file: { size: number; type: string; name: string },
  category: 'image' | 'pdf'
): ValidationResult {
  if (category === 'image') {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid file format. Allowed: PNG, JPG, WEBP.' };
    }
    if (file.size > IMAGE_MAX_BYTES) {
      return { valid: false, error: 'Image exceeds 5MB limit.' };
    }
  }
  if (category === 'pdf') {
    if (!ALLOWED_PDF_TYPES.includes(file.type)) {
      return { valid: false, error: 'Invalid file format. Only PDF allowed.' };
    }
    if (file.size > PDF_MAX_BYTES) {
      return { valid: false, error: 'PDF exceeds 10MB limit.' };
    }
  }
  return { valid: true };
}

export function isSupabaseConfigured(): boolean {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    key &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder-url.supabase.co'
  );
}

// ── Tag Parsing ────────────────────────────────────────────────────────────────
export function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export function tagsToString(tags: string[]): string {
  return tags.join(', ');
}

// ── Detail Page Field Helpers ──────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// One highlight per line, written as "value | label"
export function parseHighlights(raw: string): ProjectHighlight[] {
  return raw
    .split('\n')
    .map((line) => {
      const [value, ...rest] = line.split('|');
      return { value: value.trim(), label: rest.join('|').trim() };
    })
    .filter((h) => h.value && h.label);
}

export function highlightsToString(highlights: ProjectHighlight[]): string {
  return highlights.map((h) => `${h.value} | ${h.label}`).join('\n');
}

export function parseLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
