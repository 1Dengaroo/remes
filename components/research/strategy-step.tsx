'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResearchStore } from '@/lib/store/research-store';
import { IcpPanelEditable } from './icp-panel-editable';
import { SaveICPButton } from './save-icp-button.client';
import { StrategyChat } from './strategy-chat.client';

function IcpPanel() {
  const icp = useResearchStore((s) => s.icp)!;
  const updateIcp = useResearchStore((s) => s.updateIcp);

  return (
    <IcpPanelEditable
      icp={icp}
      onUpdate={updateIcp}
      header={
        <>
          <span className="text-muted-foreground section-label">Customer Profile</span>
          <SaveICPButton />
        </>
      }
    />
  );
}

export function StrategyStep() {
  const error = useResearchStore((s) => s.error);
  const icp = useResearchStore((s) => s.icp);

  const [icpOpen, setIcpOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-4 shrink-0">
        <h2 className="text-xl font-semibold tracking-tight">Research Strategy</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Review the plan below. Request changes or approve to start researching.
        </p>
      </div>

      {error && <p className="text-destructive mb-3 shrink-0 text-sm">{error}</p>}

      {/* Mobile: stacked, Desktop: side-by-side with absolute chat */}
      <div className="flex flex-col gap-4 lg:relative lg:flex-row">
        {/* Mobile ICP toggle */}
        {icp && (
          <div className="lg:hidden">
            <Button
              variant="ghost"
              onClick={() => setIcpOpen(!icpOpen)}
              className="bg-card flex w-full items-center justify-between rounded-(--card-radius) px-4 py-3 shadow-xs"
            >
              <span className="text-muted-foreground section-label">Customer Profile</span>
              <ChevronDown
                className={`text-muted-foreground size-4 transition-transform duration-200 ${icpOpen ? 'rotate-180' : ''}`}
              />
            </Button>
            <div
              className={`overflow-hidden transition-all duration-200 ${icpOpen ? 'mt-2 max-h-500 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <IcpPanel />
            </div>
          </div>
        )}

        {/* Chat panel */}
        <div className="w-full lg:absolute lg:top-0 lg:bottom-0 lg:left-0 lg:w-80">
          <StrategyChat />
        </div>

        {/* ICP Panel — desktop only, drives the row height */}
        {icp && (
          <div className="hidden min-w-0 flex-1 lg:block" style={{ marginLeft: '21rem' }}>
            <IcpPanel />
          </div>
        )}
      </div>
    </div>
  );
}
