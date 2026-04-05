import type { ContactedCompany } from '@/lib/types';
import { ApiError } from './client';

export async function listContactedCompanies(): Promise<ContactedCompany[]> {
  const response = await fetch('/api/contacts');
  if (!response.ok) throw new ApiError('Failed to load contacts', response.status);
  const data = (await response.json()) as { contacts: ContactedCompany[] };
  return data.contacts;
}
