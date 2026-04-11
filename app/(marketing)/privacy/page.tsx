import { MAX_WIDTH } from '@/lib/layout';
import { CONTACT_EMAILS } from '@/lib/services/config';
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
      'Email integration: If you connect your Gmail account for sending outreach, we request only the gmail.send scope to send emails on your behalf. We do not read, modify, or delete your inbox. See the Google user data section below for full details.'
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
    title: 'Google user data',
    content: [
      'Access: If you connect your Gmail account, Remes requests only the gmail.send scope, which permits sending emails on your behalf. We also receive your email address through Google\u2019s OpenID Connect email scope during sign-in. We do not request access to read, modify, or delete your emails or any other Gmail data.',
      'Use: Your Gmail connection is used solely to send outreach emails that you compose or review within Remes. We do not use your Google user data for advertising, market research, or any purpose unrelated to providing the Remes service.',
      'Storage: Your OAuth access token, refresh token, and Gmail email address are stored in a secure database with row-level security, ensuring only your account can access your credentials. Tokens are encrypted in transit via TLS.',
      'Sharing: We do not share your Google user data with any third party. Your Gmail credentials are used exclusively to send emails through the Gmail API on your behalf.',
      'Deletion: You can disconnect your Gmail account at any time from your Remes settings. Disconnecting immediately deletes all stored tokens and revokes access. You may also request full account deletion by contacting us.',
      'Remes\u2019s use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.'
    ]
  },
  {
    title: 'Third-party services',
    content: [
      'Supabase: Authentication and database hosting.',
      'Anthropic: AI-powered content generation. Your prompts and ICP data may be sent to Anthropic\u2019s API to generate outreach. Anthropic does not use API inputs for training.',
      'Apollo: Contact and company data enrichment. Company names and domains may be sent to Apollo to retrieve publicly available business information.',
      'Vercel: Application hosting and analytics.',
      'Google: Gmail API for sending emails on your behalf (gmail.send scope only). See the Google user data section above for full details.'
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
      `If you have questions about this privacy policy or your data, contact us at ${CONTACT_EMAILS.privacy}.`
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
