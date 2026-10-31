import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnimatedSection from '@/components/AnimatedSection';

describe('AnimatedSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders its children', () => {
    render(<AnimatedSection><p>Hello</p></AnimatedSection>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('never hides content when the user prefers reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
    render(<AnimatedSection><p>Still here</p></AnimatedSection>);
    expect(screen.getByText('Still here').parentElement).not.toHaveStyle({ opacity: '0' });
  });
});
