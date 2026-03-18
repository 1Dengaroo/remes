'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createSession, deleteSession } from '@/lib/api';
import type { ResearchSessionSummary } from '@/lib/types';

const STEP_LABELS: Record<string, string> = {
  input: 'Describe Customer',
  review: 'Strategy Review',
  confirm: 'Select Companies',
  results: 'Research Results'
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function SessionsPage({
  sessions: initialSessions
}: {
  sessions: ResearchSessionSummary[];
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState(initialSessions);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const session = await createSession();
      router.push(`/research/${session.id}`);
    } catch (err) {
      console.error('Failed to create session:', err);
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete session:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pt-10 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Research Sessions</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Resume a previous session or start a new one.
          </p>
        </div>
        <Button onClick={handleCreate} disabled={isCreating}>
          {isCreating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          New Research
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="border-border bg-card rounded-[var(--card-radius)] border py-16 text-center">
          <p className="text-muted-foreground text-sm">
            No sessions yet. Start your first research.
          </p>
          <Button onClick={handleCreate} disabled={isCreating} className="mt-4" variant="outline">
            {isCreating ? <Loader2 className="size-4 animate-spin" /> : null}
            Start Research
          </Button>
        </div>
      ) : (
        <div className="border-border bg-card overflow-hidden rounded-[var(--card-radius)] border">
          {sessions.map((session, i) => (
            <div
              key={session.id}
              className={`border-border flex items-center gap-4 px-5 py-4 ${i < sessions.length - 1 ? 'border-b' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/research/${session.id}`}
                    className="hover:text-primary truncate text-sm font-medium transition-colors"
                  >
                    {session.name}
                  </Link>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      session.status === 'completed'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {session.status === 'completed'
                      ? 'Completed'
                      : STEP_LABELS[session.step] || session.step}
                  </span>
                </div>
                <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                  {session.icp_description && (
                    <span className="truncate">{session.icp_description}</span>
                  )}
                  {session.company_count > 0 && (
                    <span className="shrink-0">{session.company_count} companies</span>
                  )}
                  <span className="flex shrink-0 items-center gap-1">
                    <Clock className="size-3" />
                    {formatDate(session.updated_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  label="Delete session"
                  onClick={() => handleDelete(session.id)}
                  disabled={deletingId === session.id}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
                <Button asChild variant="ghost" size="icon-xs" label="Open session">
                  <Link href={`/research/${session.id}`}>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
