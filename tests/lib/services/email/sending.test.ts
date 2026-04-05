import { mockSupabase } from '@/tests/helpers';

jest.mock('@/lib/services/gmail/client', () => ({
  getGmailClient: jest.fn(),
  sendEmail: jest.fn()
}));

jest.mock('@/lib/supabase/queries', () => ({
  insertSentEmail: jest.fn(),
  insertFailedEmail: jest.fn(),
  upsertContact: jest.fn()
}));

import { sendAndRecordEmail } from '@/lib/services/email/sending';
import { getGmailClient, sendEmail } from '@/lib/services/gmail/client';
import { insertSentEmail, insertFailedEmail, upsertContact } from '@/lib/supabase/queries';

const mockGetGmail = getGmailClient as jest.MockedFunction<typeof getGmailClient>;
const mockSend = sendEmail as jest.MockedFunction<typeof sendEmail>;
const mockInsertSent = insertSentEmail as jest.MockedFunction<typeof insertSentEmail>;
const mockInsertFailed = insertFailedEmail as jest.MockedFunction<typeof insertFailedEmail>;
const mockUpsert = upsertContact as jest.MockedFunction<typeof upsertContact>;

const params = {
  to: 'alice@acme.com',
  subject: 'Hello',
  body: 'Hi there',
  companyName: 'Acme',
  contactName: 'Alice'
};

beforeEach(() => {
  jest.clearAllMocks();
  mockGetGmail.mockResolvedValue({ gmail: {} as never, fromEmail: 'me@test.com' });
  mockSend.mockResolvedValue('msg-1');
  mockInsertSent.mockResolvedValue({ data: { id: 'email-1' }, error: null } as never);
  mockUpsert.mockResolvedValue({ data: null, error: null } as never);
  mockInsertFailed.mockResolvedValue({ data: null, error: null } as never);
});

describe('sendAndRecordEmail', () => {
  it('sends email, records success, and upserts contact', async () => {
    const supabase = mockSupabase();
    const result = await sendAndRecordEmail(supabase, 'user-123', params);

    expect(result.messageId).toBe('msg-1');
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockInsertSent).toHaveBeenCalledWith(
      supabase,
      expect.objectContaining({ status: 'sent', gmail_message_id: 'msg-1' })
    );
    expect(mockUpsert).toHaveBeenCalledWith(
      supabase,
      expect.objectContaining({ company_name: 'Acme', contact_email: 'alice@acme.com' })
    );
  });

  it('records failed email and re-throws on send failure', async () => {
    mockSend.mockRejectedValue(new Error('SMTP error'));
    const supabase = mockSupabase();

    await expect(sendAndRecordEmail(supabase, 'user-123', params)).rejects.toThrow('SMTP error');

    expect(mockInsertFailed).toHaveBeenCalledWith(
      supabase,
      expect.objectContaining({ status: 'failed', error_message: 'SMTP error' })
    );
    expect(mockInsertSent).not.toHaveBeenCalled();
  });

  it('skips contact upsert when companyName is empty', async () => {
    const supabase = mockSupabase();
    await sendAndRecordEmail(supabase, 'user-123', { ...params, companyName: '' });

    expect(mockUpsert).not.toHaveBeenCalled();
  });
});
