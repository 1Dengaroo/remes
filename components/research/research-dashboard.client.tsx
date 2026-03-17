'use client';

import { useEffect } from 'react';
import { useResearchStore } from '@/lib/store/research-store';
import { TranscriptStep } from './transcript-step';
import { ReviewStep } from './review-step';
import { ConfirmStep } from './confirm-step';
import { ResultsStep } from './results-step';
import { BottomNav } from './bottom-nav';
import { EmailEditorPanel } from './email-editor-panel.client';

export function ResearchDashboard() {
  const step = useResearchStore((s) => s.step);
  const icp = useResearchStore((s) => s.icp);
  const transcript = useResearchStore((s) => s.transcript);
  const isExtracting = useResearchStore((s) => s.isExtracting);
  const isDiscovering = useResearchStore((s) => s.isDiscovering);
  const isResearching = useResearchStore((s) => s.isResearching);
  const selectedCompanies = useResearchStore((s) => s.selectedCompanies);
  const composeParams = useResearchStore((s) => s.composeParams);

  const extractICP = useResearchStore((s) => s.extractICP);
  const discover = useResearchStore((s) => s.discover);
  const research = useResearchStore((s) => s.research);

  // Cmd+Enter / Ctrl+Enter to advance
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (step === 'input' && transcript.trim() && !isExtracting) {
          extractICP();
        } else if (step === 'review' && icp?.description?.trim() && !isDiscovering) {
          discover();
        } else if (step === 'confirm' && selectedCompanies.length > 0 && !isResearching) {
          research();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    step,
    transcript,
    icp,
    selectedCompanies,
    isExtracting,
    isDiscovering,
    isResearching,
    extractICP,
    discover,
    research
  ]);

  return (
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-7xl px-6 pt-10 pb-24">
        <div className="animate-in fade-in duration-300" key={step}>
          {step === 'input' && <TranscriptStep />}
          {step === 'review' && icp && <ReviewStep />}
          {step === 'confirm' && <ConfirmStep />}
          {step === 'results' && <ResultsStep />}
        </div>
      </main>

      <EmailEditorPanel
        open={composeParams !== null}
        params={composeParams}
        onClose={() => useResearchStore.getState().setComposeParams(null)}
      />

      <BottomNav />
    </div>
  );
}
