'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyRow, GRID_COLS } from './company-card';
import { FilterSortBar, type SortOption } from './filter-sort-bar';
import { ICPSummary } from './icp-summary';
import { LoadingStatus } from './loading-status';
import { useResearchStore } from '@/lib/store/research-store';
import type { CompanyResult, DiscoveredCompanyPreview } from '@/lib/types';

const SIGNAL_TYPES = ['job_posting', 'funding', 'news', 'product_launch'] as const;

const FUNDING_ORDER: Record<string, number> = {
  'Series D+': 0,
  'Series C': 1,
  'Series B': 2,
  'Series A': 3,
  Seed: 4,
  'Pre-Seed': 5
};

function sortCompanies(
  companies: DiscoveredCompanyPreview[],
  resultMap: Map<string, CompanyResult>,
  sort: SortOption,
  contactedEmails: (name: string) => string[]
): DiscoveredCompanyPreview[] {
  const sorted = [...companies];
  sorted.sort((a, b) => {
    const ra = resultMap.get(a.name);
    const rb = resultMap.get(b.name);
    switch (sort) {
      case 'signals':
        return (rb?.signals.length ?? 0) - (ra?.signals.length ?? 0);
      case 'funding': {
        const fa = FUNDING_ORDER[ra?.funding_stage ?? ''] ?? 99;
        const fb = FUNDING_ORDER[rb?.funding_stage ?? ''] ?? 99;
        return fa - fb;
      }
      case 'name':
        return a.name.localeCompare(b.name);
      case 'contacted': {
        const ca = contactedEmails(a.name).length > 0 ? 0 : 1;
        const cb = contactedEmails(b.name).length > 0 ? 0 : 1;
        return ca - cb;
      }
      default:
        return 0;
    }
  });
  return sorted;
}

export function ResultsStep() {
  const icp = useResearchStore((s) => s.icp);
  const results = useResearchStore((s) => s.results);
  const researchingCompany = useResearchStore((s) => s.researchingCompany);
  const isResearching = useResearchStore((s) => s.isResearching);
  const statusMessage = useResearchStore((s) => s.statusMessage);
  const error = useResearchStore((s) => s.error);
  const setStep = useResearchStore((s) => s.setStep);
  const candidates = useResearchStore((s) => s.candidates);
  const selectedCompanies = useResearchStore((s) => s.selectedCompanies);
  const peopleResults = useResearchStore((s) => s.peopleResults);
  const isPeopleSearching = useResearchStore((s) => s.isPeopleSearching);
  const enrichingPersonIds = useResearchStore((s) => s.enrichingPersonIds);
  const enrichPersonAction = useResearchStore((s) => s.enrichPersonAction);
  const reResearchCompany = useResearchStore((s) => s.reResearchCompany);
  const getContactedEmails = useResearchStore((s) => s.getContactedEmails);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(SIGNAL_TYPES));
  const [sort, setSort] = useState<SortOption>('signals');

  const resultMap = useMemo(() => {
    const map = new Map<string, CompanyResult>();
    for (const r of results) {
      map.set(r.company_name, r);
    }
    return map;
  }, [results]);

  const allCompanies = useMemo(() => {
    const seen = new Set<string>();
    const display: DiscoveredCompanyPreview[] = [];
    const candidateMap = new Map(candidates.map((c) => [c.name, c]));
    const selectedSet = new Set(selectedCompanies);

    for (const r of results) {
      seen.add(r.company_name);
      const candidate = candidateMap.get(r.company_name);
      display.push(
        candidate ?? {
          name: r.company_name,
          website: r.website ?? undefined,
          linkedin_url: r.linkedin_url,
          logo_url: r.logo_url
        }
      );
    }

    for (const c of candidates) {
      if (selectedSet.has(c.name) && !seen.has(c.name)) {
        seen.add(c.name);
        display.push(c);
      }
    }

    return display;
  }, [candidates, selectedCompanies, results]);

  const displayCompanies = useMemo(() => {
    const allActive = activeFilters.size === SIGNAL_TYPES.length;

    const filtered = allActive
      ? allCompanies
      : allCompanies.filter((c) => {
          const result = resultMap.get(c.name);
          if (!result) return true;
          return result.signals.some((s) => activeFilters.has(s.type));
        });

    return sortCompanies(filtered, resultMap, sort, getContactedEmails);
  }, [allCompanies, activeFilters, sort, resultMap, getContactedEmails]);

  const toggleFilter = (type: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const completedCount = results.length;
  const totalCount = allCompanies.length;

  return (
    <>
      {icp && <ICPSummary icp={icp} onEditCriteria={() => setStep('review')} />}

      {error && (
        <Card className="border-destructive/30 bg-destructive/5 mb-6">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {isResearching && (
        <LoadingStatus statusMessage={statusMessage} subtitle="This usually takes 30–60 seconds" />
      )}

      {allCompanies.length > 0 && (
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-sm font-medium">
              {isResearching
                ? `Researching companies (${completedCount}/${totalCount})...`
                : `${completedCount} companies researched`}
            </h3>
          </div>

          {!isResearching && results.length > 0 && (
            <FilterSortBar
              activeFilters={activeFilters}
              onToggleFilter={toggleFilter}
              sort={sort}
              onSortChange={setSort}
            />
          )}

          <Card className="!gap-0 overflow-x-auto !py-0 lg:overflow-x-auto">
            <div className={`bg-card border-border hidden ${GRID_COLS} border-b lg:grid`}>
              {['Company', 'Target Person', 'Buying Signal', 'Overview & Fit'].map(
                (label, i, arr) => (
                  <div
                    key={label}
                    className={`text-muted-foreground section-label min-w-0 px-4 py-2.5 ${i < arr.length - 1 ? 'border-border border-r' : ''}`}
                  >
                    {label}
                  </div>
                )
              )}
            </div>

            {displayCompanies.map((candidate) => {
              const result = resultMap.get(candidate.name) ?? null;
              const isCurrentlyResearching = researchingCompany === candidate.name;

              let status: 'pending' | 'researching' | 'complete' | 'error';
              if (result) {
                status = 'complete';
              } else if (isCurrentlyResearching) {
                status = 'researching';
              } else {
                status = 'pending';
              }

              return (
                <CompanyRow
                  key={candidate.name}
                  preview={candidate}
                  result={result}
                  status={status}
                  onReResearch={!isResearching ? reResearchCompany : undefined}
                  people={peopleResults[candidate.name]}
                  isPeopleSearching={isPeopleSearching}
                  onEnrichPerson={enrichPersonAction}
                  enrichingPersonIds={enrichingPersonIds}
                />
              );
            })}
          </Card>
        </div>
      )}

      {!isResearching && !error && allCompanies.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-sm">
            No matching companies found. Try editing your ICP criteria.
          </p>
        </div>
      )}
    </>
  );
}
