'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { QuickActionButton } from '@/components/quick-action-button.client';
import { CreateICPModal } from '@/components/research/create-icp-modal.client';
import type { SavedICP } from '@/lib/types';

export function NewProfileButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleCreated = (_icp: SavedICP) => {
    setOpen(false);
    router.push('/profiles');
    router.refresh();
  };

  return (
    <>
      <QuickActionButton
        icon={<UserPlus className="size-3.5" />}
        label="New Profile"
        onClick={() => setOpen(true)}
      />
      <CreateICPModal open={open} onOpenChange={setOpen} onCreated={handleCreated} />
    </>
  );
}
