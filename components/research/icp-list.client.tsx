'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Pencil, Check, X, Plus, Loader2, ArrowRight } from 'lucide-react';
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

function ICPRow({
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
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== icp.name) {
      onRename(trimmed);
    }
    setEditing(false);
  };

  const tags = [
    ...icp.icp.industry_keywords,
    ...icp.icp.tech_keywords.slice(0, 2),
    ...icp.icp.hiring_signals.slice(0, 1)
  ].slice(0, 5);

  return (
    <div className="border-border flex items-center gap-4 border-b px-5 py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {editing ? (
            <div className="flex items-center gap-1">
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
                className="h-7 w-56 text-sm"
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
            <span className="truncate text-sm font-medium">{icp.name}</span>
          )}
        </div>
        <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">{icp.icp.description}</p>
        {tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
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
        )}
        <span className="text-muted-foreground mt-1 block text-xs">
          {formatRelativeDate(icp.updated_at)}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-xs"
          label="Rename"
          onClick={() => setEditing(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-3.5" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              label="Delete"
              disabled={isDeleting}
              className="text-muted-foreground hover:text-destructive"
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
        <Button
          size="xs"
          variant="outline"
          onClick={onUse}
          disabled={isUsing}
          title="Create a new session with this profile"
        >
          {isUsing ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <ArrowRight className="size-3" />
          )}
          <span className="hidden md:inline">Start Research</span>
        </Button>
      </div>
    </div>
  );
}

export function ICPList({ icps: initialICPs }: { icps: SavedICP[] }) {
  const router = useRouter();
  const [icps, setICPs] = useState(initialICPs);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [usingId, setUsingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteICP(id);
      setICPs((prev) => prev.filter((i) => i.id !== id));
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

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Saved customer profiles. Use one to start a new research session.
        </p>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="size-4" />
          New Profile
        </Button>
      </div>

      <CreateICPModal
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={(saved) => {
          setICPs((prev) => [saved, ...prev]);
          setShowCreate(false);
        }}
      />

      {icps.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="text-muted-foreground text-sm">
            No saved profiles yet. Create one above or save from the strategy step during research.
          </p>
        </Card>
      ) : (
        <Card className="!gap-0 !py-0">
          {icps.map((icp) => (
            <ICPRow
              key={icp.id}
              icp={icp}
              onDelete={() => handleDelete(icp.id)}
              onRename={(newName) => handleRename(icp.id, newName)}
              onUse={() => handleUse(icp)}
              isDeleting={deletingId === icp.id}
              isUsing={usingId === icp.id}
            />
          ))}
        </Card>
      )}
    </>
  );
}
