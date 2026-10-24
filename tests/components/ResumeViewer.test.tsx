import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ResumeViewer from '@/components/ResumeViewer';

describe('ResumeViewer Component', () => {
  const resumeUrl = '/test-resume.pdf';

  it('renders Download CV and Open in New Tab links with correct href', () => {
    render(<ResumeViewer resumeUrl={resumeUrl} />);

    const downloadLink = screen.getByRole('link', { name: /download resume pdf/i });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute('href', resumeUrl);
    expect(downloadLink).toHaveAttribute('download');

    const openLink = screen.getByRole('link', { name: /open resume in new tab/i });
    expect(openLink).toBeInTheDocument();
    expect(openLink).toHaveAttribute('href', resumeUrl);
    expect(openLink).toHaveAttribute('target', '_blank');
  });

  it('toggles in-browser preview iframe when button is clicked', () => {
    render(<ResumeViewer resumeUrl={resumeUrl} />);

    expect(screen.queryByTitle(/resume preview/i)).not.toBeInTheDocument();

    const toggleButton = screen.getByRole('button', { name: /preview in-browser/i });
    fireEvent.click(toggleButton);

    const iframe = screen.getByTitle(/resume preview/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', resumeUrl);

    fireEvent.click(screen.getByRole('button', { name: /hide preview/i }));
    expect(screen.queryByTitle(/resume preview/i)).not.toBeInTheDocument();
  });
});
