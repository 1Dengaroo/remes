import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/supabase/server';
import { emailSendBodySchema, parseBody } from '@/lib/validation';
import { sendAndRecordEmail } from '@/lib/services/email/sending';

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { supabase, user } = auth;

  const parsed = parseBody(emailSendBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  try {
    const { messageId } = await sendAndRecordEmail(supabase, user.id, parsed.data);
    return Response.json({ success: true, messageId });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send email';
    return Response.json({ error: { code: 'SEND_FAILED', message } }, { status: 500 });
  }
}
