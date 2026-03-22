import { getAuthUser } from '@/lib/supabase/server';

export async function GET() {
  const { supabase, user } = await getAuthUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const uid = user.id;

  const [sessionsRes, emailsRes, contactedRes] = await Promise.all([
    supabase
      .from('research_sessions')
      .select('id, status, results, candidates, selected_companies, created_at')
      .eq('user_id', uid),
    supabase.from('sent_emails').select('id, status, company_name, created_at').eq('user_id', uid),
    supabase.from('contacted_companies').select('company_name').eq('user_id', uid)
  ]);

  const sessions = sessionsRes.data ?? [];
  const emails = emailsRes.data ?? [];
  const contacted = contactedRes.data ?? [];

  const contactedSet = new Set(contacted.map((c) => c.company_name));

  let companiesResearched = 0;
  const signalCounts: Record<string, number> = {};
  const uncontactedCompanies: {
    name: string;
    session_id: string;
    website: string | null;
    logo_url: string | null;
  }[] = [];
  const seenUncontacted = new Set<string>();

  for (const session of sessions) {
    const results = Array.isArray(session.results) ? session.results : [];
    const candidates = Array.isArray(session.candidates) ? session.candidates : [];
    companiesResearched += results.length;

    // Build a lookup from candidates for website/logo
    const candidateMap = new Map<string, { website?: string; logo_url?: string }>();
    for (const c of candidates) {
      const cn = c as { name?: string; website?: string; logo_url?: string };
      if (cn.name) candidateMap.set(cn.name, cn);
    }

    for (const result of results) {
      const r = result as {
        company_name?: string;
        website?: string;
        logo_url?: string;
        signals?: { type: string }[];
      };

      if (Array.isArray(r.signals)) {
        for (const signal of r.signals) {
          signalCounts[signal.type] = (signalCounts[signal.type] ?? 0) + 1;
        }
      }

      if (
        r.company_name &&
        !contactedSet.has(r.company_name) &&
        !seenUncontacted.has(r.company_name)
      ) {
        seenUncontacted.add(r.company_name);
        const candidate = candidateMap.get(r.company_name);
        uncontactedCompanies.push({
          name: r.company_name,
          session_id: session.id,
          website: r.website ?? candidate?.website ?? null,
          logo_url: r.logo_url ?? candidate?.logo_url ?? null
        });
      }
    }
  }

  const emailsSent = emails.filter((e) => e.status === 'sent').length;
  const emailsFailed = emails.filter((e) => e.status === 'failed').length;

  const now = new Date();
  const weeklyEmails: { week: string; count: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - i * 7);

    const count = emails.filter((e) => {
      const d = new Date(e.created_at);
      return e.status === 'sent' && d >= weekStart && d < weekEnd;
    }).length;

    weeklyEmails.push({
      week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count
    });
  }

  const topSignals = Object.entries(signalCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));

  return Response.json({
    funnel: {
      sessions: sessions.length,
      companies_researched: companiesResearched,
      companies_contacted: contactedSet.size,
      emails_sent: emailsSent,
      emails_failed: emailsFailed
    },
    weekly_emails: weeklyEmails,
    top_signals: topSignals,
    uncontacted: uncontactedCompanies.slice(0, 10)
  });
}
