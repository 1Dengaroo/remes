'use client';

import { Building2, DollarSign, Linkedin, RotateCw } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { SignalBadge } from './signal-badge';
import { ContactCarousel } from './contact-carousel';
import { Button } from '@/components/ui/button';
import { CompanyLogoWithFallback } from '@/components/shared/company-logo';
import type { CompanyResult, DiscoveredCompanyPreview, ApolloPersonPreview } from '@/lib/types';

type RowStatus = 'pending' | 'researching' | 'complete' | 'error';

export function MobileCompanyCard({
  preview,
  result,
  status,
  isComplete,
  isResearching,
  people,
  isPeopleSearching,
  onEnrichPerson,
  enrichingPersonIds,
  onReResearch
}: {
  preview: DiscoveredCompanyPreview;
  result: CompanyResult | null;
  status: RowStatus;
  isComplete: boolean;
  isResearching: boolean;
  people?: ApolloPersonPreview[];
  isPeopleSearching?: boolean;
  onEnrichPerson?: (personId: string, companyName: string) => void;
  enrichingPersonIds?: string[];
  onReResearch?: () => void;
}) {
  const hasPeople = people && people.length > 0;

  return (
    <div className="bg-card border-border space-y-3 border-b p-4 last:border-b-0 lg:hidden">
      {/* Company header */}
      <div className="flex items-center gap-2">
        <CompanyLogoWithFallback
          name={preview.name}
          website={preview.website}
          logoUrl={preview.logo_url ?? result?.logo_url}
        />
        <a
          href={preview.linkedin_url ?? result?.linkedin_url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary text-sm font-semibold transition-colors"
        >
          {preview.name}
        </a>
        {(preview.linkedin_url || result?.linkedin_url) && (
          <a
            href={preview.linkedin_url ?? result?.linkedin_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="size-3" />
          </a>
        )}
      </div>

      {/* Industry + funding */}
      {isComplete && result && (
        <div className="text-muted-foreground space-y-0.5 text-xs">
          <div className="flex items-center gap-1.5">
            <Building2 className="size-3 shrink-0" />
            <span>{result.industry}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="size-3 shrink-0" />
            <span>
              {result.amount_raised} &middot; {result.funding_stage}
            </span>
          </div>
        </div>
      )}

      {/* Signals */}
      {isComplete && result && result.signals.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {result.signals.slice(0, 3).map((signal, i) => (
            <SignalBadge key={i} type={signal.type} />
          ))}
        </div>
      )}

      {/* Contact carousel */}
      {isPeopleSearching || isResearching ? (
        <div className="flex items-center gap-2">
          <Spinner size="xs" className="text-muted-foreground" />
          <span className="text-muted-foreground text-xs">Researching...</span>
        </div>
      ) : hasPeople ? (
        <ContactCarousel
          people={people}
          companyName={preview.name}
          onEnrichPerson={onEnrichPerson}
          enrichingPersonIds={enrichingPersonIds}
        />
      ) : (isComplete || people) && !preview.apollo_org_id ? (
        <p className="text-muted-foreground text-xs">No contacts available</p>
      ) : null}

      {/* Overview */}
      {isComplete && result && (
        <p className="text-muted-foreground text-xs leading-relaxed">
          {result.company_overview.slice(0, 200)}
          {result.company_overview.length > 200 ? '...' : ''}
        </p>
      )}

      {onReResearch && !isResearching && (
        <div className="flex items-center gap-2">
          {status === 'error' && <span className="text-destructive text-xs">Research failed</span>}
          <Button variant="outline" size="xs" onClick={onReResearch}>
            <RotateCw className="size-3" />
            {isComplete ? 'Re-research' : 'Retry'}
          </Button>
        </div>
      )}
    </div>
  );
}
