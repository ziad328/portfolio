import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectDetailView, { showcaseRows } from '@/components/ProjectDetailView';
import { Project } from '@/types/portfolio';

const bare: Project = {
  id: 'p1',
  title: 'Bare App',
  tagline: '',
  description: '',
  tags: [],
  mediaType: 'none',
  featured: false,
  contributions: [],
};

describe('ProjectDetailView', () => {
  it('alternates full-width and two-column screenshot rows', () => {
    expect(showcaseRows(['a', 'b', 'c', 'd', 'e'])).toEqual([['a'], ['b', 'c'], ['d'], ['e']]);
    expect(showcaseRows([])).toEqual([]);
  });

  it('renders a project with no extras without empty sections', () => {
    const { container } = render(<ProjectDetailView project={bare} />);
    expect(screen.getByRole('heading', { name: 'Bare App' })).toBeInTheDocument();
    expect(container.querySelector('dl')).toBeNull();
    expect(container.querySelector('h2')).toBeNull();
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });

  it('shows highlights, description, contributions and screenshots when present', () => {
    render(
      <ProjectDetailView
        project={{
          ...bare,
          description: 'Desc',
          contributions: ['Built it'],
          highlights: [{ value: '100%', label: 'Typed' }],
          screenshots: ['/a.png', '/b.png', '/c.png'],
        }}
      />
    );
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Built it')).toBeInTheDocument();
    expect(screen.getAllByAltText('Bare App screenshot')).toHaveLength(3);
  });
});
