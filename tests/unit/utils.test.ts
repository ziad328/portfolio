import { describe, it, expect } from 'vitest';
import {
  extractYouTubeId,
  validateMediaFile,
  isSupabaseConfigured,
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
