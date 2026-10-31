import { describe, it, expect } from 'vitest';
import {
  extractYouTubeId,
  validateMediaFile,
  isSupabaseConfigured,
  slugify,
  parseHighlights,
  highlightsToString,
  parseLines,
} from '@/lib/utils';

describe('extractYouTubeId', () => {
  it('extracts ID from standard watch URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from short youtu.be URL', () => {
    expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from embed URL', () => {
    expect(extractYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('returns null for non-YouTube URLs', () => {
    expect(extractYouTubeId('https://vimeo.com/123456')).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(extractYouTubeId(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractYouTubeId('')).toBeNull();
  });
});

describe('validateMediaFile', () => {
  const makeFile = (size: number, type: string) => ({ size, type, name: 'test' });

  it('accepts valid PNG image under 5MB', () => {
    const result = validateMediaFile(makeFile(1 * 1024 * 1024, 'image/png'), 'image');
    expect(result.valid).toBe(true);
  });

  it('rejects image over 5MB', () => {
    const result = validateMediaFile(makeFile(6 * 1024 * 1024, 'image/png'), 'image');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('5MB');
  });

  it('rejects unsupported image format', () => {
    const result = validateMediaFile(makeFile(1 * 1024 * 1024, 'image/gif'), 'image');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file format');
  });

  it('accepts valid PDF under 10MB', () => {
    const result = validateMediaFile(makeFile(2 * 1024 * 1024, 'application/pdf'), 'pdf');
    expect(result.valid).toBe(true);
  });

  it('rejects PDF over 10MB', () => {
    const result = validateMediaFile(makeFile(11 * 1024 * 1024, 'application/pdf'), 'pdf');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('10MB');
  });

  it('rejects non-PDF file as pdf category', () => {
    const result = validateMediaFile(makeFile(1 * 1024 * 1024, 'application/msword'), 'pdf');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file format');
  });
});

describe('isSupabaseConfigured', () => {
  it('returns false when environment variables are missing', () => {
    expect(isSupabaseConfigured()).toBe(false);
  });
});

describe('detail page field helpers', () => {
  it('slugify makes URL-safe slugs', () => {
    expect(slugify('  AI Chat Platform! ')).toBe('ai-chat-platform');
    expect(slugify('Café — Déjà Vu 2.0')).toBe('cafe-deja-vu-2-0');
    expect(slugify('---')).toBe('');
  });

  it('parseHighlights reads "value | label" lines and skips incomplete ones', () => {
    expect(parseHighlights('100% | Self-managed\n  3 months|Build time  \nno label\n| no value\n')).toEqual([
      { value: '100%', label: 'Self-managed' },
      { value: '3 months', label: 'Build time' },
    ]);
  });

  it('highlightsToString round-trips with parseHighlights', () => {
    const highlights = [{ value: '2', label: 'Languages | EN & AR' }];
    expect(parseHighlights(highlightsToString(highlights))).toEqual(highlights);
  });

  it('parseLines trims and drops empty lines', () => {
    expect(parseLines(' a \n\n b\n')).toEqual(['a', 'b']);
  });
});
