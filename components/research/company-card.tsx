'use client';

import { Building2, DollarSign, ExternalLink, Linkedin, RotateCw } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { SignalBadge } from './signal-badge';
import { ContactCarousel } from './contact-carousel';
import { MobileCompanyCard } from './mobile-company-card';
import { Button } from '@/components/ui/button';
import { CompanyLogoWithFallback } from '@/components/shared/company-logo';
import type {
  CompanyResult,
  SourceLink,
  DiscoveredCompanyPreview,
  ApolloPersonPreview
} from '@/lib/types';

export const GRID_COLS = 'lg:min-w-[900px] grid-cols-[1fr_1fr_1.5fr_1.5fr]';

type RowStatus = 'pending' | 'researching' | 'complete' | 'error';

function SourceLinkRow({ source }: { source: SourceLink }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-primary group flex items-center gap-1 truncate text-xs transition-colors"
    >
      <ExternalLink className="size-3 shrink-0 opacity-50 group-hover:opacity-100" />
      <span className="truncate">{source.title || source.url}</span>
    </a>
  );
}

function ShimmerBlock({ className }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded ${className ?? ''}`} />;
}

function PendingColumn({ isResearching }: { isResearching: boolean }) {
  return (
    <div className="min-w-0 space-y-2.5 p-4">
      {isResearching ? (
        <>
          <div className="flex items-center gap-2">
            <Spinner size="xs" className="text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Researching...</span>
          </div>
          <ShimmerBlock className="h-3 w-full" />
          <ShimmerBlock className="h-3 w-5/6" />
          <ShimmerBlock className="h-3 w-2/3" />
        </>
      ) : (
        <>
          <ShimmerBlock className="h-3 w-3/4" />
          <ShimmerBlock className="h-3 w-full" />
          <ShimmerBlock className="h-3 w-5/6" />
        </>
      )}
    </div>
  );
}

export function CompanyRow({
  preview,
  result,
  status,
  onReResearch,
  people,
  isPeopleSearching,
  onEnrichPerson,
  enrichingPersonIds
}: {
  preview: DiscoveredCompanyPreview;
  result: CompanyResult | null;
  status: RowStatus;
  onReResearch?: (companyName: string) => void;
  people?: ApolloPersonPreview[];
  isPeopleSearching?: boolean;
  onEnrichPerson?: (personId: string, companyName: string) => void;
  enrichingPersonIds?: string[];
}) {
  const isComplete = status === 'complete' && result !== null;
  const isResearching = status === 'researching';
  const showRetry = !isComplete && !isResearching && onReResearch;

  const hasPeople = people && people.length > 0;

  const allSources = result
    ? [...result.sources.funding, ...result.sources.news, ...result.sources.jobs]
    : [];

  return (
    <>
      {/* Mobile card */}
      <MobileCompanyCard
        preview={preview}
        result={result}
        status={status}
        isComplete={isComplete}
        isResearching={isResearching}
        people={people}
        isPeopleSearching={isPeopleSearching}
        onEnrichPerson={onEnrichPerson}
        enrichingPersonIds={enrichingPersonIds}
        onReResearch={onReResearch ? () => onReResearch(preview.name) : undefined}
      />
      {/* Desktop grid row */}
      <div className={`bg-card border-border hidden ${GRID_COLS} border-b last:border-b-0 lg:grid`}>
        <div className="border-border min-w-0 space-y-3 border-r p-4">
          <div>
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
                title="View on LinkedIn"
              >
                {preview.name}
              </a>
              {(preview.linkedin_url || result?.linkedin_url) && (
                <a
                  href={preview.linkedin_url ?? result?.linkedin_url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="size-3 shrink-0" />
                </a>
              )}
              {(preview.website || result?.website) && (
                <a
                  href={preview.website ?? result?.website ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Website"
                >
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>

            {isComplete && result ? (
              <div className="text-muted-foreground mt-1.5 space-y-0.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <Building2 className="size-3 shrink-0" />
                  <span>{result.industry}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="size-3 shrink-0" />
                  {result.sources.funding.length > 0 ? (
                    <a
                      href={result.sources.funding[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {result.amount_raised} &middot; {result.funding_stage}
                    </a>
                  ) : (
                    <span>
                      {result.amount_raised} &middot; {result.funding_stage}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-1.5 space-y-1">
                {preview.description && (
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {preview.description}
                  </p>
                )}
                {!isComplete && !showRetry && (
                  <div className="space-y-1">
                    <ShimmerBlock className="h-3 w-2/3" />
                    <ShimmerBlock className="h-3 w-1/2" />
                  </div>
                )}
              </div>
            )}
          </div>

          {allSources.length > 0 && (
            <div className="space-y-1">
              {allSources.slice(0, 3).map((s, i) => (
                <SourceLinkRow key={i} source={s} />
              ))}
            </div>
          )}

          {onReResearch && !isResearching && (
            <div className="flex items-center gap-2 pt-1">
              {status === 'error' && (
                <span className="text-destructive text-xs">Research failed</span>
              )}
              <Button
                variant={isComplete ? 'ghost' : 'default'}
                size="xs"
                onClick={() => onReResearch(preview.name)}
              >
                <RotateCw className="size-3" />
                {isComplete ? 'Re-research' : 'Retry Research'}
              </Button>
            </div>
          )}
        </div>

        {/* Target Person — contact carousel */}
        <div className="border-border min-w-0 border-r">
          {showRetry ? (
            <div className="p-4" />
          ) : isPeopleSearching ? (
            <PendingColumn isResearching={true} />
          ) : !preview.apollo_org_id && !hasPeople ? (
            <div className="flex items-center p-4">
              <p className="text-muted-foreground text-xs">No contacts available</p>
            </div>
          ) : hasPeople ? (
            <div className="p-4">
              <ContactCarousel
                people={people}
                companyName={preview.name}
                onEnrichPerson={onEnrichPerson}
                enrichingPersonIds={enrichingPersonIds}
              />
            </div>
          ) : (
            <PendingColumn isResearching={isResearching} />
          )}
        </div>

        <div className="border-border min-w-0 border-r">
          {showRetry ? (
            <div className="p-4" />
          ) : isComplete && result ? (
            <div className="space-y-3 p-4">
              <div className="space-y-2">
                {result.signals.slice(0, 3).map((signal, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <SignalBadge type={signal.type} />
                      {signal.source_url ? (
                        <a
                          href={signal.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary group flex items-center gap-1 text-xs font-medium transition-colors"
                        >
                          <span className="line-clamp-1">{signal.title}</span>
                          <ExternalLink className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                        </a>
                      ) : (
                        <span className="line-clamp-1 text-xs font-medium">{signal.title}</span>
                      )}
                    </div>
                    {signal.key_phrases.length > 0 && (
                      <div className="flex gap-1 overflow-hidden">
                        {signal.key_phrases.slice(0, 3).map((phrase, j) => (
                          <span
                            key={j}
                            className="bg-muted text-muted-foreground shrink-0 rounded px-1.5 py-0.5 text-xs"
                          >
                            {phrase}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">{result.match_reason}</p>
            </div>
          ) : (
            <PendingColumn isResearching={isResearching} />
          )}
        </div>

        <div className="min-w-0">
          {isComplete && result ? (
            <div className="space-y-3 p-4">
              <p className="text-xs leading-relaxed">{result.company_overview}</p>
            </div>
          ) : showRetry ? (
            <div className="p-4" />
          ) : (
            <PendingColumn isResearching={isResearching} />
          )}
        </div>
      </div>
    </>
  );
}
