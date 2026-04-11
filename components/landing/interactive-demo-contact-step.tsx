import { CONTACTS } from './mock-dashboard-data';

type Contact = (typeof CONTACTS)[number];

export function ContactStep({
  contacts,
  enrichedCount
}: {
  contacts: Contact[];
  enrichedCount: number;
}) {
  return (
    <div className="p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
          Decision-makers
        </span>
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {enrichedCount} of {contacts.length} enriched
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {contacts.map((c, i) => {
          const isEnriched = i < enrichedCount;
          const justRevealed = isEnriched && !c.enriched;

          return (
            <div
              key={c.name}
              className="flex items-center gap-3 rounded-lg px-4 py-3"
              style={{
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card)',
                opacity: isEnriched ? 1 : 0.5,
                transition: 'opacity 300ms ease-out'
              }}
            >
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'var(--muted)',
                  color: 'var(--muted-foreground)'
                }}
              >
                {c.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: isEnriched ? 'var(--foreground)' : 'var(--muted-foreground)',
                      opacity: isEnriched ? 1 : 0.4,
                      transition: 'color 300ms, opacity 300ms'
                    }}
                  >
                    {isEnriched ? c.name : c.name.replace(/(\s\w)\w+$/, '$1***')}
                  </span>
                  {justRevealed && (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--signal-funding-bg)',
                        color: 'var(--signal-funding-text)'
                      }}
                    >
                      New
                    </span>
                  )}
                </div>
                <span className="mt-0.5 block text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {c.title} at {c.company}
                </span>
              </div>

              <span
                className="hidden shrink-0 text-xs sm:block"
                style={{
                  color: 'var(--muted-foreground)',
                  opacity: isEnriched ? 1 : 0,
                  transition: 'opacity 0.3s'
                }}
              >
                {c.email}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
