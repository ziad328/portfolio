import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageTransition from '@/components/PageTransition';

// Order matters: the module remembers the first mount
describe('PageTransition', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('leaves the first page load alone', () => {
    render(<PageTransition><p>First</p></PageTransition>);
    expect(screen.getByText('First').parentElement).not.toHaveStyle({ opacity: '0' });
  });

  it('skips the fade under reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
    render(<PageTransition><p>Calm</p></PageTransition>);
    expect(screen.getByText('Calm').parentElement).not.toHaveStyle({ opacity: '0' });
  });

  it('fades in pages mounted by later navigations', () => {
    render(<PageTransition><p>Next</p></PageTransition>);
    expect(screen.getByText('Next').parentElement).toHaveStyle({ opacity: '0' });
  });
});
