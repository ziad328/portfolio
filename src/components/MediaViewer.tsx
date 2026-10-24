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
    <div className="flex h-48 w-full items-center justify-center bg-linear-to-br from-neutral-800 to-neutral-900 rounded-t-xl">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-700 text-xl font-bold text-neutral-300">
          {initials}
        </div>
        <span className="text-xs text-neutral-500 max-w-40 text-center line-clamp-2">{title}</span>
      </div>
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
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-black">
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
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 fill-white text-white" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
              Watch Demo
            </div>
          </button>
        )}
      </div>
    );
  }

  if (mediaType === 'image' && mediaUrl) {
    return (
      <div className="h-48 w-full overflow-hidden rounded-t-xl bg-neutral-900">
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
