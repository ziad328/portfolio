import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextReveal from '@/components/TextReveal';

describe('TextReveal', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps the heading readable to screen readers', () => {
    render(<TextReveal><h2>Selected work</h2></TextReveal>);
    expect(screen.getByRole('heading', { name: 'Selected work' })).toBeInTheDocument();
  });

  it('leaves the heading untouched when the user prefers reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
    render(<TextReveal><h2>Selected work</h2></TextReveal>);
    expect(screen.getByRole('heading').innerHTML).toBe('Selected work');
  });
});
