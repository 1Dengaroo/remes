'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import type { ICPCriteria } from '@/lib/types';

type TagColor = 'primary' | 'secondary' | 'accent-secondary' | 'accent-tertiary';

const TAG_COLORS: Record<TagColor, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-muted text-muted-foreground',
  'accent-secondary': 'bg-accent-secondary/10 text-accent-secondary',
  'accent-tertiary': 'bg-accent-tertiary/10 text-accent-tertiary'
};

function EditableTagGroup({
  label,
  tags,
  color = 'primary',
  onChange
}: {
  label: string;
  tags: string[];
  color?: TagColor;
  onChange: (tags: string[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRemove = (tag: string): void => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleAdd = (): void => {
    const trimmed = draft.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setDraft('');
    setAdding(false);
  };

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  return (
    <div>
      <Label className="mb-1.5 block text-xs" muted>
        {label}
      </Label>
      <div className="flex flex-wrap items-center gap-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`flex items-center gap-0.5 ${TAG_COLORS[color]}`}
            style={{
              borderRadius: 'var(--tag-radius, 9999px)',
              paddingInline: 'var(--tag-padding-x, 0.5rem)',
              paddingBlock: 'var(--tag-padding-y, 0.125rem)',
              fontSize: 'var(--tag-font-size, 0.75rem)'
            }}
          >
            {tag}
            <Button
              variant="ghost-destructive"
              size="icon-xs"
              onClick={() => handleRemove(tag)}
              className="ml-0.5 size-auto p-0 opacity-60 hover:opacity-100"
            >
              <X className="size-2.5" />
            </Button>
          </span>
        ))}
        {adding ? (
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') {
                setAdding(false);
                setDraft('');
              }
            }}
            onBlur={handleAdd}
            className="h-5 w-24 rounded-md border-none px-1.5 text-xs shadow-none focus-visible:ring-1"
          />
        ) : (
          <Button
            variant="ghost-muted"
            size="icon-xs"
            onClick={() => setAdding(true)}
            className="size-auto px-1.5 py-0.5"
          >
            <Plus className="size-2.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function IcpPanelEditable({
  icp,
  onUpdate,
  header
}: {
  icp: ICPCriteria;
  onUpdate: <K extends keyof ICPCriteria>(field: K, value: ICPCriteria[K]) => void;
  header?: React.ReactNode;
}) {
  const formatMoney = (amount: number | null): string => {
    if (!amount) return '';
    return String(amount / 1_000_000);
  };

  return (
    <Card>
      {header && (
        <div className="bg-card border-border flex items-center justify-between border-b px-4 py-2.5">
          {header}
        </div>
      )}

      <div className="space-y-4 p-4">
        <div>
          <Label className="mb-1.5 block text-xs" muted>
            Description
          </Label>
          <Textarea
            value={icp.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            className="min-h-15 resize-none text-sm"
          />
        </div>

        <EditableTagGroup
          label="Industries"
          tags={icp.industry_keywords}
          onChange={(v) => onUpdate('industry_keywords', v)}
        />
        <EditableTagGroup
          label="Tech Keywords"
          tags={icp.tech_keywords}
          color="secondary"
          onChange={(v) => onUpdate('tech_keywords', v)}
        />
        <EditableTagGroup
          label="Hiring Signals"
          tags={icp.hiring_signals}
          color="accent-secondary"
          onChange={(v) => onUpdate('hiring_signals', v)}
        />
        <EditableTagGroup
          label="Example Companies"
          tags={icp.company_examples}
          color="accent-tertiary"
          onChange={(v) => onUpdate('company_examples', v)}
        />
        <EditableTagGroup
          label="Funding Stages"
          tags={icp.funding_stages}
          onChange={(v) => onUpdate('funding_stages', v)}
        />
        <EditableTagGroup
          label="Locations"
          tags={icp.locations ?? []}
          color="secondary"
          onChange={(v) => onUpdate('locations', v)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label className="mb-1.5 block text-xs" muted>
              Min Funding ($M)
            </Label>
            <Input
              type="number"
              value={formatMoney(icp.min_funding_amount)}
              onChange={(e) =>
                onUpdate(
                  'min_funding_amount',
                  e.target.value ? Number(e.target.value) * 1_000_000 : null
                )
              }
              placeholder="e.g. 50"
              className="text-sm"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-xs" muted>
              Min Employees
            </Label>
            <Input
              type="number"
              value={icp.min_employees ?? ''}
              onChange={(e) =>
                onUpdate('min_employees', e.target.value ? Number(e.target.value) : null)
              }
              placeholder="-"
              className="text-sm"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-xs" muted>
              Max Employees
            </Label>
            <Input
              type="number"
              value={icp.max_employees ?? ''}
              onChange={(e) =>
                onUpdate('max_employees', e.target.value ? Number(e.target.value) : null)
              }
              placeholder="-"
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
