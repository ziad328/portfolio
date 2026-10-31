import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import MarqueeTicker from '@/components/MarqueeTicker';

describe('MarqueeTicker', () => {
  it('renders nothing when there are no tags', () => {
    const { container } = render(<MarqueeTicker items={['', '  ']} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows each tag once, case-insensitively, keeping the first spelling', () => {
    render(<MarqueeTicker items={['React', 'react', 'Supabase', 'React ']} />);
    const list = screen.getByRole('list', { name: 'Skills' });
    const labels = within(list).getAllByRole('listitem').map((li) => li.textContent);
    expect(new Set(labels)).toEqual(new Set(['React◆', 'Supabase◆']));
  });

  it('hides the duplicate copy from screen readers', () => {
    render(<MarqueeTicker items={['React']} />);
    expect(screen.getAllByRole('list')).toHaveLength(1);
  });
});
