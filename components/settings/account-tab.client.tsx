'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/lib/store/profile-store';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function AccountTab({ user }: { user: User | null }) {
  const router = useRouter();
  const closeProfile = useProfileStore((s) => s.closeProfile);
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabase = configured ? createClient() : null;

  async function handleLogout() {
    await supabase?.auth.signOut();
    closeProfile();
    router.push('/');
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {user && (
        <div className="border-border flex items-center gap-3 rounded-md border p-4">
          {user.user_metadata?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- external Google avatar URL
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="size-10 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full text-sm font-medium">
              {(user.email?.[0] ?? '?').toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-foreground text-sm font-medium">
              {user.user_metadata?.full_name ?? user.email}
            </p>
            {user.user_metadata?.full_name && (
              <p className="text-muted-foreground text-xs">{user.email}</p>
            )}
          </div>
        </div>
      )}

      <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
        <LogOut className="size-3.5" />
        Sign out
      </Button>
    </div>
  );
}
