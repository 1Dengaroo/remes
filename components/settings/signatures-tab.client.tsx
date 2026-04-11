'use client';

import { useState, useEffect } from 'react';
import { Mail, CheckCircle, Plus } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useSignatureStore } from '@/lib/store/signature-store';

export function SignaturesTab() {
  const signatures = useSignatureStore((s) => s.signatures);
  const isLoading = useSignatureStore((s) => s.isLoading);
  const loadSignatures = useSignatureStore((s) => s.loadSignatures);
  const createSig = useSignatureStore((s) => s.createSignature);
  const updateSig = useSignatureStore((s) => s.updateSignature);
  const deleteSig = useSignatureStore((s) => s.deleteSignature);

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadSignatures();
  }, [loadSignatures]);

  function resetForm() {
    setName('');
    setBody('');
    setAdding(false);
    setEditingId(null);
  }

  async function handleSave() {
    if (!name.trim() || !body.trim()) return;
    try {
      if (editingId) {
        await updateSig(editingId, { name: name.trim(), body: body.trim() });
        toast.success('Signature updated');
      } else {
        await createSig(name.trim(), body.trim());
        toast.success('Signature created');
      }
      resetForm();
    } catch {
      toast.error('Failed to save signature');
    }
  }

  const deletingSignature = signatures.find((s) => s.id === deletingId);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-3 text-sm font-medium">Signatures</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Appended to outreach emails when sending.
        </p>
        {!adding && !editingId && (
          <Button size="sm" className="mb-4" onClick={() => setAdding(true)}>
            <Plus className="size-3.5" />
            Add Signature
          </Button>
        )}

        {(adding || editingId) && (
          <div className="border-border mb-4 space-y-3 rounded-md border p-4">
            <div className="space-y-1.5">
              <Label className="text-xs" muted>
                Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Work, Casual"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" muted>
                Signature
              </Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Best,&#10;John Doe&#10;CEO, Acme Inc."
                className="min-h-24 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={!name.trim() || !body.trim()}>
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button size="sm" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-muted-foreground flex items-center gap-2 py-4 text-sm">
            <Spinner />
            Loading...
          </div>
        ) : signatures.length === 0 && !adding ? (
          <div className="border-border rounded-md border py-8 text-center">
            <p className="text-muted-foreground text-sm">No signatures yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {signatures.map((sig) => (
              <div
                key={sig.id}
                className="border-border flex items-center justify-between rounded-md border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                    <Mail className="text-muted-foreground size-5" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">{sig.name}</p>
                    <p className="text-muted-foreground flex items-center gap-1 text-xs">
                      {sig.is_default && <CheckCircle className="text-primary size-3" />}
                      {sig.is_default ? 'Default' : sig.body.split('\n')[0]}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!sig.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateSig(sig.id, { is_default: true })
                          .then(() => toast.success('Default signature updated'))
                          .catch(() => toast.error('Failed to set default'))
                      }
                    >
                      Set default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(sig.id);
                      setName(sig.name);
                      setBody(sig.body);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeletingId(sig.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete signature?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deletingSignature?.name}&rdquo; will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              size="sm"
              onClick={() => {
                if (deletingId) {
                  deleteSig(deletingId)
                    .then(() => toast.success('Signature deleted'))
                    .catch(() => toast.error('Failed to delete signature'));
                }
                setDeletingId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
