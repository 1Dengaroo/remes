'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDemoStore } from './demo-store';

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? '';

const BUDGET_OPTIONS = [
  '$1,500–2,500 / month',
  '$2,500–3,500 / month',
  '> $3,500 / month'
] as const;

const demoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid work email'),
  phone: z.string().min(1, 'Phone number is required'),
  budget: z.string().min(1, 'Please select a budget range')
});

type DemoFormFields = z.infer<typeof demoSchema>;

export function DemoModal() {
  const open = useDemoStore((s) => s.open);
  const openDemo = useDemoStore((s) => s.openDemo);
  const closeDemo = useDemoStore((s) => s.closeDemo);
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (searchParams.get('demo') !== null) {
      openDemo();
    }
  }, [searchParams, openDemo]);
  const [submitError, setSubmitError] = useState('');

  const { control, handleSubmit, formState, reset } = useForm<DemoFormFields>({
    resolver: zodResolver(demoSchema),
    defaultValues: { name: '', email: '', phone: '', budget: '' }
  });

  function handleClose() {
    closeDemo();
    setTimeout(() => {
      reset();
      setSubmitted(false);
      setSubmitError('');
    }, 200);
  }

  async function onSubmit(data: DemoFormFields) {
    setSubmitError('');

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        data-theme="light"
        className="bg-modal text-foreground sm:max-w-lg"
        showCloseButton
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="text-primary size-10" />
            <p className="text-foreground text-lg font-semibold">Thanks! We&apos;ll be in touch.</p>
            <p className="text-muted-foreground text-sm">Most demos are booked within 24 hours.</p>
            <Button
              type="button"
              onClick={handleClose}
              className="bg-primary hover:bg-primary/80 mt-2 text-white"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Book a demo</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                Get a personalized walkthrough of how Remes can build pipeline for your team.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="flex min-w-0 flex-col gap-3">
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="demo-name">Name</Label>
                    <Input
                      {...field}
                      id="demo-name"
                      placeholder="Your name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <p className="text-destructive text-xs">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="demo-email">Work Email</Label>
                    <Input
                      {...field}
                      id="demo-email"
                      type="email"
                      placeholder="you@company.com"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <p className="text-destructive text-xs">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="demo-phone">Phone Number</Label>
                    <Input
                      {...field}
                      id="demo-phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      aria-invalid={fieldState.invalid}
                    />
                    <p className="text-muted-foreground text-xs">
                      No, we won&apos;t call you at 1am
                    </p>
                    {fieldState.error && (
                      <p className="text-destructive text-xs">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="budget"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="demo-budget">
                      If Remes meets your needs perfectly, how much funding would you be willing to
                      invest in this?
                    </Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="demo-budget"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Select a range" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <p className="text-destructive text-xs">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />

              {submitError && <p className="text-destructive text-sm">{submitError}</p>}

              <Button
                type="submit"
                disabled={formState.isSubmitting}
                className="bg-primary hover:bg-primary/80 text-white"
              >
                {formState.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send request'
                )}
              </Button>
            </form>

            <div className="border-t pt-3">
              <Label className="my-1.5 text-xs" muted>
                Or reach out directly (opens email client)
              </Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:kenny@remes.so?subject=Demo%20request"
                  className="hover:border-primary/30 hover:bg-primary/4 flex flex-1 items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors duration-150"
                >
                  <div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Mail className="text-primary size-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground text-sm font-medium">kenny@remes.so</span>
                    <span className="text-muted-foreground text-xs">Co-Founder &amp; Product</span>
                  </div>
                </a>
                <a
                  href="mailto:andy@remes.so?subject=Demo%20request"
                  className="hover:border-primary/30 hover:bg-primary/4 flex flex-1 items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors duration-150"
                >
                  <div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Mail className="text-primary size-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground text-sm font-medium">andy@remes.so</span>
                    <span className="text-muted-foreground text-xs">Co-Founder &amp; SWE</span>
                  </div>
                </a>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
