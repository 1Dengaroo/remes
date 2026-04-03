import { MAX_WIDTH } from '@/lib/layout';
import { createMetadata } from '@/lib/metadata';
import { CONTACT_EMAIL } from '@/lib/services/config';

export const metadata = createMetadata({
  title: 'About',
  description:
    "We're building the outbound sales platform we wish existed. Meet the team behind Remes.",
  path: '/about'
});

export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className={`mx-auto w-full ${MAX_WIDTH} flex-1 px-6 pt-32 pb-24`}>
        <p className="text-landing-fg-muted mb-3 text-xs font-medium tracking-widest uppercase">
          About
        </p>
        <h1
          className="text-landing-fg max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ textWrap: 'balance' }}
        >
          We&apos;re building the outbound sales platform we wish existed.
        </h1>

        <div className="text-landing-fg-secondary mt-12 max-w-xl space-y-6 text-sm leading-relaxed">
          <p>
            Outbound sales is broken. The best teams still stitch together five tools, manually
            research every account, and send emails that read like they were written by a stranger.
            Because they were.
          </p>
          <p>
            We started Remes because we believed the entire workflow, from finding the right company
            to writing the first email, could be one thing. Not a pipeline of disconnected products.
            One system that understands who you sell to and does the work.
          </p>
          <p>
            Remes monitors buying signals in real time: funding rounds, hiring surges, leadership
            changes, product launches. It maps decision-makers at every account and writes outreach
            grounded in what&apos;s actually happening at their company. Not templates. Research.
          </p>
          <p>
            We&apos;re a small team. We ship fast and talk to every customer. If you want to see
            what we&apos;re building,{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-landing-fg-secondary hover:text-landing-fg underline underline-offset-3 transition-colors duration-150"
            >
              reach out
            </a>
            .
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-6 sm:flex-row sm:gap-12">
          <div>
            <a
              href="mailto:kenny@remes.so"
              className="text-landing-fg-secondary hover:text-landing-fg text-sm font-medium transition-colors duration-150"
            >
              kenny@remes.so
            </a>
            <p className="text-landing-fg-muted mt-1 text-xs">Co-Founder &amp; Product</p>
          </div>
          <div>
            <a
              href="mailto:andy@remes.so"
              className="text-landing-fg-secondary hover:text-landing-fg text-sm font-medium transition-colors duration-150"
            >
              andy@remes.so
            </a>
            <p className="text-landing-fg-muted mt-1 text-xs">Co-Founder &amp; Engineering</p>
          </div>
        </div>
      </div>
    </div>
  );
}
