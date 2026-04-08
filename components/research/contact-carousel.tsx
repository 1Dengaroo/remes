'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, AtSign, Users, Linkedin } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { CopyButton } from './copy-button.client';
import { Button } from '@/components/ui/button';
import type { ApolloPersonPreview } from '@/lib/types';

function sortPeopleEnrichedFirst(people: ApolloPersonPreview[]): ApolloPersonPreview[] {
  return [...people].sort((a, b) => {
    if (a.is_enriched && !b.is_enriched) return -1;
    if (!a.is_enriched && b.is_enriched) return 1;
    return 0;
  });
}

export function ContactCarousel({
  people,
  companyName,
  onEnrichPerson,
  enrichingPersonIds
}: {
  people: ApolloPersonPreview[];
  companyName: string;
  onEnrichPerson?: (personId: string, companyName: string) => void;
  enrichingPersonIds?: string[];
}) {
  const sorted = sortPeopleEnrichedFirst(people);
  const [activeIndex, setActiveIndex] = useState(0);
  const person = sorted[activeIndex];
  if (!person) return null;

  const isEnriched = !!person.is_enriched;
  const displayName = isEnriched
    ? `${person.first_name} ${person.last_name}`
    : `${person.first_name} ${person.last_name_obfuscated}`;
  const isEnriching = enrichingPersonIds?.includes(person.apollo_person_id);

  return (
    <div className="space-y-1">
      {/* Navigation header */}
      {sorted.length > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-[10px]">
            {activeIndex + 1} of {sorted.length}
          </span>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setActiveIndex((i) => i - 1)}
              disabled={activeIndex === 0}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setActiveIndex((i) => i + 1)}
              disabled={activeIndex === sorted.length - 1}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Contact info */}
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          {person.has_email && <Mail className="text-primary size-3 shrink-0" />}
          <span className="truncate text-sm font-medium">{displayName}</span>
          {isEnriched && person.linkedin_url && (
            <a
              href={person.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="size-3" />
            </a>
          )}
          {!isEnriched && (
            <Button
              variant="outline"
              size="icon-xs"
              className="ml-auto shrink-0"
              disabled={isEnriching}
              label={isEnriching ? 'Loading...' : 'Get Contact'}
              onClick={() => onEnrichPerson?.(person.apollo_person_id, companyName)}
            >
              {isEnriching ? <Spinner size="xs" /> : <Users className="size-3" />}
            </Button>
          )}
        </div>
        <p className="text-muted-foreground text-xs">{person.title}</p>
        {isEnriched && person.email && (
          <div className="flex items-center gap-1">
            <AtSign className="text-muted-foreground size-3 shrink-0" />
            <span className="text-muted-foreground min-w-0 truncate text-xs">{person.email}</span>
            <CopyButton text={person.email} />
          </div>
        )}
      </div>
    </div>
  );
}
