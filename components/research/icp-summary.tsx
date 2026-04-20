'use client';

import { useState } from 'react';
import { ChevronDown, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShowMore } from '@/components/shared/show-more.client';
import type { ICPCriteria } from '@/lib/types';

export function ICPSummary({
  icp,
  onEditCriteria,
  className
}: {
  icp: ICPCriteria;
  onEditCriteria?: () => void;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={className}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <ShowMore lines={1} contentClassName="text-muted-foreground text-sm">
            {icp.description}
          </ShowMore>
        </div>
        <div className="flex items-center gap-2">
          {onEditCriteria && (
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onEditCriteria();
              }}
              className="text-muted-foreground hover:text-primary"
            >
              <Pencil className="size-3" />
              Edit
            </Button>
          )}
          <ChevronDown
            className={`text-muted-foreground size-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>
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
