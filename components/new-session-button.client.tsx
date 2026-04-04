'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { createSession } from '@/lib/api';
import { toast } from 'sonner';

export function NewSessionButton() {
  const router = useRouter();
  const { state } = useSidebar();
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

  if (state === 'collapsed') {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="New Research" onClick={handleCreate} disabled={isCreating}>
            {isCreating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <div className="px-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCreate}
        disabled={isCreating}
        className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 w-full justify-start gap-2"
      >
        {isCreating ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
        New Research
      </Button>
    </div>
  );
}
