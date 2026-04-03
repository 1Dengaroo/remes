'use client';

import { useEffect, useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONTACT_EMAIL } from '@/lib/services/config';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { disconnectGmail } from '@/lib/api';
import { useProfileStore } from '@/lib/store/profile-store';

export function ConnectionsTab() {
  const gmailConnected = useProfileStore((s) => s.gmailConnected);
  const gmailEmail = useProfileStore((s) => s.gmailEmail);
  const connectionsLoaded = useProfileStore((s) => s.connectionsLoaded);
  const setGmailStatus = useProfileStore((s) => s.setGmailStatus);
  const loadConnections = useProfileStore((s) => s.loadConnections);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

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
              {disconnecting && <Loader2 className="size-3.5 animate-spin" />}
              Disconnect
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm">Connect Gmail</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Request email sending access</AlertDialogTitle>
                  <AlertDialogDescription>
                    Our Gmail integration is undergoing Google&apos;s CASA security verification
                    process to ensure the highest standards of data protection. During this review
                    period, email access is provisioned on a per-account basis. Contact{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-primary underline underline-offset-2"
                    >
                      {CONTACT_EMAIL}
                    </a>{' '}
                    to request access.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction size="sm">Got it</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}
      </div>
    </div>
  );
}
