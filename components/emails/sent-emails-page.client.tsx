'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Mail, ExternalLink, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SentEmail } from '@/lib/types';
import { MAX_WIDTH } from '@/lib/layout';
import { PageBanner } from '@/components/shared/page-banner';
import { EmailDetailContent } from './email-detail-content';
import { MobileEmailSheet } from './mobile-email-sheet';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function SentEmailsPage({ emails }: { emails: SentEmail[] }) {
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('email'));
  const selected = emails.find((e) => e.id === selectedId) ?? null;

  return (
    <>
      <PageBanner />
      <div className={`mx-auto ${MAX_WIDTH} px-4 py-10 md:px-6`}>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-foreground text-2xl font-semibold tracking-tight">Sent Emails</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {emails.length === 0
                ? 'No emails sent yet'
                : `${emails.length} email${emails.length === 1 ? '' : 's'} sent`}
            </p>
          </div>
          <Link
            href="/research"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
          >
            <Search className="size-3.5" />
            Research
          </Link>
        </div>

        {emails.length === 0 ? (
          <Card className="py-16 text-center">
            <div className="bg-muted/50 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
              <Mail className="text-muted-foreground size-5" />
            </div>
            <h3 className="text-foreground mb-1 text-sm font-medium">No emails sent yet</h3>
            <p className="text-muted-foreground mx-auto mb-5 max-w-xs text-sm">
              Research companies first, then compose personalized outreach from your results.
            </p>
            <Button asChild size="sm" className="mx-auto w-fit">
              <Link href="/research">
                <Search className="size-3.5" />
                Start Researching
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="flex gap-4">
            {/* Email list */}
            <Card className="w-full shrink-0 gap-0 py-0 md:w-3/5">
              {emails.map((email) => (
                <button
                  key={email.id}
                  type="button"
                  onClick={() => setSelectedId(email.id)}
                  className={`border-border flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 ${
                    selectedId === email.id ? 'bg-muted/70' : 'hover:bg-muted/40'
                  }`}
                >
                  {email.status === 'sent' ? (
                    <CheckCircle className="text-primary size-3.5 shrink-0" />
                  ) : (
                    <XCircle className="text-destructive size-3.5 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground truncate text-sm font-medium">
                        {email.recipient_name || email.recipient_email}
                      </span>
                      {email.company_name && (
                        <span className="text-muted-foreground truncate text-xs">
                          {email.company_name}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">{email.subject}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {email.session_id && (
                      <Link
                        href={`/research/${email.session_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="View research session"
                      >
                        <ExternalLink className="size-3" />
                      </Link>
                    )}
                    <span className="text-muted-foreground text-xs">
                      {formatDate(email.created_at)}
                    </span>
                  </div>
                </button>
              ))}
            </Card>

            {/* Desktop email preview */}
            <Card className="hidden min-h-100 flex-1 flex-col gap-0 py-0 md:flex">
              {selected ? (
                <EmailDetailContent email={selected} />
              ) : (
                <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
                  Select an email to preview
                </div>
              )}
            </Card>

            {/* Mobile email detail sheet */}
            <MobileEmailSheet email={selected} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>
    </>
  );
}
