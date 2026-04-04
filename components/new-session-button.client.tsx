'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import { QuickActionButton } from '@/components/quick-action-button.client';
import { createSession } from '@/lib/api';
import { toast } from 'sonner';

export function NewSessionButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const session = await createSession();
      router.push(`/research/${session.id}`);
    } catch {
      toast.error('Failed to create session');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <QuickActionButton
      icon={
        isCreating ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />
      }
      label="New Research"
      onClick={handleCreate}
      disabled={isCreating}
    />
  );
}
