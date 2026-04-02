export const ROTATING_WORDS = [
  'funding rounds',
  'hiring surges',
  'new launches',
  'role changes',
  'growth signals'
];

export const SIGNALS: { source: string; example: string; color: string }[] = [
  {
    source: 'Job Openings',
    example: 'Currently hiring 3+ engineers with experience in Next.js',
    color: '#5643cc'
  },
  {
    source: 'News & Press',
    example: 'Faced cybersecurity attacks or data breach in the last 12 months',
    color: '#e5484d'
  },
  {
    source: 'Company Website',
    example: 'The company is SOC 2 Type 2 compliant',
    color: '#46e3b7'
  },
  {
    source: 'Job Descriptions',
    example:
      'Mentions building expense reports in Excel/Spreadsheet, in finance job openings in the past 2 years',
    color: '#f7c12b'
  },
  {
    source: 'Employee Activity',
    example:
      'Onboarded Data Engineer in the last 3 months, who mentioned Snowflake on their LinkedIn profile',
    color: '#2f7ad0'
  },
  {
    source: '10-K Reports',
    example: 'Mention HR initiatives to improve employee communication',
    color: '#673fd7'
  },
  {
    source: 'Funding Rounds',
    example: 'Raised Series B of $20M+ in the last 6 months',
    color: '#46e3b7'
  },
  {
    source: 'LinkedIn Posts',
    example: 'Going to cloud technology conferences',
    color: '#455eb5'
  },
  {
    source: 'Custom Signals',
    example:
      'Define any buying signal you can imagine. If you can describe it, Remes can detect it',
    color: 'custom'
  }
];

export const SHOWCASE = [
  {
    label: 'Signal Detection',
    title: 'Catch buying signals before your competitors',
    desc: 'Remes monitors job postings, funding rounds, and product launches across the web, surfacing the companies most likely to buy right now.',
    image: '/research-step-one.png'
  },
  {
    label: 'Contact Discovery',
    title: 'Find the right person instantly',
    desc: 'Automatically match signals to decision-makers with verified emails and LinkedIn profiles. No more guessing who to reach out to.',
    image: '/research-step-three.png'
  },
  {
    label: 'AI Outreach',
    title: 'Emails that actually get replies',
    desc: 'Every email is grounded in the signal that triggered it. Relevant, timely, and personal. Not another generic template.',
    image: '/research-step-five.png'
  }
];

export const FAQS = [
  {
    q: 'What is Remes and how does it work?',
    a: 'Remes is an AI-powered platform that detects real-time buying signals like hiring surges, funding rounds, leadership changes, and product launches, then uses them to craft deeply personalized outreach to your ideal customers. You describe your ideal customer, and Remes finds, researches, and engages them automatically.'
  },
  {
    q: 'How is Remes different from other outreach tools?',
    a: 'Most tools automate sending. Remes automates research. We detect real-time buying signals and use them to write emails that reference things happening at the prospect\'s company right now. The difference is an email that says "congrats on your funding" vs. one that knows you raised $8M from Craft to scale your GTM team.'
  },
  {
    q: 'What reply rate can I expect?',
    a: 'Reply rates vary by industry and offer, but our signal-driven approach consistently outperforms generic outreach by 3\u20135x. Most customers see meaningful pipeline activity by week 6.'
  },
  {
    q: 'How much does Remes cost compared to hiring?',
    a: 'Plans start at $1,497/month. A fully loaded sales hire costs $90K\u2013$150K/year, takes 3\u20136 months to ramp, and turns over at 39% annually. Remes starts producing pipeline in 2 weeks and never quits. One closed deal typically pays for the entire annual subscription.'
  },
  {
    q: 'What are buying signals?',
    a: 'Buying signals are real-time indicators that a company is ready to buy. Things like hiring surges, funding rounds, leadership changes, product launches, headcount growth, and LinkedIn activity from key decision-makers. Remes detects these automatically so you can reach prospects at the perfect moment.'
  },
  {
    q: 'What types of buying signals does Remes detect?',
    a: 'Anything you can describe. Typical buying signals include hiring surges, specific role postings, funding rounds, leadership changes and new executive hires, product launches and company announcements, headcount growth velocity, LinkedIn posts and engagement from key decision-makers, tech stack changes, and competitive movements. You are not limited to these categories.'
  },
  {
    q: 'Do you send emails from my account?',
    a: 'Yes. Remes sends through your connected email account via official APIs. Emails appear in your Sent folder, replies come to your inbox, and everything threads naturally. Your prospects never know a tool was involved.'
  },
  {
    q: 'How does Remes handle email deliverability?',
    a: 'Remes handles the full deliverability stack: dedicated domains, automated mailbox warmup (typically 2-3 weeks for new mailboxes), reputation monitoring, and sending controls, so you land in the primary inbox, not spam.'
  },
  {
    q: 'How is Remes different from ZoomInfo, Apollo, Instantly or Clay?',
    a: 'Apollo and ZoomInfo are contact databases: they find leads but do not research or write outreach. Instantly is a campaign tool: you have to import a lead list and manually create a campaign. Clay requires building automations from scratch with a credit system that burns fast. Remes replaces Clay + Apollo + Instantly with one tool.'
  },
  {
    q: 'Why is it called Remes?',
    a: "It's a reference to Hermes, the Greek god of commerce, trade, and messengers. He was the original messenger who always knew where to go, who to talk to, and exactly what to say. Fast forward to today, and the best sign that your outreach actually worked? Those two little letters in your inbox: RE:. Remes."
  }
];
