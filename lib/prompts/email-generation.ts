import type { CompanyResult, TargetContact, ICPCriteria } from '@/lib/types';

export function buildEmailGenerationPrompt(
  company: CompanyResult,
  contact: TargetContact,
  icp: ICPCriteria,
  senderFirstName?: string
): string {
  const signals = company.signals
    .slice(0, 3)
    .map((s) => `- ${s.type}: ${s.title}`)
    .join('\n');
  const firstName = contact.name.split(' ')[0];
  const sender = senderFirstName ?? '[Your name]';

  return `Write a 3-email cold outreach sequence to ${contact.name} (${contact.title}) at ${company.company_name}.

CONTEXT:
- Industry: ${company.industry} | Funding: ${company.funding_stage} (${company.amount_raised})
- Overview: ${company.company_overview}
- Signals:
${signals}
- Sender sells: ${icp.description}

RULES:
- Peer tone, not salesperson. Brief, casual, helpful.
- No buzzwords, no "I hope this finds you well", no "I noticed that", no "I'd love to"
- Never ask for a meeting or demo. End with a low-friction question.
- Short, intriguing subject lines.

EMAIL 1 (under 120 words): "Hey ${firstName}," → specific observation about their company → tie to a challenge → position sender's product → low-friction question → "Best, ${sender}"

EMAIL 2 (under 45 words): "Hey ${firstName} —" reply in same thread (subject: "Re: [email 1 subject]") → different angle → soft offer → "Best, ${sender}"

EMAIL 3 (under 60 words): "Hey ${firstName}," reply in same thread → yet another angle (cost, speed, DX) → simple question → "Best, ${sender}"

Return ONLY valid JSON:
{"emails":[{"subject":"...","body":"..."},{"subject":"Re: ...","body":"..."},{"subject":"Re: ...","body":"..."}]}`;
}
