import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types/portfolio';

const mockProject: Project = {
  id: 'test-1',
  title: 'Awesome App',
  tagline: 'Best app ever built',
  description: 'Full description of the awesome application.',
  tags: ['React', 'TypeScript', 'Tailwind'],
  mediaType: 'none',
  demoUrl: 'https://awesome.example.com',
  repoUrl: 'https://github.com/test/awesome',
  featured: true,
  role: 'Lead Architect',
  contributions: ['Built the frontend architecture', 'Integrated payment system'],
};

describe('ProjectCard Component', () => {
  it('renders project title, tagline, description, role and tags', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByRole('heading', { name: 'Awesome App' })).toBeInTheDocument();
    expect(screen.getByText('Best app ever built')).toBeInTheDocument();
    expect(screen.getByText('Full description of the awesome application.')).toBeInTheDocument();
    expect(screen.getByText('Lead Architect')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind')).toBeInTheDocument();
  });

  it('renders contributions bullets', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText('Built the frontend architecture')).toBeInTheDocument();
    expect(screen.getByText('Integrated payment system')).toBeInTheDocument();
  });

  it('renders Featured badge when project is featured', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('renders Live Demo and Source Code links when both exist', () => {
    render(<ProjectCard project={mockProject} />);

    const demoLink = screen.getByRole('link', { name: /live demo for awesome app/i });
    expect(demoLink).toBeInTheDocument();
    expect(demoLink).toHaveAttribute('href', 'https://awesome.example.com');

    const repoLink = screen.getByRole('link', { name: /source code for awesome app/i });
    expect(repoLink).toBeInTheDocument();
    expect(repoLink).toHaveAttribute('href', 'https://github.com/test/awesome');
  });

  it('omits Live Demo and Source Code links when urls are missing', () => {
    const minimalProject: Project = {
      ...mockProject,
      demoUrl: undefined,
      repoUrl: undefined,
      featured: false,
    };

    render(<ProjectCard project={minimalProject} />);

    expect(screen.queryByRole('link', { name: /live demo/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /source code/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });
});
