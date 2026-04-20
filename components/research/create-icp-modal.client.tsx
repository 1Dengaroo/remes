'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { getErrorMessage } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { IcpPanelEditable } from './icp-panel-editable';
import { createICP, parseICP } from '@/lib/api';
import { EXAMPLE_CUSTOMER_INPUT } from '@/lib/services/config';
import type { SavedICP, ICPCriteria } from '@/lib/types';

export function CreateICPModal({
  open,
  onOpenChange,
  onCreated
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (icp: SavedICP) => void;
}) {
  const [formStep, setFormStep] = useState<'describe' | 'review'>('describe');
  const [description, setDescription] = useState('');
  const [icp, setIcp] = useState<ICPCriteria | null>(null);
  const [name, setName] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setFormStep('describe');
      setDescription('');
      setIcp(null);
      setName('');
      setError(null);
    }
  }, [open]);

  const handleExtract = async () => {
    if (!description.trim()) return;
    setIsExtracting(true);
    setError(null);
    try {
      const parsed = await parseICP(description.trim());
      setIcp({ ...parsed, description: description.trim() });
      setName(description.trim().slice(0, 40));
      setFormStep('review');
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to analyze');
      setError(msg);
      toast.error(msg);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSave = async () => {
    if (!icp || !name.trim()) return;
    setIsSaving(true);
    try {
      const saved = await createICP(name.trim(), icp);
      toast.success('Profile saved');
      onCreated(saved);
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to save');
      setError(msg);
      toast.error(msg);
      setIsSaving(false);
    }
  };

  const updateIcpField = <K extends keyof ICPCriteria>(field: K, value: ICPCriteria[K]) => {
    if (icp) setIcp({ ...icp, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="xl"
        showCloseButton={false}
        className="grid-rows-[1fr] gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">New Customer Profile</DialogTitle>
        {formStep === 'describe' && (
          <div className="flex max-h-[90vh] flex-col overflow-hidden">
            <div className="p-6 pb-0">
              <h2 className="text-lg font-semibold tracking-tight">Describe your customer</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                The more details you provide, the better the profile. Include who you sell to, what
                signals matter, and any example companies.
              </p>
            </div>

            {error && <p className="text-destructive px-6 pt-3 text-sm">{error}</p>}

            <div className="p-6">
              <Card>
                <div className="bg-card border-border flex items-center justify-between border-b px-4 py-2.5">
                  <span className="text-muted-foreground section-label">Customer Profile</span>
                  {description.trim() && (
                    <span className="text-muted-foreground/60 text-xs">to continue</span>
                  )}
                </div>

                <div className="p-4">
                  <Textarea
                    placeholder="Who is your ideal customer? Describe the industries, company size, job titles, technologies, buying signals, or anything else that defines a good fit..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-52 resize-y bg-transparent p-2 shadow-none"
                    disabled={isExtracting}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleExtract();
                      }
                    }}
                  />
                </div>

                <div className="border-border flex items-center gap-2 border-t px-4 py-2.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDescription(EXAMPLE_CUSTOMER_INPUT)}
                    className="text-muted-foreground"
                  >
                    <FileText className="size-3.5" />
                    Try an example
                  </Button>
                </div>
              </Card>
            </div>

            <div className="border-border flex shrink-0 items-center justify-end border-t px-6 py-4">
              <Button
                size="sm"
                onClick={handleExtract}
                disabled={isExtracting || !description.trim()}
              >
                {isExtracting ? (
                  <>
                    <Spinner />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze
                    <ChevronRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {formStep === 'review' && icp && (
          <div className="flex max-h-[90vh] flex-col overflow-hidden">
            <div className="shrink-0 p-6 pb-0">
              <h2 className="text-lg font-semibold tracking-tight">Review & save profile</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Edit the extracted profile below, then save it.
              </p>
            </div>

            {error && <p className="text-destructive shrink-0 px-6 pt-3 text-sm">{error}</p>}

            <div className="overflow-y-auto p-6">
              <div className="mb-4">
                <Label className="mb-1.5 block text-xs" muted>
                  Profile name
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                  }}
                  autoFocus
                  className="text-sm"
                />
              </div>

              <IcpPanelEditable icp={icp} onUpdate={updateIcpField} />
            </div>

            <div className="border-border flex shrink-0 items-center justify-between border-t px-6 py-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFormStep('describe');
                  setError(null);
                }}
              >
                Back
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving || !name.trim()}>
                {isSaving ? (
                  <>
                    <Spinner />
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
