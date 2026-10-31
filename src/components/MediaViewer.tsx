'use client';

import { useState } from 'react';
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '@/lib/utils';
import { MediaType } from '@/types/portfolio';
import { Play } from 'lucide-react';

interface MediaViewerProps {
  mediaType: MediaType;
  mediaUrl?: string;
  youtubeUrl?: string;
  title: string;
}

function Fallback({ title }: { title: string }) {
  const initials = title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex aspect-video w-full items-center justify-center bg-surface font-display text-6xl font-semibold text-fg-muted sm:text-8xl">
      {initials}
    </div>
  );
}

export default function MediaViewer({ mediaType, mediaUrl, youtubeUrl, title }: MediaViewerProps) {
  const [playing, setPlaying] = useState(false);

  if (mediaType === 'youtube') {
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) return <Fallback title={title} />;

    const thumbUrl = getYouTubeThumbnailUrl(videoId);
    const embedUrl = getYouTubeEmbedUrl(videoId);

    return (
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {playing ? (
          <iframe
            src={embedUrl}
            className="h-full w-full"
            title={`${title} demo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            className="group relative h-full w-full"
            onClick={() => setPlaying(true)}
            aria-label={`Play video demo for ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbUrl}
              alt={`${title} video thumbnail`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/50">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent shadow-lg transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 fill-white text-white" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white">
              Watch Demo
            </div>
          </button>
        )}
      </div>
    );
  }

  if (mediaType === 'image' && mediaUrl) {
    return (
      <div className="aspect-video w-full overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl}
          alt={`${title} screenshot`}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return <Fallback title={title} />;
}
