import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/supabase/server';
import { getGmailClient, sendEmail } from '@/lib/services/gmail';
import { emailSendBodySchema, parseBody } from '@/lib/validation';
import { insertSentEmail, insertFailedEmail, upsertContact } from '@/lib/supabase/queries';

export async function POST(req: NextRequest) {
  const { supabase, user } = await getAuthUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = parseBody(emailSendBodySchema, await req.json());
  if (!parsed.success) return parsed.response;

  const { to, subject, body: emailBody, companyName, contactName, sessionId } = parsed.data;

  try {
    const { gmail, fromEmail } = await getGmailClient(user.id);
    const messageId = await sendEmail(gmail, to, subject, emailBody, fromEmail);

    const { data: sentEmail } = await insertSentEmail(supabase, {
      user_id: user.id,
      recipient_email: to,
      recipient_name: contactName,
      subject,
      body: emailBody,
      company_name: companyName,
      contact_name: contactName,
      status: 'sent',
      gmail_message_id: messageId,
      session_id: sessionId ?? null
    });

    if (companyName && to) {
      await upsertContact(supabase, {
        user_id: user.id,
        company_name: companyName,
        contact_email: to,
        contact_name: contactName,
        session_id: sessionId ?? null,
        sent_email_id: sentEmail?.id ?? null
      });
    }

    return Response.json({ success: true, messageId });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to send email';

    await insertFailedEmail(supabase, {
      user_id: user.id,
      recipient_email: to,
      recipient_name: contactName,
      subject,
      body: emailBody,
      company_name: companyName,
      contact_name: contactName,
      status: 'failed',
      error_message: errorMessage,
      session_id: sessionId ?? null
    });

    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
