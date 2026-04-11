import { COMPANIES } from './mock-dashboard-data';

const SIGNAL_LABELS: Record<string, string> = {
  job_posting: 'Job',
  funding: 'Funding',
  news: 'News',
  product_launch: 'Launch'
};

const SIGNAL_TOKEN: Record<string, string> = {
  job_posting: 'job',
  funding: 'funding',
  news: 'news',
  product_launch: 'product'
};

export function SignalStep({ visibleCount }: { visibleCount: number }) {
  return (
    <div className="p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="size-2 rounded-full"
            style={{
              backgroundColor: visibleCount > 0 ? 'var(--signal-funding-text)' : 'var(--border)',
              boxShadow: visibleCount > 0 ? '0 0 6px var(--signal-funding-bg)' : 'none'
            }}
          />
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
            {visibleCount > 0 ? `${visibleCount} companies matched` : 'Scanning...'}
          </span>
        </div>
        <span
          className="rounded-md px-2 py-0.5 text-xs"
          style={{
            backgroundColor: 'var(--muted)',
            color: 'var(--muted-foreground)'
          }}
        >
          B2B SaaS &middot; 50-500 employees
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {COMPANIES.map((c, i) => {
          const visible = i < visibleCount;
          return (
            <div
              key={c.name}
              className="rounded-lg px-4 py-3"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 400ms ease-out, transform 400ms ease-out',
                border: '1px solid var(--border)',
                backgroundColor:
                  c.score >= 9
                    ? 'rgba(16, 185, 129, 0.04)'
                    : c.score >= 8
                      ? 'rgba(59, 130, 246, 0.04)'
                      : 'var(--card)',
                boxShadow: `inset 3px 0 0 var(--signal-${SIGNAL_TOKEN[c.signals[0].type]}-text)`
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)'
                  }}
                >
                  {c.name.slice(0, 2)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      {c.name}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {c.industry}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      &middot;
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {c.funding}
                    </span>
                  </div>
                  <div
                    className="mt-0.5 text-xs leading-relaxed italic"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {c.matchReason}
                  </div>
                </div>

                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold"
                  style={{
                    backgroundColor:
                      c.score >= 9 ? 'var(--signal-funding-bg)' : 'var(--signal-news-bg)',
                    color: c.score >= 9 ? 'var(--signal-funding-text)' : 'var(--signal-news-text)'
                  }}
                >
                  {c.score}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {c.signals.map((s, j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <span
                      className="rounded px-1.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: `var(--signal-${SIGNAL_TOKEN[s.type]}-bg)`,
                        color: `var(--signal-${SIGNAL_TOKEN[s.type]}-text)`
                      }}
                    >
                      {SIGNAL_LABELS[s.type]}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
