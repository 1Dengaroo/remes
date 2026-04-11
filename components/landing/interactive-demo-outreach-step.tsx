import { EMAILS } from './mock-dashboard-data';

export function OutreachStep({
  streamedText,
  isStreaming
}: {
  streamedText: string;
  isStreaming: boolean;
}) {
  const email = EMAILS[0];

  return (
    <div className="p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Ramp
          </span>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            James Park &middot; VP of Sales
          </span>
        </div>
        <div className="flex gap-1">
          {EMAILS.map((_, i) => (
            <span
              key={i}
              className="rounded-md px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: i === 0 ? 'var(--primary)' : 'var(--muted)',
                color: i === 0 ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
              }}
            >
              Email {i + 1}
            </span>
          ))}
        </div>
      </div>

      <div
        className="mb-4 rounded-lg"
        style={{
          border: '1px solid var(--border)',
          backgroundColor: 'var(--card)'
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-2.5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            To
          </span>
          <span className="text-xs" style={{ color: 'var(--foreground)' }}>
            james.p@ramp.com
          </span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5">
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Subject
          </span>
          <span className="text-xs" style={{ color: 'var(--foreground)' }}>
            {email.subject}
          </span>
        </div>
      </div>

      <div
        className="rounded-lg px-4 py-3"
        style={{
          border: '1px solid var(--border)',
          backgroundColor: 'var(--card)'
        }}
      >
        <div
          className="min-h-35 text-xs leading-relaxed whitespace-pre-line"
          style={{ color: 'var(--foreground)' }}
        >
          {streamedText}
          {isStreaming && (
            <span
              className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse align-middle"
              style={{ backgroundColor: 'var(--primary)' }}
            />
          )}
        </div>

        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Plain text &middot; Under 80 words &middot; Signal-led opener
          </span>
        </div>
      </div>
    </div>
  );
}
