import {
  parseBody,
  requireEnvVars,
  icpCriteriaSchema,
  profileUpdateBodySchema,
  emailSendBodySchema,
  createIcpBodySchema,
  parseIcpBodySchema,
  sessionCreateBodySchema,
  signatureCreateBodySchema
} from '@/lib/validation';

beforeEach(() => jest.spyOn(console, 'error').mockImplementation());
afterEach(() => jest.restoreAllMocks());

// ---------------------------------------------------------------------------
// parseBody
// ---------------------------------------------------------------------------

describe('parseBody', () => {
  it('returns success with valid data', () => {
    const result = parseBody(profileUpdateBodySchema, { full_name: 'Alice' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.full_name).toBe('Alice');
  });

  it('returns 400 response with error shape on invalid data', async () => {
    const result = parseBody(profileUpdateBodySchema, { full_name: 123 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.response.status).toBe(400);
      const body = await result.response.json();
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(typeof body.error.message).toBe('string');
    }
  });

  it('returns failure when required fields are missing', () => {
    const result = parseBody(profileUpdateBodySchema, {});
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// requireEnvVars
// ---------------------------------------------------------------------------

describe('requireEnvVars', () => {
  const original = process.env;

  beforeEach(() => {
    process.env = { ...original };
  });

  afterAll(() => {
    process.env = original;
  });

  it('returns null when all vars are present', () => {
    process.env.TEST_VAR = 'set';
    expect(requireEnvVars('TEST_VAR')).toBeNull();
  });

  it('returns 500 response with SERVICE_UNAVAILABLE when vars are missing', async () => {
    delete process.env.MISSING_VAR;
    const response = requireEnvVars('MISSING_VAR');
    expect(response).not.toBeNull();
    expect(response!.status).toBe(500);
    const body = await response!.json();
    expect(body.error.code).toBe('SERVICE_UNAVAILABLE');
  });

  it('does not leak env var names to client', async () => {
    delete process.env.SECRET_KEY;
    const response = requireEnvVars('SECRET_KEY');
    const body = await response!.json();
    expect(body.error.message).not.toContain('SECRET_KEY');
  });
});

// ---------------------------------------------------------------------------
// icpCriteriaSchema
// ---------------------------------------------------------------------------

describe('icpCriteriaSchema', () => {
  const validIcp = {
    description: 'B2B SaaS companies',
    industry_keywords: ['saas'],
    min_employees: 10,
    max_employees: 500,
    min_funding_amount: null,
    funding_stages: [],
    hiring_signals: [],
    tech_keywords: [],
    company_examples: [],
    locations: []
  };

  it('accepts valid ICP', () => {
    expect(icpCriteriaSchema.safeParse(validIcp).success).toBe(true);
  });

  it('defaults locations to empty array', () => {
    const { locations: _, ...withoutLocations } = validIcp;
    const result = icpCriteriaSchema.safeParse(withoutLocations);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.locations).toEqual([]);
  });

  it('rejects oversized description', () => {
    expect(
      icpCriteriaSchema.safeParse({ ...validIcp, description: 'x'.repeat(5001) }).success
    ).toBe(false);
  });

  it('rejects too many industry keywords', () => {
    expect(
      icpCriteriaSchema.safeParse({ ...validIcp, industry_keywords: Array(51).fill('kw') }).success
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// emailSendBodySchema
// ---------------------------------------------------------------------------

describe('emailSendBodySchema', () => {
  const validEmail = {
    to: 'test@example.com',
    subject: 'Hello',
    body: 'Body text',
    companyName: 'Acme',
    contactName: 'Alice'
  };

  it('accepts valid email', () => {
    expect(emailSendBodySchema.safeParse(validEmail).success).toBe(true);
  });

  it('rejects invalid email address', () => {
    expect(emailSendBodySchema.safeParse({ ...validEmail, to: 'not-an-email' }).success).toBe(
      false
    );
  });

  it('rejects empty subject', () => {
    expect(emailSendBodySchema.safeParse({ ...validEmail, subject: '' }).success).toBe(false);
  });

  it('accepts optional sessionId', () => {
    expect(emailSendBodySchema.safeParse({ ...validEmail, sessionId: 'abc-123' }).success).toBe(
      true
    );
  });
});

// ---------------------------------------------------------------------------
// createIcpBodySchema
// ---------------------------------------------------------------------------

describe('createIcpBodySchema', () => {
  it('rejects empty name', () => {
    expect(
      createIcpBodySchema.safeParse({
        name: '',
        icp: {
          description: 'test',
          industry_keywords: [],
          min_employees: null,
          max_employees: null,
          min_funding_amount: null,
          funding_stages: [],
          hiring_signals: [],
          tech_keywords: [],
          company_examples: []
        }
      }).success
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// parseIcpBodySchema
// ---------------------------------------------------------------------------

describe('parseIcpBodySchema', () => {
  it('accepts non-empty input', () => {
    expect(parseIcpBodySchema.safeParse({ input: 'B2B SaaS in fintech' }).success).toBe(true);
  });

  it('rejects empty input', () => {
    expect(parseIcpBodySchema.safeParse({ input: '' }).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// sessionCreateBodySchema
// ---------------------------------------------------------------------------

describe('sessionCreateBodySchema', () => {
  it('accepts empty object', () => {
    expect(sessionCreateBodySchema.safeParse({}).success).toBe(true);
  });

  it('accepts optional name', () => {
    const result = sessionCreateBodySchema.safeParse({ name: 'My session' });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// signatureCreateBodySchema
// ---------------------------------------------------------------------------

describe('signatureCreateBodySchema', () => {
  it('accepts valid signature', () => {
    expect(signatureCreateBodySchema.safeParse({ name: 'Default', body: 'Best,' }).success).toBe(
      true
    );
  });

  it('rejects empty name', () => {
    expect(signatureCreateBodySchema.safeParse({ name: '', body: 'Best,' }).success).toBe(false);
  });

  it('rejects empty body', () => {
    expect(signatureCreateBodySchema.safeParse({ name: 'Default', body: '' }).success).toBe(false);
  });
});
