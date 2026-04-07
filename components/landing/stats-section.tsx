const STATS = [
  { value: '100K+', label: 'Signals detected' },
  { value: '50K+', label: 'Contacts enriched' },
  { value: '25K+', label: 'Emails generated' },
  { value: '47%', label: 'Average reply rate' }
];

export function StatsSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-(--landing-border-card)">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-landing-fg text-3xl font-bold tracking-tight sm:text-4xl">
              {stat.value}
            </p>
            <p className="text-landing-fg-muted mt-1 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
