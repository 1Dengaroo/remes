const LOGOS = ['Ashby', 'Lattice', 'Ramp', 'Notion', 'Linear', 'Vercel', 'Stripe', 'Figma'];

function LogoPill({ name }: { name: string }) {
  return (
    <div className="text-landing-fg-muted flex shrink-0 items-center gap-2 rounded-full bg-(--landing-skel-base) px-5 py-2.5 text-sm font-medium">
      <div className="size-5 rounded bg-(--landing-skel-base)" />
      {name}
    </div>
  );
}

export function LogoCarousel() {
  return (
    <section className="py-16 sm:py-20">
      <p className="text-landing-fg-muted mb-8 text-center text-xs font-medium tracking-widest uppercase">
        Trusted by sales teams at
      </p>
      <div className="relative overflow-hidden">
        <div className="flex animate-[scroll_30s_linear_infinite] gap-4">
          {[...LOGOS, ...LOGOS].map((name, i) => (
            <LogoPill key={i} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
