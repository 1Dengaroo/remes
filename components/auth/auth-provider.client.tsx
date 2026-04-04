'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProfileStore } from '@/lib/store/profile-store';
import { createClient } from '@/lib/supabase/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!configured) {
      setInitialized();
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setInitialized();
      if (data.user) {
        useProfileStore.getState().loadProfile();
        useProfileStore.getState().loadConnections();
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
