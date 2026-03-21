'use client';

import { SessionsList } from './sessions-list.client';
import { ICPList } from './icp-list.client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { ResearchSessionSummary, SavedICP } from '@/lib/types';
import { MAX_WIDTH } from '@/lib/layout';

export function ResearchHub({
  sessions,
  icps
}: {
  sessions: ResearchSessionSummary[];
  icps: SavedICP[];
}) {
  return (
    <div className={`mx-auto ${MAX_WIDTH} px-6 pt-10 pb-24`}>
      <Tabs defaultValue="sessions">
        <TabsList className="mb-6">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="icps">Saved Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          <SessionsList sessions={sessions} />
        </TabsContent>
        <TabsContent value="icps">
          <ICPList icps={icps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
