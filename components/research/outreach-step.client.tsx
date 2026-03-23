'use client';

import { useState, useMemo } from 'react';
import { Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmailEditorInline } from './email-editor-inline.client';
import { useResearchStore } from '@/lib/store/research-store';
import type { CompanyResult, ComposeEmailParams, TargetContact, ICPCriteria } from '@/lib/types';

const EMPTY_ICP: ICPCriteria = {
  description: '',
  industry_keywords: [],
  min_employees: null,
  max_employees: null,
  min_funding_amount: null,
  funding_stages: [],
  hiring_signals: [],
  tech_keywords: [],
  company_examples: [],
  locations: []
};

interface ComposableContact {
  companyName: string;
  result: CompanyResult;
  contact: TargetContact;
  key: string;
}

export function OutreachStep() {
  const results = useResearchStore((s) => s.results);
  const peopleResults = useResearchStore((s) => s.peopleResults);
  const allPeopleResults = useResearchStore((s) => s.allPeopleResults);
  const icp = useResearchStore((s) => s.icp);
  const getContactedEmails = useResearchStore((s) => s.getContactedEmails);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const contacts = useMemo(() => {
    const list: ComposableContact[] = [];
    for (const result of results) {
      const people = [
        ...(peopleResults[result.company_name] ?? []),
        ...(allPeopleResults[result.company_name] ?? [])
      ];
      const seen = new Set<string>();
      for (const person of people) {
        if (!person.is_enriched || !person.email || seen.has(person.email)) continue;
        seen.add(person.email);
        list.push({
          companyName: result.company_name,
          result,
          contact: {
            name: `${person.first_name} ${person.last_name}`,
            title: person.title ?? '',
            email: person.email,
            linkedin_url: person.linkedin_url ?? '',
            is_decision_maker: false
          },
          key: `${result.company_name}::${person.email}`
        });
      }
    }
    return list;
  }, [results, peopleResults, allPeopleResults]);

  const grouped = useMemo(() => {
    const map = new Map<string, ComposableContact[]>();
    for (const c of contacts) {
      const list = map.get(c.companyName) ?? [];
      list.push(c);
      map.set(c.companyName, list);
    }
    return map;
  }, [contacts]);

  const selected = contacts.find((c) => c.key === selectedKey) ?? null;

  const composeParams: ComposeEmailParams | null = selected
    ? { company: selected.result, contact: selected.contact, icp: icp ?? EMPTY_ICP }
    : null;

  if (contacts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-sm">
          No enriched contacts yet. Go back to Contacts to unlock contact info, then return here to
          compose outreach.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => useResearchStore.getState().setStep('results')}
        >
          Back to Contacts
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row" style={{ minHeight: 'min(600px, 70vh)' }}>
      {/* Contact sidebar */}
      <div className="border-border bg-card w-full shrink-0 overflow-y-auto rounded-(--card-radius) border md:w-72 lg:w-80">
        <div className="border-border border-b px-4 py-3">
          <p className="text-xs font-medium">
            {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'} ready
          </p>
        </div>
        <div className="divide-border divide-y">
          {[...grouped.entries()].map(([companyName, companyContacts]) => {
            const contactedEmails = getContactedEmails(companyName);
            return (
              <div key={companyName}>
                <div className="bg-muted/30 px-4 py-2">
                  <p className="text-muted-foreground text-xs font-medium">{companyName}</p>
                </div>
                {companyContacts.map((c) => {
                  const isSent = contactedEmails.includes(c.contact.email ?? '');
                  const isActive = selectedKey === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setSelectedKey(c.key)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isActive ? 'bg-muted' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{c.contact.name}</p>
                        <p className="text-muted-foreground truncate text-xs">{c.contact.title}</p>
                      </div>
                      {isSent ? (
                        <span className="text-muted-foreground flex items-center gap-0.5 text-[10px]">
                          <Check className="size-3" />
                          Sent
                        </span>
                      ) : (
                        <Mail className="text-muted-foreground/50 size-3.5 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Email editor */}
      <div className="border-border bg-card min-h-0 flex-1 overflow-hidden rounded-(--card-radius) border">
        {composeParams ? (
          <EmailEditorInline key={selectedKey} params={composeParams} />
        ) : (
          <div className="flex h-full items-center justify-center p-8">
            <div className="text-center">
              <Mail className="text-muted-foreground/30 mx-auto mb-3 size-8" />
              <p className="text-muted-foreground text-sm">Select a contact to compose an email</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
