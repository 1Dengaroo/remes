'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePagination } from '@/lib/hooks/use-pagination';
import { Pagination } from '@/components/ui/pagination';
import { Plus, Loader2, Search, Mail, Settings, UserPlus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { createSession } from '@/lib/api';
import { formatRelativeDate } from '@/lib/utils';
import { PageBanner } from '@/components/shared/page-banner';
import { MAX_WIDTH } from '@/lib/layout';
import type { ResearchSessionSummary, SentEmail, ContactedCompany, SavedICP } from '@/lib/types';

// ---------------------------------------------------------------------------
// Activity feed
// ---------------------------------------------------------------------------

interface ActivityItem {
  id: string;
  type: 'session' | 'email' | 'contact';
  title: string;
  subtitle: string;
  timestamp: string;
  href?: string;
  status?: 'sent' | 'failed';
}

function buildActivityFeed(
  sessions: ResearchSessionSummary[],
  emails: SentEmail[],
  contacts: ContactedCompany[]
): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const s of sessions) {
    items.push({
      id: `session-${s.id}`,
      type: 'session',
      title: s.name,
      subtitle: s.icp_description
        ? `${s.icp_description.slice(0, 80)}${s.icp_description.length > 80 ? '...' : ''}`
        : 'New research session',
      timestamp: s.updated_at,
      href: `/research/${s.id}`
    });
  }

  for (const e of emails) {
    items.push({
      id: `email-${e.id}`,
      type: 'email',
      title: `Email to ${e.contact_name}`,
      subtitle: `${e.subject} · ${e.company_name}`,
      timestamp: e.created_at,
      href: `/emails?email=${e.id}`,
      status: e.status
    });
  }

  for (const c of contacts) {
    // Skip contacts that also have a sent email (avoid duplication)
    if (c.sent_email_id) continue;
    items.push({
      id: `contact-${c.id}`,
      type: 'contact',
      title: `Contacted ${c.contact_name}`,
      subtitle: c.company_name,
      timestamp: c.created_at
    });
  }

  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return items;
}

const ACTIVITY_ICONS = {
  session: Search,
  email: Mail,
  contact: UserPlus
} as const;

const ACTIVITY_COLORS = {
  session: 'bg-accent-primary/10 text-accent-primary',
  email: 'bg-emerald-500/10 text-emerald-500',
  contact: 'bg-blue-500/10 text-blue-500'
} as const;

