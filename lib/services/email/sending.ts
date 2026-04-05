import type { SupabaseClient } from '@supabase/supabase-js';
import { getGmailClient, sendEmail } from '../gmail/client';
import { insertSentEmail, insertFailedEmail, upsertContact } from '@/lib/supabase/queries';

interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  companyName: string;
  contactName: string;
  sessionId?: string;
}

/**
 * Send an email via Gmail, record the result in the audit trail,
 * and upsert the contacted company. On failure, records the failed
 * attempt and re-throws so the caller can handle the HTTP response.
 */
export async function sendAndRecordEmail(
  supabase: SupabaseClient,
  userId: string,
  params: SendEmailParams
): Promise<{ messageId: string }> {
  const { to, subject, body, companyName, contactName, sessionId } = params;

  try {
    const { gmail, fromEmail } = await getGmailClient(userId);
    const messageId = await sendEmail(gmail, to, subject, body, fromEmail);

    const { data: sentEmail } = await insertSentEmail(supabase, {
      user_id: userId,
      recipient_email: to,
      recipient_name: contactName,
      subject,
      body,
      company_name: companyName,
      contact_name: contactName,
      status: 'sent',
      gmail_message_id: messageId,
      session_id: sessionId ?? null
    });

    if (companyName && to) {
      await upsertContact(supabase, {
        user_id: userId,
        company_name: companyName,
        contact_email: to,
        contact_name: contactName,
        session_id: sessionId ?? null,
        sent_email_id: sentEmail?.id ?? null
      });
    }

    return { messageId };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to send email';

    await insertFailedEmail(supabase, {
      user_id: userId,
      recipient_email: to,
      recipient_name: contactName,
      subject,
      body,
      company_name: companyName,
      contact_name: contactName,
      status: 'failed',
      error_message: errorMessage,
      session_id: sessionId ?? null
    });

    throw err;
  }
}
