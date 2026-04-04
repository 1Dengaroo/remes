import { getAuthUser } from '@/lib/supabase/server';
import { listICPs } from '@/lib/supabase/queries';
import { ICPList } from '@/components/research/icp-list.client';
import { PageBanner } from '@/components/shared/page-banner';
import { MAX_WIDTH } from '@/lib/layout';
import type { SavedICP } from '@/lib/types';

export default async function Profiles() {
  const { supabase, user } = await getAuthUser();

  let icps: SavedICP[] = [];
  if (user) {
    const { data } = await listICPs(supabase, user.id);
    icps = (data ?? []) as SavedICP[];
  }

  return (
    <>
      <PageBanner />
      <div className={`mx-auto ${MAX_WIDTH} px-6 pt-10 pb-24`}>
        <div className="mb-8">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">Saved Profiles</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Reusable customer profiles to kickstart new research sessions.
          </p>
        </div>
        <ICPList icps={icps} />
      </div>
    </>
  );
}
