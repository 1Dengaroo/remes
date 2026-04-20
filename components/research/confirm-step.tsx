'use client';

import { useState, useMemo } from 'react';
import { Building2, X, Plus, RefreshCw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingStatus } from './loading-status';
import { Checkbox, CompanyRow } from './confirm-company-row';
import { StrategyChat } from './strategy-chat.client';
import { useResearchStore } from '@/lib/store/research-store';
import { Card } from '@/components/ui/card';

const MAX_SELECTED = 5;

function FilterChip({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={active ? 'default' : 'ghost'}
      size="xs"
      onClick={onClick}
      className={`rounded-full ${active ? '' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
    >
      {label}
    </Button>
  );
}

function SkeletonRow({ index }: { index: number }) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-3"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="border-border size-4 rounded border" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="bg-muted h-4 w-1/3 animate-pulse rounded" />
        <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
      </div>
    </div>
  );
}

export function ConfirmStep() {
  const candidates = useResearchStore((s) => s.candidates);
  const selected = useResearchStore((s) => s.selectedCompanies);
  const setSelectedCompanies = useResearchStore((s) => s.setSelectedCompanies);
  const isDiscovering = useResearchStore((s) => s.isDiscovering);
  const statusMessage = useResearchStore((s) => s.statusMessage);
  const error = useResearchStore((s) => s.error);
  const previouslyResearched = useResearchStore((s) => s.previouslyResearched);
  const icpChangedSinceDiscovery = useResearchStore((s) => s.icpChangedSinceDiscovery);
  const discover = useResearchStore((s) => s.discover);

  const [adding, setAdding] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [locationFilter, setLocationFilter] = useState<string | null>(null);

  const selectedSet = new Set(selected);
  const atLimit = selected.length >= MAX_SELECTED;

  const uniqueLocations = useMemo(() => {
    const locs = candidates.map((c) => c.location).filter(Boolean) as string[];
    return [...new Set(locs)].sort();
  }, [candidates]);

  const filteredCandidates = useMemo(
    () => (locationFilter ? candidates.filter((c) => c.location === locationFilter) : candidates),
    [candidates, locationFilter]
  );

  const toggle = (name: string) => {
    if (selectedSet.has(name)) {
      setSelectedCompanies(selected.filter((n) => n !== name));
    } else if (!atLimit) {
      setSelectedCompanies([...selected, name]);
    }
  };

  const addCustom = () => {
    const trimmed = newCompany.trim();
    if (trimmed && !selectedSet.has(trimmed) && !atLimit) {
      setSelectedCompanies([...selected, trimmed]);
      setNewCompany('');
      setAdding(false);
    }
  };

  const candidateNames = new Set(candidates.map((c) => c.name));
  const customNames = selected.filter((n) => !candidateNames.has(n));
  const allFiltered = filteredCandidates.length > 0;
  const allSelected = allFiltered && filteredCandidates.every((c) => selectedSet.has(c.name));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedCompanies(customNames);
    } else {
      const allNames = [...filteredCandidates.map((c) => c.name), ...customNames];
      setSelectedCompanies([...new Set(allNames)].slice(0, MAX_SELECTED));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 shrink-0">
        <h2 className="text-xl font-semibold tracking-tight">Confirm companies</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Select which companies to deep-research. You can add or remove from the list.
        </p>
      </div>

      {error && <p className="text-destructive mb-3 shrink-0 text-sm">{error}</p>}

      {isDiscovering && (
        <LoadingStatus
          className="mb-6"
          statusMessage={statusMessage}
          subtitle="Finding companies that match your ICP"
        />
      )}

      <div className="flex flex-col gap-4 lg:h-160 lg:flex-row">
        {/* Chat */}
        <div className="w-full shrink-0 lg:h-full lg:w-80">
          <StrategyChat />
        </div>

        {/* Company list */}
        <div className="flex min-w-0 flex-1 flex-col">
          {icpChangedSinceDiscovery && !isDiscovering && (
            <div className="mb-3 shrink-0">
              <Button variant="outline" size="sm" onClick={() => discover()}>
                <RefreshCw className="size-3.5" />
                Re-discover companies
              </Button>
            </div>
          )}

          <Card className="min-h-0 flex-1">
            {/* Header */}
            <div className="bg-card border-border flex shrink-0 items-center gap-4 border-b px-4 py-2.5">
              {allFiltered && (
                <Button variant="ghost" size="icon-xs" onClick={toggleAll}>
                  <Checkbox checked={allSelected} />
                </Button>
              )}
              <span className="text-muted-foreground section-label">Company</span>
              <span
                className={`ml-auto text-xs ${atLimit ? 'text-primary font-medium' : 'text-muted-foreground'}`}
              >
                {selected.length}/{MAX_SELECTED} selected
              </span>
            </div>

            {/* Scrollable rows */}
            <div className="[&>:not(:first-child)]:border-t-border min-h-0 flex-1 overflow-x-hidden overflow-y-auto [&>:not(:first-child)]:border-t">
              {uniqueLocations.length > 1 && (
                <div className="bg-card sticky top-0 z-10 flex flex-wrap items-center gap-1.5 px-4 py-2">
                  <MapPin className="text-muted-foreground size-3" />
                  <FilterChip
                    label="All"
                    active={locationFilter === null}
                    onClick={() => setLocationFilter(null)}
                  />
                  {uniqueLocations.map((loc) => (
                    <FilterChip
                      key={loc}
                      label={loc}
                      active={locationFilter === loc}
                      onClick={() => setLocationFilter(locationFilter === loc ? null : loc)}
                    />
                  ))}
                </div>
              )}
              {isDiscovering &&
                candidates.length === 0 &&
                Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} index={i} />)}

              {filteredCandidates.map((company, i) => (
                <CompanyRow
                  key={company.name}
                  company={company}
                  selected={selectedSet.has(company.name)}
                  previouslyResearched={previouslyResearched.has(company.name)}
                  index={i}
                  onToggle={() => toggle(company.name)}
                />
              ))}

              {customNames.map((name) => (
                <div key={name} className="flex items-center gap-4 px-4 py-3">
                  <Checkbox checked />
                  <div className="flex min-w-0 flex-1 items-center gap-1.5">
                    <Building2 className="text-muted-foreground size-3.5 shrink-0" />
                    <span className="text-sm font-medium">{name}</span>
                    <span className="bg-accent-tertiary/10 text-accent-tertiary rounded px-1.5 py-0.5 text-xs">
                      Custom
                    </span>
                  </div>
                  <Button
                    variant="ghost-muted"
                    size="icon-xs"
                    onClick={() => setSelectedCompanies(selected.filter((n) => n !== name))}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add custom - pinned */}
            <div className="border-border shrink-0 border-t px-4 py-2.5">
              {adding ? (
                <div className="flex flex-wrap gap-2">
                  <Input
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addCustom();
                      if (e.key === 'Escape') setAdding(false);
                    }}
                    placeholder="Company name..."
                    className="h-8 flex-1 text-sm"
                    autoFocus
                  />
                  <Button size="sm" onClick={addCustom} disabled={!newCompany.trim() || atLimit}>
                    Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost-muted"
                  size="sm"
                  onClick={() => setAdding(true)}
                  disabled={atLimit}
                  className="gap-2"
                >
                  <Plus className="size-3.5" />
                  Add a company
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