function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted mb-3 flex size-10 items-center justify-center rounded-full">
          <Clock className="text-muted-foreground size-5" />
        </div>
        <p className="text-muted-foreground text-sm">No activity yet</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Start a research session to see your activity here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {items.map((item) => {
        const Icon = ACTIVITY_ICONS[item.type];
        const colorClass = ACTIVITY_COLORS[item.type];
        const rowClass =
          'hover:bg-muted/50 group flex items-start gap-4 rounded-lg py-3 pr-3 pl-0 transition-colors';

        const content = (
          <>
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-full ${colorClass}`}
            >
              <Icon className="size-3.5" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">{item.title}</span>
                {item.status === 'failed' && (
                  <span className="bg-destructive/10 text-destructive shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                    Failed
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mt-0.5 truncate text-xs">{item.subtitle}</p>
            </div>
            <span className="text-muted-foreground shrink-0 pt-1 text-xs">
              {formatRelativeDate(item.timestamp)}
            </span>
          </>
        );

        return item.href ? (
          <Link key={item.id} href={item.href} className={rowClass}>
            {content}
          </Link>
        ) : (
          <div key={item.id} className={rowClass}>
            {content}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export function Dashboard({
  sessions,
  emails,
  contacts,
  icps,
  userName
}: {
  sessions: ResearchSessionSummary[];
  emails: SentEmail[];
  contacts: ContactedCompany[];
  icps: SavedICP[];
  userName: string | null;
}) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const activityItems = useMemo(
    () => buildActivityFeed(sessions, emails, contacts),
    [sessions, emails, contacts]
  );

  const activityPagination = usePagination(activityItems, 15);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const session = await createSession();
      router.push(`/research/${session.id}`);
    } catch {
      toast.error('Failed to create session');
      setIsCreating(false);
    }
  };

  const recentEmails = emails.slice(0, 6);
  const sentCount = emails.filter((e) => e.status === 'sent').length;
  const greeting = userName ? `Welcome back, ${userName.split(' ')[0]}` : 'Welcome back';

  return (
    <>
      <PageBanner />
      <div className={`mx-auto ${MAX_WIDTH} px-6 pt-10 pb-24`}>
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-foreground truncate text-2xl font-semibold tracking-tight">
              {greeting}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {sessions.length} session{sessions.length === 1 ? '' : 's'} · {icps.length} saved
              profile{icps.length === 1 ? '' : 's'} · {sentCount} email{sentCount === 1 ? '' : 's'}{' '}
              sent
            </p>
          </div>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            New Research
          </Button>
        </div>

        {/* Two-column layout */}
        <div className="grid min-w-0 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left: Activity feed */}
          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium">Recent Activity</h2>
              {activityItems.length > 0 && (
                <span className="text-muted-foreground text-xs">{activityItems.length} total</span>
              )}
            </div>
            <Card className="p-4">
              <ActivityFeed items={activityPagination.page} />
            </Card>
            <Pagination
              pageIndex={activityPagination.pageIndex}
              pageCount={activityPagination.pageCount}
              hasPrev={activityPagination.hasPrev}
              hasNext={activityPagination.hasNext}
              onPrev={activityPagination.prev}
              onNext={activityPagination.next}
              onGoTo={activityPagination.goTo}
              className="mt-3"
            />
          </div>

          {/* Right: Emails + Profiles + Quick Links */}
          <div className="min-w-0 space-y-6">
            {/* Recent Emails */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium">Recent Emails</h2>
                {emails.length > 0 && (
                  <Link
                    href="/emails"
                    className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                  >
                    View all
                  </Link>
                )}
              </div>
              <Card className="!gap-0 divide-y !py-0">
                {recentEmails.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-muted-foreground text-sm">No emails sent yet</p>
                  </div>
                ) : (
                  recentEmails.map((email) => (
                    <Link
                      key={email.id}
                      href={`/emails?email=${email.id}`}
                      className="hover:bg-muted/50 flex items-center gap-3 px-4 py-3.5 transition-colors"
                    >
                      <div className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                        {email.contact_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{email.contact_name}</span>
                          {email.status === 'failed' && (
                            <span className="bg-destructive/10 text-destructive shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                              Failed
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-0.5 truncate text-xs">
                          {email.subject}
                        </p>
                      </div>
                      <span className="text-muted-foreground shrink-0 text-xs">
                        {formatRelativeDate(email.created_at)}
                      </span>
                    </Link>
                  ))
                )}
              </Card>
            </div>

            {/* Saved Profiles */}
            {icps.length > 0 && (
              <div>
                <h2 className="mb-4 text-sm font-medium">Saved Profiles</h2>
                <Card className="!gap-0 divide-y !py-0">
                  {icps.slice(0, 4).map((icp) => (
                    <div key={icp.id} className="px-4 py-3">
                      <span className="text-sm font-medium">{icp.name}</span>
                      {icp.icp.description && (
                        <p className="text-muted-foreground mt-0.5 truncate text-xs">
                          {icp.icp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* Quick links */}
            <div>
              <h2 className="mb-4 text-sm font-medium">Quick Links</h2>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  asChild
                  className="h-auto justify-start gap-2.5 px-4 py-3"
                >
                  <Link href="/emails">
                    <Mail className="text-muted-foreground size-4" />
                    <span className="text-sm font-medium">Sent Emails</span>
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  asChild
                  className="h-auto justify-start gap-2.5 px-4 py-3"
                >
                  <Link href="/settings">
                    <Settings className="text-muted-foreground size-4" />
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
