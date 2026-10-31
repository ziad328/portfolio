import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MediaViewer from '@/components/MediaViewer';

describe('MediaViewer Component', () => {
  it('renders YouTube preview with play button for valid youtube URL', () => {
    render(
      <MediaViewer
        mediaType="youtube"
        youtubeUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        title="Test Project"
      />
    );

    const playButton = screen.getByRole('button', { name: /play video demo for test project/i });
    expect(playButton).toBeInTheDocument();
    expect(screen.getByAltText(/test project video thumbnail/i)).toBeInTheDocument();
  });

  it('mounts YouTube iframe with autoplay when play button is clicked', () => {
    render(
      <MediaViewer
        mediaType="youtube"
        youtubeUrl="https://youtu.be/dQw4w9WgXcQ"
        title="Test Project"
      />
    );

    const playButton = screen.getByRole('button', { name: /play video demo for test project/i });
    fireEvent.click(playButton);

    const iframe = screen.getByTitle(/test project demo/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0');
  });

  it('renders image when mediaType is image with mediaUrl', () => {
    render(
      <MediaViewer
        mediaType="image"
        mediaUrl="https://example.com/screenshot.png"
        title="Test Project"
      />
    );

    const img = screen.getByAltText(/test project screenshot/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/screenshot.png');
  });

  it('renders fallback card when mediaType is none', () => {
    render(
      <MediaViewer
        mediaType="none"
        title="Test Project"
      />
    );

    expect(screen.getByText('TP')).toBeInTheDocument();
  });

  it('renders fallback card when youtubeUrl is invalid', () => {
    render(
      <MediaViewer
        mediaType="youtube"
        youtubeUrl="https://invalid-url.com"
        title="Invalid Video"
      />
    );

    expect(screen.getByText('IV')).toBeInTheDocument();
  });
});
