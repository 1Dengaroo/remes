'use client';

import { ExternalLink, MapPin } from 'lucide-react';
import { CompanyLogoWithFallback } from '@/components/shared/company-logo';
import type { DiscoveredCompanyPreview } from '@/lib/types';

export function Checkbox({ checked, className }: { checked: boolean; className?: string }) {
  return (
    <div
      className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
        checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
      } ${className ?? ''}`}
    >
      {checked && (
        <svg className="size-3" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6L5 8.5L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

function LinkedInIcon() {
  return (
    <svg className="size-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function CompanyRow({
  company,
  selected,
  disabled,
  previouslyResearched,
  index,
  onToggle
}: {
  company: DiscoveredCompanyPreview;
  selected: boolean;
  disabled: boolean;
  previouslyResearched: boolean;
  index: number;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`animate-in fade-in slide-in-from-bottom-2 fill-mode-both border-border flex w-full items-start gap-4 border-b px-4 py-3 text-left transition-colors duration-300 last:border-b-0 ${
        selected
          ? 'bg-card hover:bg-muted/30'
          : disabled
            ? 'bg-card cursor-not-allowed opacity-30'
            : 'bg-card opacity-50 hover:opacity-70'
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Checkbox checked={selected} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <CompanyLogoWithFallback
            name={company.name}
            website={company.website}
            logoUrl={company.logo_url}
            size="sm"
          />
          <span className="text-sm font-medium">{company.name}</span>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="Website"
            >
              <ExternalLink className="size-3" />
            </a>
          )}
          {company.linkedin_url && (
            <a
              href={company.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="LinkedIn"
            >
              <LinkedInIcon />
            </a>
          )}
          {previouslyResearched && (
            <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-medium">
              Previously Researched
            </span>
          )}
        </div>
        {company.description && (
          <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
            {company.description}
          </p>
        )}
        {company.location && (
          <p className="text-muted-foreground mt-0.5 text-[11px]">
            <MapPin className="mr-0.5 inline size-2.5" />
            {company.location}
          </p>
        )}
      </div>
    </button>
  );
}
