jest.mock('@/lib/supabase/server', () => ({ requireAuth: jest.fn() }));
jest.mock('@/lib/services/email/sending', () => ({
  sendAndRecordEmail: jest.fn()
}));

import { POST } from '@/app/api/emails/send/route';
import { requireAuth } from '@/lib/supabase/server';
import { sendAndRecordEmail } from '@/lib/services/email/sending';
import { mockAuthSuccess, mockAuthFailure, expectError } from '@/tests/helpers';

const mockAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockSend = sendAndRecordEmail as jest.MockedFunction<typeof sendAndRecordEmail>;

const validBody = {
  to: 'alice@acme.com',
  subject: 'Hello',
  body: 'Hi there',
  companyName: 'Acme',
  contactName: 'Alice'
};

beforeEach(() => jest.clearAllMocks());

describe('POST /api/emails/send', () => {
  it('returns 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(mockAuthFailure());
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody)
    });
    expect((await POST(req as never)).status).toBe(401);
  });

  it('returns messageId on success', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockSend.mockResolvedValue({ messageId: 'msg-1' });

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody)
    });

    const res = await POST(req as never);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.messageId).toBe('msg-1');
  });

  it('returns 500 with SEND_FAILED on service error', async () => {
    mockAuth.mockResolvedValue(mockAuthSuccess());
    mockSend.mockRejectedValue(new Error('Gmail failed'));

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody)
    });

    await expectError(await POST(req as never), 500, 'SEND_FAILED');
  });

  it('returns 400 on invalid body', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    mockAuth.mockResolvedValue(mockAuthSuccess());

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: 'not-email' })
    });

    await expectError(await POST(req as never), 400, 'VALIDATION_ERROR');
  });
});
