import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactSection from '@/components/ContactSection';
import { SiteProfile } from '@/types/portfolio';

const mockProfile: SiteProfile = {
  name: 'Jane Doe',
  title: 'Full-Stack Engineer',
  bio: 'Building awesome apps.',
  resumeUrl: '/resume.pdf',
  email: 'jane@example.com',
  phone: '+1 234 567 890',
  githubUrl: 'https://github.com/janedoe',
  linkedinUrl: 'https://linkedin.com/in/janedoe',
  location: 'San Francisco, CA',
};

describe('ContactSection Component', () => {
  it('renders email mailto link and phone tel link', () => {
    render(<ContactSection profile={mockProfile} />);

    const emailLink = screen.getByRole('link', { name: /email jane@example.com/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:jane@example.com');

    const phoneLink = screen.getByRole('link', { name: /call \+1 234 567 890/i });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute('href', 'tel:+1 234 567 890');
  });

  it('renders GitHub and LinkedIn links', () => {
    render(<ContactSection profile={mockProfile} />);

    const githubLink = screen.getByRole('link', { name: /visit github profile/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/janedoe');

    const linkedinLink = screen.getByRole('link', { name: /visit linkedin profile/i });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/janedoe');
  });

  it('renders location text', () => {
    render(<ContactSection profile={mockProfile} />);

    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
  });

  it('copies email to clipboard when Copy Email button is clicked', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<ContactSection profile={mockProfile} />);

    const copyBtn = screen.getByRole('button', { name: /copy email/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('jane@example.com');
  });

  it('shows the Get In Touch CTA only when there is an email', () => {
    const { unmount } = render(<ContactSection profile={mockProfile} />);
    expect(screen.getByRole('link', { name: /email jane@example.com/i })).toHaveTextContent('Get In Touch');
    unmount();

    render(<ContactSection profile={{ ...mockProfile, email: '' }} />);
    expect(screen.queryByText('Get In Touch')).not.toBeInTheDocument();
  });
});
