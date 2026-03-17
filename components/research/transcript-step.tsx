'use client';

import { FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useResearchStore } from '@/lib/store/research-store';

const EXAMPLE_INPUT = `We sell GPU scheduling and orchestration software for ML teams. Our ideal customer is an AI-intensive startup that's scaling past the point where manual GPU management works. They've typically raised $30M+ and are hiring for MLOps, ML Platform, or GPU infrastructure roles. Key signals we look for are job postings mentioning Kubernetes GPU scheduling, distributed training, or compute cost optimization. Companies like Modal, Anyscale, and Replicate are good examples of the type of company we sell to, though they're also competitors in some ways. We mainly target VP of Infrastructure, Head of ML Platform, or CTO as the buyer.`;

export function TranscriptStep() {
  const transcript = useResearchStore((s) => s.transcript);
  const setTranscript = useResearchStore((s) => s.setTranscript);
  const isExtracting = useResearchStore((s) => s.isExtracting);
  const error = useResearchStore((s) => s.error);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Describe your customer</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          The more details you provide, the better the results. Include who you sell to, what
          signals matter, and any example companies.
        </p>
      </div>

      {error && <p className="text-destructive mb-4 text-sm">{error}</p>}

      <div className="border-border bg-card overflow-hidden rounded-xl border">
        <div className="bg-muted/50 border-border flex items-center justify-between border-b px-4 py-2.5">
          <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Customer Profile
          </span>
          {transcript.trim() && (
            <span className="text-muted-foreground/60 text-xs">
              <kbd className="bg-muted rounded px-1 py-0.5 font-mono text-xs">Cmd+Enter</kbd> to
              continue
            </span>
          )}
        </div>

        <div className="p-4">
          <Textarea
            placeholder="Who is your ideal customer? Describe the industries, company size, job titles, technologies, buying signals, or anything else that defines a good fit..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="min-h-52 resize-y border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
            disabled={isExtracting}
          />
        </div>

        <div className="border-border border-t px-4 py-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTranscript(EXAMPLE_INPUT)}
            className="text-muted-foreground"
          >
            <FileText className="size-3.5" />
            Try an example
          </Button>
        </div>
      </div>
    </>
  );
}
