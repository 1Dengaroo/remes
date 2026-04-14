'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { connectGmail, disconnectGmail } from '@/lib/api';
import { useProfileStore } from '@/lib/store/profile-store';

export function ConnectionsTab() {
  const gmailConnected = useProfileStore((s) => s.gmailConnected);
  const gmailEmail = useProfileStore((s) => s.gmailEmail);
  const connectionsLoaded = useProfileStore((s) => s.connectionsLoaded);
  const setGmailStatus = useProfileStore((s) => s.setGmailStatus);
  const [disconnecting, setDisconnecting] = useState(false);

  return (
    <div>
      <p className="text-muted-foreground mb-4 text-sm">
        Connect your email to send outreach directly from Remes.
      </p>

      <div className="border-border flex items-center justify-between rounded-md border p-4">
        <div className="flex items-center gap-3">
          <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
            <Mail className="text-muted-foreground size-5" />
          </div>
          <div>
            <p className="text-foreground text-sm font-medium">Gmail</p>
            {!connectionsLoaded ? (
              <p className="text-muted-foreground text-xs">Checking...</p>
            ) : gmailConnected ? (
              <p className="text-muted-foreground flex items-center gap-1 text-xs">
                <CheckCircle className="text-primary size-3" />
                {gmailEmail}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">Not connected</p>
            )}
          </div>
        </div>

        {connectionsLoaded &&
          (gmailConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                setDisconnecting(true);
                try {
                  await disconnectGmail();
                  setGmailStatus(false, null);
                  toast.success('Gmail disconnected');
                } catch {
                  toast.error('Failed to disconnect Gmail');
                } finally {
                  setDisconnecting(false);
                }
              }}
              disabled={disconnecting}
            >
              {disconnecting && <Spinner />}
              Disconnect
            </Button>
          ) : (
            <Button size="sm" onClick={() => connectGmail()}>
              Connect Gmail
            </Button>
          ))}
      </div>
    </div>
  );
}
