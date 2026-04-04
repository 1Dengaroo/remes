'use client';

import { useState } from 'react';
import { ChevronDown, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { ICPCriteria } from '@/lib/types';

export function ICPSummary({
  icp,
  onEditCriteria
}: {
  icp: ICPCriteria;
  onEditCriteria?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="mb-6 !gap-0 !py-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground truncate text-sm">{icp.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {onEditCriteria && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onEditCriteria();
              }}
              className="text-muted-foreground hover:text-primary flex items-center gap-1 text-xs transition-colors"
            >
              <Pencil className="size-3" />
              Edit
            </span>
          )}
          <ChevronDown
            className={`text-muted-foreground size-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${expanded ? 'max-h-40' : 'max-h-0'}`}
      >
        <div className="border-border border-t px-4 py-3">
          <div className="flex flex-wrap gap-1.5">
            {icp.industry_keywords.map((kw, i) => (
              <span
                key={`ind-${i}`}
                className="bg-primary/10 text-primary"
                style={{
                  borderRadius: 'var(--tag-radius, 9999px)',
                  paddingInline: 'var(--tag-padding-x, 0.5rem)',
                  paddingBlock: 'var(--tag-padding-y, 0.125rem)',
                  fontSize: 'var(--tag-font-size, 0.75rem)'
                }}
              >
                {kw}
              </span>
            ))}
            {icp.tech_keywords.map((kw, i) => (
              <span
                key={`tech-${i}`}
                className="bg-secondary text-secondary-foreground"
                style={{
                  borderRadius: 'var(--tag-radius, 9999px)',
                  paddingInline: 'var(--tag-padding-x, 0.5rem)',
                  paddingBlock: 'var(--tag-padding-y, 0.125rem)',
                  fontSize: 'var(--tag-font-size, 0.75rem)'
                }}
              >
                {kw}
              </span>
            ))}
            {icp.hiring_signals.map((kw, i) => (
              <span
                key={`hire-${i}`}
                className="bg-accent-secondary/10 text-accent-secondary"
                style={{
                  borderRadius: 'var(--tag-radius, 9999px)',
                  paddingInline: 'var(--tag-padding-x, 0.5rem)',
                  paddingBlock: 'var(--tag-padding-y, 0.125rem)',
                  fontSize: 'var(--tag-font-size, 0.75rem)'
                }}
              >
                {kw}
              </span>
            ))}
            {icp.min_funding_amount && (
              <span
                className="bg-accent-tertiary/10 text-accent-tertiary"
                style={{
                  borderRadius: 'var(--tag-radius, 9999px)',
                  paddingInline: 'var(--tag-padding-x, 0.5rem)',
                  paddingBlock: 'var(--tag-padding-y, 0.125rem)',
                  fontSize: 'var(--tag-font-size, 0.75rem)'
                }}
              >
                ${(icp.min_funding_amount / 1_000_000).toFixed(0)}M+ raised
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
