'use client';

import { useState } from 'react';
import {
  Building2,
  DollarSign,
  ExternalLink,
  Linkedin,
  ChevronDown,
  Users,
  Crown,
  Mail,
  AtSign,
  PenSquare,
  Loader2
} from 'lucide-react';
import { SignalBadge } from './signal-badge';
import { CopyButton } from './copy-button.client';
import { Button } from '@/components/ui/button';
import { CompanyLogoWithFallback } from '@/components/company-logo';
import type {
  CompanyResult,
  ComposeEmailParams,
  TargetContact,
  SourceLink,
  DiscoveredCompanyPreview
} from '@/lib/types';

export const GRID_COLS = 'min-w-[900px] grid-cols-[1fr_1fr_1.5fr_1.5fr]';

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

function ContactRow({
  contact,
  compact,
  onCompose
}: {
  contact: TargetContact;
  compact?: boolean;
  onCompose?: () => void;
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5">
        {contact.is_decision_maker && <Crown className="text-primary size-3 shrink-0" />}
        <button
          type="button"
          onClick={onCompose}
          className={`hover:text-primary cursor-pointer font-medium transition-colors ${compact ? 'text-xs' : 'text-sm'}`}
        >
          {contact.name}
        </button>
        <a
          href={contact.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          title={`Find ${contact.name} on LinkedIn`}
        >
          <Linkedin className="size-3" />
        </a>
      </div>
      <p className="text-muted-foreground text-xs">{contact.title}</p>
      {contact.email && (
        <div className="flex items-center gap-1">
          <AtSign className="text-muted-foreground size-3 shrink-0" />
          <button
            type="button"
            onClick={onCompose}
            className="text-muted-foreground hover:text-foreground min-w-0 cursor-pointer truncate text-xs transition-colors"
          >
            {contact.email}
          </button>
          <span className="shrink-0">
            <CopyButton text={contact.email} />
          </span>
        </div>
      )}
    </div>
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
            <Loader2 className="text-muted-foreground size-3 animate-spin" />
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

/** Renders a single company row — handles both preview (loading) and complete states */
export function CompanyRow({
  preview,
  result,
  status,
  index,
  onComposeEmail
}: {
  preview: DiscoveredCompanyPreview;
  result: CompanyResult | null;
  status: RowStatus;
  index: number;
  onComposeEmail?: (params: ComposeEmailParams) => void;
}) {
  const [contactsOpen, setContactsOpen] = useState(false);
  const isComplete = status === 'complete' && result !== null;
  const isResearching = status === 'researching';

  const composeFor = (contact: TargetContact) => {
    if (!result) return;
    onComposeEmail?.({
      company: result,
      contact,
      initialBody: result.email_hook
    });
  };

  const decisionMakers = result?.contacts.filter((c) => c.is_decision_maker) ?? [];
  const otherContacts = result?.contacts.filter((c) => !c.is_decision_maker) ?? [];
  const firstContact = decisionMakers[0] ?? result?.contacts[0];

  const allSources = result
    ? [...result.sources.funding, ...result.sources.news, ...result.sources.jobs]
    : [];

  return (
    <div className={`bg-card border-border grid ${GRID_COLS} border-b last:border-b-0`}>
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
                <p className="text-muted-foreground line-clamp-2 text-xs">{preview.description}</p>
              )}
              {!isComplete && (
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
      </div>

      <div className="border-border min-w-0 border-r">
        {isComplete && result ? (
          <div className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-2">
                {decisionMakers.length > 0 ? (
                  decisionMakers.map((dm, i) => (
                    <ContactRow key={i} contact={dm} onCompose={() => composeFor(dm)} />
                  ))
                ) : result.contacts.length > 0 ? (
                  <ContactRow
                    contact={result.contacts[0]}
                    onCompose={() => composeFor(result.contacts[0])}
                  />
                ) : (
                  <p className="text-muted-foreground text-xs">No contacts inferred</p>
                )}
              </div>
              {firstContact && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => composeFor(firstContact)}
                  label="Compose email"
                  className="text-muted-foreground hover:text-primary shrink-0"
                >
                  <PenSquare className="size-3.5" />
                </Button>
              )}
            </div>

            {otherContacts.length > 0 && (
              <div>
                <button
                  onClick={() => setContactsOpen(!contactsOpen)}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs transition-colors"
                >
                  <Users className="size-3" />
                  <span>{otherContacts.length} more</span>
                  <ChevronDown
                    className={`size-3 transition-transform duration-200 ${contactsOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    contactsOpen ? 'mt-2 max-h-80 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-2">
                    {otherContacts.map((contact, i) => (
                      <ContactRow
                        key={i}
                        contact={contact}
                        compact
                        onCompose={() => composeFor(contact)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <a
              href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(result.company_name)}&origin=GLOBAL_SEARCH_HEADER`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-xs transition-colors"
            >
              <Linkedin className="size-3" />
              Browse all at {result.company_name}
            </a>
          </div>
        ) : (
          <PendingColumn isResearching={isResearching} />
        )}
      </div>

      <div className="border-border min-w-0 border-r">
        {isComplete && result ? (
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
                    <div className="flex flex-wrap gap-1">
                      {signal.key_phrases.slice(0, 3).map((phrase, j) => (
                        <span
                          key={j}
                          className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs"
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

            <div
              className="border-primary/20 bg-primary/5 hover:border-primary/40 cursor-pointer space-y-1.5 rounded-lg border p-3 transition-colors"
              onClick={() => firstContact && composeFor(firstContact)}
            >
              <div className="flex items-center gap-1.5">
                <Mail className="text-primary size-3" />
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Email Hook
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <p className="flex-1 text-xs leading-relaxed italic">
                  &ldquo;{result.email_hook}&rdquo;
                </p>
                <span onClick={(e) => e.stopPropagation()}>
                  <CopyButton text={result.email_hook} />
                </span>
              </div>
            </div>
          </div>
        ) : status === 'error' ? (
          <div className="flex items-center gap-2 p-4">
            <span className="text-destructive text-xs">Research failed for this company</span>
          </div>
        ) : (
          <PendingColumn isResearching={isResearching} />
        )}
      </div>
    </div>
  );
}
