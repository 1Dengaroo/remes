'use client';

import { Search, Target, Mail, Plus } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const STEPS = [
  {
    icon: Search,
    title: 'Describe your customer',
    description: 'Tell us about your ideal buyer - industry, size, signals, tech stack.'
  },
  {
    icon: Target,
    title: 'Review your strategy',
    description: 'We surface matching companies and contacts for you to refine.'
  },
  {
    icon: Mail,
    title: 'Reach out',
    description: 'Personalized outreach drafted and ready to send from your inbox.'
  }
];

export function GettingStarted({
  onStart,
  isCreating
}: {
  onStart: () => void;
  isCreating: boolean;
}) {
  return (
    <Card className="px-8 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-foreground text-xl font-semibold tracking-tight">
          Get started with Remes
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Three steps to finding your ideal customers.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full">
              <step.icon className="text-muted-foreground size-5" />
            </div>
            <h3 className="text-foreground mt-4 text-sm font-medium">{step.title}</h3>
            <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button onClick={onStart} disabled={isCreating}>
          {isCreating ? <Spinner size="md" /> : <Plus className="size-4" />}
          Start Your First Research
        </Button>
      </div>
    </Card>
  );
}
