import { NextRequest } from 'next/server';
import { withAuth, jsonError, parseBody } from '@/lib/route-utils';
import { emailSendBodySchema, sendAndRecordEmail } from '@/lib/services/email';
import { getErrorMessage } from '@/lib/utils';

export const POST = (req: NextRequest) =>
  withAuth(async (supabase, user) => {
    const parsed = parseBody(emailSendBodySchema, await req.json());
    if (!parsed.success) return parsed.response;

    try {
      const { messageId } = await sendAndRecordEmail(supabase, user.id, parsed.data);
      return Response.json({ success: true, messageId });
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to send email');
      return jsonError('SEND_FAILED', message, 500);
    }
  });
