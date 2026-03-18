import type { CompanyResult, TargetContact, ICPCriteria } from '@/lib/types';

export function buildEmailGenerationPrompt(
  company: CompanyResult,
  contact: TargetContact,
  icp: ICPCriteria
): string {
  const signalsSummary = company.signals.map((s) => `- ${s.type}: ${s.title}`).join('\n');
  const contactFirstName = contact.name.split(' ')[0];

  return `You are writing a 3-email cold outreach sequence to ${contact.name} (${contact.title}) at ${company.company_name}.

CONTEXT:
- Company: ${company.company_name}
- Industry: ${company.industry}
- Overview: ${company.company_overview}
- Funding: ${company.funding_stage} (${company.amount_raised})
- Buying signals detected:
${signalsSummary}
- Email hook (use as inspiration): ${company.email_hook}
- What the sender sells: ${icp.description}

TONE RULES (apply to ALL emails):
- Sound like a peer sharing something useful, NOT a salesperson pitching
- Brief, casual, helpful — never pushy or overly enthusiastic
- No buzzwords, no "I hope this finds you well", no "I noticed that", no "I'd love to"
- No "excited", no "thrilled", no "game-changing", no "revolutionize"
- Do NOT ask for a meeting or demo in any email
- End with a simple, low-friction question
- Subject lines should be short and intriguing, not descriptive

STEP 1 — Full email (under 120 words):
- Write the entire email body including "Hey ${contactFirstName}," greeting and sign-off (just sender first name, no title or company)
- Open with a specific observation about their company: a hiring signal, growth pattern, or news — something that shows you actually looked
- Tie that observation to a likely challenge or pain point they face
- Position the sender's product as relevant to that challenge in 1-2 sentences
- End with a low-friction question (NOT "want to chat?" or "can I get 15 min?")
- Use "Best," or similar casual sign-off, then a placeholder line "[Your name]"

STEP 2 — Follow-up (under 45 words):
- Include "Hey ${contactFirstName} —" greeting
- This is a reply in the same thread, so the subject should be "Re: [step 1 subject]"
- Keep the same casual structure as: "Hey ${contactFirstName} — did this land on your radar? Happy to share how teams like X use [product] to [outcome]."
- Do NOT repeat the same angle from step 1
- Do NOT ask for a meeting
- End naturally, optionally with a soft offer to share more
- Sign off with "Best," and "[Your name]"

STEP 3 — Follow-up (under 60 words):
- Include "Hey ${contactFirstName}," greeting
- This is a reply in the same thread, so the subject should be "Re: [step 1 subject]"
- Try a different angle from steps 1 and 2: cost savings, developer experience, speed, or a different use case
- Keep it casual, 2-3 sentences max
- End with a simple question, NOT a meeting ask
- Sign off with "Best," and "[Your name]"

Return ONLY valid JSON with this exact shape:
{
  "emails": [
    { "subject": "short intriguing subject", "body": "step 1 full email body" },
    { "subject": "Re: same subject", "body": "step 2 follow-up body" },
    { "subject": "Re: same subject", "body": "step 3 follow-up body" }
  ]
}`;
}
