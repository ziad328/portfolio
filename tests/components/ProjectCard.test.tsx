import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types/portfolio';

const mockProject: Project = {
  id: 'test-1',
  title: 'Awesome App',
  tagline: 'Best app ever built',
  description: 'Full description of the awesome application.',
  tags: ['React', 'TypeScript', 'Tailwind', 'Supabase'],
  mediaType: 'none',
  demoUrl: 'https://awesome.example.com',
  repoUrl: 'https://github.com/test/awesome',
  featured: true,
  role: 'Lead Architect',
  contributions: ['Built the frontend architecture', 'Integrated payment system'],
  createdAt: '2025-03-01T10:00:00Z',
};

describe('ProjectCard Component', () => {
  it('links the whole card to the project detail page', () => {
    render(<ProjectCard project={mockProject} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/projects/test-1');
    expect(screen.getByRole('heading', { name: 'Awesome App' })).toBeInTheDocument();
  });

  it('shows role and year, and at most three tags', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText('Lead Architect · 2025')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Tailwind')).toBeInTheDocument();
    expect(screen.queryByText('Supabase')).not.toBeInTheDocument();
  });

  it('leaves details, bullets and external links for the detail page', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.queryByText('Full description of the awesome application.')).not.toBeInTheDocument();
    expect(screen.queryByText('Built the frontend architecture')).not.toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('uses the YouTube thumbnail as the preview for video projects', () => {
    const { container } = render(
      <ProjectCard
        project={{ ...mockProject, mediaType: 'youtube', youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ' }}
      />
    );

    expect(container.querySelector('img')).toHaveAttribute('src', expect.stringContaining('img.youtube.com/vi/dQw4w9WgXcQ'));
    expect(container.querySelector('iframe')).not.toBeInTheDocument();
  });

  it('falls back to initials when there is no media', () => {
    const { container } = render(<ProjectCard project={mockProject} />);

    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByText('AA')).toBeInTheDocument();
  });

  it('shows Edit and Delete outside the link for admins', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<ProjectCard project={mockProject} isAdmin onEdit={onEdit} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onEdit).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledOnce();
    expect(screen.getByRole('link')).not.toContainElement(screen.getByRole('button', { name: 'Edit' }));
  });
});
