import { Focusable } from '@/components/shared/focusable';
import { MAX_WIDTH } from '@/lib/layout';
import { CONTACT_EMAIL } from '@/lib/services/config';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Terms of Service',
  description: 'Terms and conditions for using the Remes platform.',
  path: '/terms'
});

const SECTIONS = [
  {
    title: 'Acceptance of terms',
    content: [
      'By accessing or using Remes, you agree to be bound by these terms. If you do not agree, do not use the service.',
      'We may update these terms from time to time. Continued use after changes constitutes acceptance.'
    ]
  },
  {
    title: 'Description of service',
    content: [
      'Remes is an AI-powered outbound sales platform that detects buying signals, discovers contacts, and generates personalized outreach.',
      'The service is provided "as is" and may change as we develop new features and improve the product.'
    ]
  },
  {
    title: 'Your account',
    content: [
      'You must sign in with a valid Google account to use Remes.',
      'You are responsible for all activity that occurs under your account.',
      'You must not share your account or use the service for any unlawful purpose.'
    ]
  },
  {
    title: 'Acceptable use',
    content: [
      'You agree to use Remes only for lawful business purposes, including prospecting, outreach, and sales research.',
      'You must not use the service to send spam, harass recipients, or violate CAN-SPAM, GDPR, or other applicable laws.',
      'You must not attempt to reverse-engineer, scrape, or abuse the platform or its APIs.',
      'We reserve the right to suspend or terminate accounts that violate these terms.'
    ]
  },
  {
    title: 'Your content',
    content: [
      'You retain ownership of all content you create in Remes, including ICPs, research sessions, and email drafts.',
      'You grant us a limited license to store and process your content solely to provide the service.',
      'We do not claim ownership of your data and will not use it for purposes unrelated to operating Remes.'
    ]
  },
  {
    title: 'AI-generated content',
    content: [
      'Remes uses AI to generate outreach content, research summaries, and recommendations.',
      'AI-generated content may contain errors or inaccuracies. You are responsible for reviewing and approving all content before sending.',
      'We do not guarantee the accuracy, completeness, or effectiveness of AI-generated output.'
    ]
  },
  {
    title: 'Third-party data',
    content: [
      'Contact and company information provided through Remes is sourced from third-party providers and publicly available data.',
      'We do not guarantee the accuracy or completeness of third-party data.',
      'You are responsible for complying with all applicable laws when using contact information obtained through the service.'
    ]
  },
  {
    title: 'Limitation of liability',
    content: [
      'To the maximum extent permitted by law, Remes and its founders shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.',
      'Our total liability for any claim related to the service shall not exceed the amount you paid us in the 12 months preceding the claim.'
    ]
  },
  {
    title: 'Contact',
    content: [`If you have questions about these terms, contact us at ${CONTACT_EMAIL}.`]
  }
];

export default function TermsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className={`mx-auto w-full ${MAX_WIDTH} flex-1 px-6 pt-32 pb-24`}>
        <p className="text-landing-fg-muted mb-3 text-xs font-medium tracking-widest uppercase">
          Legal
        </p>
        <Focusable
          as="h1"
          className="text-landing-fg max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Terms of Service
        </Focusable>
        <p className="text-landing-fg-muted mt-3 text-sm">Last updated: April 3, 2026</p>

        <div className="mt-12 max-w-xl space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <Focusable as="h2" className="text-landing-fg mb-3 text-base font-semibold">
                {section.title}
              </Focusable>
              <ul className="text-landing-fg-secondary space-y-3 text-sm leading-relaxed">
                {section.content.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
