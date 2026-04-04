import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { SentEmail } from '@/lib/types';

export function EmailDetailContent({ email }: { email: SentEmail }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">To</label>
          <div className="text-foreground bg-muted/50 border-border rounded-md border px-3 py-2 text-sm">
            {email.recipient_email}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">Subject</label>
          <div className="text-foreground bg-muted/50 border-border rounded-md border px-3 py-2 text-sm">
            {email.subject}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-1.5">
        <label className="text-muted-foreground text-xs font-medium">Body</label>
        <div className="text-foreground bg-muted/50 border-border flex-1 overflow-y-auto rounded-md border px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap">
          {email.body}
        </div>
      </div>
      {email.session_id && (
        <Link
          href={`/research/${email.session_id}`}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          <ExternalLink className="size-3" />
          View Session
        </Link>
      )}
      {email.error_message && (
        <p className="text-destructive text-xs">Error: {email.error_message}</p>
      )}
    </div>
  );
}
