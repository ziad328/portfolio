import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectModalForm from '@/components/admin/ProjectModalForm';
import { Project } from '@/types/portfolio';

const project: Project = {
  id: 'p1',
  title: 'Café App',
  tagline: 'Tagline',
  description: 'Description',
  tags: ['React'],
  mediaType: 'none',
  featured: false,
  contributions: [],
  highlights: [{ value: '2', label: 'Languages' }],
};

describe('ProjectModalForm detail fields', () => {
  it('pre-fills and saves slug, year, highlights and screenshots', async () => {
    const onSave = vi.fn();
    render(<ProjectModalForm project={project} isOpen onClose={() => {}} onSave={onSave} />);

    const highlights = screen.getByLabelText(/highlights/i);
    expect(highlights).toHaveValue('2 | Languages');

    fireEvent.change(screen.getByLabelText('Year'), { target: { value: ' 2025 ' } });
    fireEvent.change(highlights, { target: { value: '2 | Languages\n100% | Self-managed\nbroken line' } });
    fireEvent.change(screen.getByLabelText(/extra screenshots/i), { target: { value: 'https://x/1.png\n\nhttps://x/2.png' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledOnce());
    expect(onSave.mock.calls[0][0]).toMatchObject({
      slug: 'cafe-app', // empty slug falls back to the title
      year: '2025',
      highlights: [
        { value: '2', label: 'Languages' },
        { value: '100%', label: 'Self-managed' },
      ],
      screenshots: ['https://x/1.png', 'https://x/2.png'],
    });
  });
});
