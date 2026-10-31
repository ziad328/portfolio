import { describe, it, expect } from 'vitest';
import { rowToProject, projectToRow, ProjectRow } from '@/lib/projects';

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
