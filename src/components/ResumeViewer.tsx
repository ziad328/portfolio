'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import Button from './Button';

interface ResumeViewerProps {
  resumeUrl: string;
}

const textLink =
  'font-mono text-xs uppercase tracking-[0.12em] text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline';

export default function ResumeViewer({ resumeUrl }: ResumeViewerProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button
          href={resumeUrl}
          download
          id="resume-download"
          aria-label="Download resume PDF"
          variant="ghost"
        >
          <Download className="h-4 w-4" />
          Download CV
        </Button>
        <button onClick={() => setShowPreview((p) => !p)} aria-expanded={showPreview} className={textLink}>
          {showPreview ? 'Hide Preview' : 'Preview In-Browser'}
        </button>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open resume in new tab"
          className={textLink}
        >
          Open in New Tab ↗
        </a>
      </div>

      {showPreview && (
        <div className="mt-6">
          <iframe
            id="resume-preview"
            src={resumeUrl}
            title="Resume Preview"
            className="h-150 w-full rounded-(--card-radius) border border-border bg-surface"
          />
          <p className="mt-2 text-xs text-fg-muted">
            If PDF preview is not supported on your device, please click &quot;Download CV&quot; above.
          </p>
        </div>
      )}
    </div>
  );
}
