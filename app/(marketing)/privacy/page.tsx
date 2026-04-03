import { MAX_WIDTH } from '@/lib/layout';
import { CONTACT_EMAIL } from '@/lib/services/config';
import { createMetadata } from '@/lib/metadata';

export const metadata = createMetadata({
  title: 'Privacy Policy',
  description: 'How Remes collects, uses, and protects your data.',
  path: '/privacy'
});

const SECTIONS = [
  {
    title: 'Information we collect',
    content: [
      'Account information: When you sign up via Google OAuth, we receive your name, email address, and profile photo from Google. We do not receive or store your Google password.',
      'Usage data: We collect information about how you interact with Remes, including pages visited, features used, and session duration.',
      'Research data: The ideal customer profiles, company lists, and outreach content you create within Remes are stored to provide the service.',
      'Email integration: If you connect your Gmail account for sending outreach, we request only the minimum scopes needed to send emails on your behalf. We do not read your inbox.'
    ]
  },
  {
    title: 'How we use your information',
    content: [
      'To provide and maintain the Remes platform, including signal detection, contact discovery, and outreach generation.',
      'To authenticate your identity and secure your account.',
      'To improve our product based on aggregate usage patterns.',
      'We do not sell your personal information to third parties.'
    ]
  },
  {
    title: 'Third-party services',
    content: [
      'Supabase: Authentication and database hosting.',
      'Anthropic: AI-powered content generation. Your prompts and ICP data may be sent to Anthropic\u2019s API to generate outreach. Anthropic does not use API inputs for training.',
      'Apollo: Contact and company data enrichment. Company names and domains may be sent to Apollo to retrieve publicly available business information.',
      'Vercel: Application hosting and analytics.',
      'Google OAuth: Authentication only. We request the minimum scopes necessary.'
    ]
  },
  {
    title: 'Data retention',
    content: [
      'Your account data and research sessions are retained as long as your account is active.',
      'You can request deletion of your account and all associated data by contacting us at the email below.',
      'We will delete your data within 30 days of a verified request.'
    ]
  },
  {
    title: 'Security',
    content: [
      'We use industry-standard measures to protect your data, including encrypted connections (TLS), secure authentication via OAuth, and access controls on our infrastructure.',
      'No method of transmission or storage is 100% secure. If you discover a vulnerability, please contact us immediately.'
    ]
  },
  {
    title: 'Changes to this policy',
    content: [
      'We may update this policy from time to time. We will notify you of material changes by posting the updated policy on this page with a revised date.',
      'Continued use of Remes after changes constitutes acceptance of the updated policy.'
    ]
  },
  {
    title: 'Contact',
    content: [
      `If you have questions about this privacy policy or your data, contact us at ${CONTACT_EMAIL}.`
    ]
  }
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className={`mx-auto w-full ${MAX_WIDTH} flex-1 px-6 pt-32 pb-24`}>
        <p className="text-landing-fg-muted mb-3 text-xs font-medium tracking-widest uppercase">
          Legal
        </p>
        <h1 className="text-landing-fg max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-landing-fg-muted mt-3 text-sm">Last updated: April 3, 2026</p>

        <div className="mt-12 max-w-xl space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-landing-fg mb-3 text-base font-semibold">{section.title}</h2>
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
