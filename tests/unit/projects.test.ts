import { describe, it, expect } from 'vitest';
import { rowToProject, projectToRow, findProject, projectMeta, ProjectRow } from '@/lib/projects';

const row: ProjectRow = {
  id: 'p1',
  title: 'App',
  tagline: 'Tag',
  description: 'Desc',
  tags: null,
  media_type: 'none',
  media_url: null,
  youtube_url: null,
  demo_url: null,
  repo_url: null,
  featured: false,
  role: null,
  contributions: null,
  order_index: 0,
  created_at: '2025-01-01T00:00:00Z',
};

describe('project row mapping', () => {
  it('handles rows from before the detail-field migration', () => {
    const project = rowToProject(row);
    expect(project.slug).toBeUndefined();
    expect(project.year).toBeUndefined();
    expect(project.highlights).toEqual([]);
    expect(project.screenshots).toEqual([]);
    expect(project.tags).toEqual([]);
  });

  it('round-trips the detail fields', () => {
    const highlights = [{ value: '100%', label: 'Self-managed' }];
    const project = rowToProject({ ...row, slug: 'app', year: '2025', highlights, screenshots: ['https://x/1.png'] });
    expect(projectToRow(project)).toMatchObject({ slug: 'app', year: '2025', highlights, screenshots: ['https://x/1.png'] });
  });
});

describe('findProject', () => {
  const projects = [rowToProject(row), rowToProject({ ...row, id: 'p2', slug: 'my-app' })];

  it('matches by slug or by id, and returns undefined for unknown keys', () => {
    expect(findProject(projects, 'my-app')?.id).toBe('p2');
    expect(findProject(projects, 'p2')?.id).toBe('p2');
    expect(findProject(projects, 'p1')?.id).toBe('p1');
    expect(findProject(projects, 'nope')).toBeUndefined();
  });

  it('builds ROLE · YEAR, falling back to the createdAt year', () => {
    expect(projectMeta(rowToProject({ ...row, role: 'Lead', year: '2024' }))).toBe('Lead · 2024');
    expect(projectMeta(rowToProject(row))).toBe('2025');
  });
});
