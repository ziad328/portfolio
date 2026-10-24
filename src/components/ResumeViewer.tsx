'use client';

import { useState } from 'react';
import { Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface ResumeViewerProps {
  resumeUrl: string;
}

export default function ResumeViewer({ resumeUrl }: ResumeViewerProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="mb-4 text-base font-semibold text-neutral-300">Resume / CV</h3>
      <div className="flex flex-wrap gap-3">
        <a
          href={resumeUrl}
          download
          id="resume-download"
          aria-label="Download resume PDF"
          className="flex items-center gap-2 rounded-lg bg-neutral-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-600"
        >
          <Download className="h-4 w-4" />
          Download CV
        </a>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open resume in new tab"
          className="flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          Open in New Tab
        </a>
        <button
          onClick={() => setShowPreview((p) => !p)}
          className="flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
        >
          {showPreview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showPreview ? 'Hide Preview' : 'Preview In-Browser'}
        </button>
      </div>

      {showPreview && (
        <div className="mt-4">
          <iframe
            id="resume-preview"
            src={resumeUrl}
            title="Resume Preview"
            className="h-150 w-full rounded-lg border border-neutral-800 bg-neutral-950"
          />
          <p className="mt-2 text-xs text-neutral-600">
            If PDF preview is not supported on your device, please click &quot;Download CV&quot; above.
          </p>
        </div>
      )}
    </div>
  );
}
