import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { serviceConfig } from '@/lib/services/config';
import { buildEmailGenerationPrompt } from '@/lib/prompts/email-generation';
import type {
  CompanyResult,
  TargetContact,
  ICPCriteria,
  GeneratedEmailSequence
} from '@/lib/types';

interface GenerateEmailRequest {
  company?: CompanyResult;
  contact?: TargetContact;
  icp?: ICPCriteria;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not set' }, { status: 500 });
  }

  const { company, contact, icp }: GenerateEmailRequest = await req.json();

  if (!company || !contact || !icp) {
    return Response.json({ error: 'company, contact, and icp are required' }, { status: 400 });
  }

  try {
    const anthropic = new Anthropic();
    const prompt = buildEmailGenerationPrompt(company, contact, icp);

    const message = await anthropic.messages.create({
      model: serviceConfig.emailModel,
      max_tokens: serviceConfig.emailMaxTokens,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: 'Failed to parse email response' }, { status: 500 });
    }

    const sequence: GeneratedEmailSequence = JSON.parse(jsonMatch[0]);

    if (!sequence.emails || sequence.emails.length !== 3) {
      return Response.json({ error: 'Invalid email sequence format' }, { status: 500 });
    }

    return Response.json(sequence);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'Failed to generate email';
    return Response.json({ error: errMessage }, { status: 500 });
  }
}
