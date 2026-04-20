'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Pencil, Check, X, Plus, ArrowRight } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { CreateICPModal } from './create-icp-modal.client';
import { createSession, deleteICP, updateICP } from '@/lib/api';
import { formatRelativeDate } from '@/lib/utils';
import type { SavedICP } from '@/lib/types';

function ProfileDetail({
  icp,
  onDelete,
  onRename,
  onUse,
  isDeleting,
  isUsing
}: {
  icp: SavedICP;
  onDelete: () => void;
  onRename: (name: string) => void;
  onUse: () => void;
  isDeleting: boolean;
  isUsing: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(icp.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditing(false);
    setDraft(icp.name);
  }, [icp.id, icp.name]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== icp.name) onRename(trimmed);
    setEditing(false);
  };

  const tagGroups = [
    { label: 'Industries', tags: icp.icp.industry_keywords },
    { label: 'Tech', tags: icp.icp.tech_keywords },
    { label: 'Hiring signals', tags: icp.icp.hiring_signals },
    { label: 'Locations', tags: icp.icp.locations ?? [] },
    { label: 'Funding stage', tags: icp.icp.funding_stages ?? [] }
  ].filter((g) => g.tags.length > 0);

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex items-start justify-between gap-3 border-b px-6 py-5">
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-1.5">
              <Input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') {
                    setDraft(icp.name);
                    setEditing(false);
                  }
                }}
                className="h-8 flex-1 text-sm font-medium"
              />
              <Button
                size="icon-xs"
                label="Save name"
                onClick={handleSave}
                disabled={!draft.trim()}
              >
                <Check className="size-3" />
              </Button>
              <Button
                size="icon-xs"
                variant="ghost"
                label="Cancel"
                onClick={() => {
                  setDraft(icp.name);
                  setEditing(false);
                }}
              >
                <X className="size-3" />
              </Button>
            </div>
          ) : (
            <h2 className="text-foreground truncate text-base font-semibold">{icp.name}</h2>
          )}
          <p className="text-muted-foreground mt-0.5 text-xs">
            Updated {formatRelativeDate(icp.updated_at)}
          </p>
        </div>
        {!editing && (
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost-muted"
              size="icon-xs"
              label="Rename"
              onClick={() => setEditing(true)}
            >
              <Pencil className="size-3.5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost-destructive"
                  size="icon-xs"
                  label="Delete"
                  disabled={isDeleting}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this saved profile?</AlertDialogTitle>
                  <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {icp.icp.description && (
          <div className="mb-6">
            <p className="text-muted-foreground section-label">Description</p>
            <p className="text-foreground mt-2 text-sm leading-relaxed">{icp.icp.description}</p>
          </div>
        )}

        {tagGroups.length > 0 && (
          <div className="flex flex-col gap-4">
            {tagGroups.map(({ label, tags }) => (
              <div key={label}>
                <p className="text-muted-foreground section-label mb-1.5">{label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted text-muted-foreground"
                      style={{
                        borderRadius: 'var(--tag-radius, 9999px)',
                        paddingInline: 'var(--tag-padding-x, 0.5rem)',
                        paddingBlock: 'var(--tag-padding-y, 0.125rem)',
                        fontSize: 'var(--tag-font-size, 0.75rem)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-border border-t px-6 py-4">
        <Button size="sm" onClick={onUse} disabled={isUsing}>
          {isUsing ? <Spinner size="xs" /> : <ArrowRight className="size-3.5" />}
          Start Research
        </Button>
      </div>
    </div>
  );
}

export function ICPList({ icps: initialICPs }: { icps: SavedICP[] }) {
  const router = useRouter();
  const [icps, setICPs] = useState(initialICPs);
  const [selectedId, setSelectedId] = useState<string | null>(initialICPs[0]?.id ?? null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [usingId, setUsingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const selected = icps.find((i) => i.id === selectedId) ?? null;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteICP(id);
      const remaining = icps.filter((i) => i.id !== id);
      setICPs(remaining);
      if (selectedId === id) setSelectedId(remaining[0]?.id ?? null);
      toast.success('Profile deleted');
    } catch {
      toast.error('Failed to delete profile');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRename = async (id: string, newName: string) => {
    try {
      const updated = await updateICP(id, { name: newName });
      setICPs((prev) => prev.map((i) => (i.id === id ? updated : i)));
      toast.success('Profile renamed');
    } catch {
      toast.error('Failed to rename profile');
    }
  };

  const handleUse = async (icp: SavedICP) => {
    setUsingId(icp.id);
    try {
      const session = await createSession({
        name: icp.name,
        transcript: icp.icp.description,
        icp: icp.icp,
        step: 'review'
      });
      router.push(`/research/${session.id}`);
    } catch {
      toast.error('Failed to start research');
      setUsingId(null);
    }
  };

  if (icps.length === 0) {
    return (
      <>
        <CreateICPModal
          open={showCreate}
          onOpenChange={setShowCreate}
          onCreated={(saved) => {
            setICPs([saved]);
            setSelectedId(saved.id);
            setShowCreate(false);
          }}
        />
        <Card variant="empty-state">
          <p className="text-muted-foreground mb-4 text-sm">
            No saved profiles yet. Create one or save from the strategy step during research.
          </p>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="size-4" />
            New Profile
          </Button>
        </Card>
      </>
    );
  }

  return (
    <>
      <CreateICPModal
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={(saved) => {
          setICPs((prev) => [saved, ...prev]);
          setSelectedId(saved.id);
          setShowCreate(false);
        }}
      />

      <Card className="overflow-hidden">
        <div className="flex h-125">
          <div className="border-border flex w-64 shrink-0 flex-col border-r">
            <div className="flex-1 overflow-y-auto">
              {icps.map((icp) => (
                <button
                  key={icp.id}
                  type="button"
                  onClick={() => setSelectedId(icp.id)}
                  className={[
                    'border-border w-full border-b px-4 py-3 text-left transition-colors last:border-b-0',
                    icp.id === selectedId
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted/50 text-foreground'
                  ].join(' ')}
                >
                  <p className="truncate text-sm font-medium">{icp.name}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {formatRelativeDate(icp.updated_at)}
                  </p>
                </button>
              ))}
            </div>
            <div className="border-border border-t px-3 py-4">
              <Button
                size="sm"
                variant="ghost"
                className="w-full"
                onClick={() => setShowCreate(true)}
              >
                <Plus className="size-3.5" />
                New Profile
              </Button>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            {selected ? (
              <ProfileDetail
                key={selected.id}
                icp={selected}
                onDelete={() => handleDelete(selected.id)}
                onRename={(name) => handleRename(selected.id, name)}
                onUse={() => handleUse(selected)}
                isDeleting={deletingId === selected.id}
                isUsing={usingId === selected.id}
              />
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                Select a profile
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
