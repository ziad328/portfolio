import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyWorkSection from '@/components/MyWorkSection';
import { fallbackProjects } from '@/data/static-fallback';

describe('MyWorkSection', () => {
  it('lays fallback projects out in pairs, with a lone last card taking the full row', async () => {
    render(<MyWorkSection />);
    const cards: HTMLElement[] = await screen.findAllByRole('article');
    expect(cards).toHaveLength(fallbackProjects.length);

    // Card -> AnimatedSection div -> row grid
    const rows = [...new Set(cards.map((card) => card.parentElement!.parentElement!))];
    expect(rows[0].className).toContain('md:grid-cols-[1.8fr_1fr]');
    expect(rows[0].children).toHaveLength(2);
    expect(rows[1].className).not.toContain('md:grid-cols-[');
    expect(rows[1].children).toHaveLength(1);
  });
});
