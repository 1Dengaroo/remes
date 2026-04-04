'use client';

import { useState, useRef, useEffect } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResearchStore } from '@/lib/store/research-store';
import { useICPStore } from '@/lib/store/icp-store';

export function SaveICPButton() {
  const icp = useResearchStore((s) => s.icp);
  const saveICP = useICPStore((s) => s.saveICP);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultName = icp?.description?.slice(0, 40).trim() || '';

  useEffect(() => {
    if (naming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [naming]);

  const handleSave = async () => {
    const finalName = name.trim() || defaultName;
    if (!finalName || !icp) return;
    try {
      await saveICP(finalName, icp);
      toast.success('Saved to Profiles');
      setNaming(false);
      setName('');
    } catch {
      toast.error('Failed to save profile');
    }
  };

  if (naming) {
    return (
      <div className="flex items-center gap-1">
        <Input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') {
              setNaming(false);
              setName('');
            }
          }}
          placeholder={defaultName || 'ICP name...'}
          className="h-6 w-44 text-xs"
        />
        <Button size="icon-xs" label="Save" onClick={handleSave}>
          <Save className="size-3" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={() => {
        setName(defaultName);
        setNaming(true);
      }}
      className="text-muted-foreground"
    >
      <Save className="size-3" />
      Save Profile
    </Button>
  );
}
