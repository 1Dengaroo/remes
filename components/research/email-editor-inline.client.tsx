'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, RefreshCw, Link2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { getErrorMessage } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { ComposeEmailParams, GeneratedEmail } from '@/lib/types';
import { toast } from 'sonner';
import { streamEmailSequence, sendEmail as sendEmailApi, getGmailStatus } from '@/lib/api';
import { parseStreamingEmailFields } from './parse-streaming-email';
import { useProfileStore } from '@/lib/store/profile-store';
import { useResearchStore } from '@/lib/store/research-store';
import { useSignatureStore } from '@/lib/store/signature-store';

type EmailTriple = [GeneratedEmail, GeneratedEmail, GeneratedEmail];
const STEP_LABELS = ['Email 1', 'Email 2', 'Email 3'] as const;

function renderLines(text: string) {
  return text.split('\n').map((line, i) =>
    line.trim() === '' ? (
      <br key={i} />
    ) : (
      <p key={i} className="mb-0.5">
        {line}
      </p>
    )
  );
}

function EmailPreview({
  toEmail,
  subject,
  body,
  signatureBody
}: {
  toEmail: string;
  subject: string;
  body: string;
  signatureBody: string | null;
}) {
  return (
    <Card className="bg-muted/30 h-full">
      <div className="border-border space-y-1 border-b px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-muted-foreground text-xs font-medium">To:</span>
          <span className="text-foreground text-sm">{toEmail || 'No recipient'}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-muted-foreground text-xs font-medium">Subject:</span>
          <span className="text-foreground text-sm font-medium">{subject || 'No subject'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="text-foreground text-sm leading-relaxed">
          {body ? (
            renderLines(body)
          ) : (
            <p className="text-muted-foreground italic">Generating email...</p>
          )}
        </div>

        {signatureBody && (
          <>
            <div className="border-border my-3 border-t" />
            <div className="text-muted-foreground text-sm leading-relaxed">
              {renderLines(signatureBody)}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

export function EmailEditorInline({
  params,
  onSent
}: {
  params: ComposeEmailParams;
  onSent?: () => void;
}) {
  const { company, contact } = params;
  const contactKey = contact.email ?? contact.name;

  const [toEmail, setToEmail] = useState('');
  const [steps, setSteps] = useState<EmailTriple | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailChecked, setGmailChecked] = useState(false);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string>('none');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const signatures = useSignatureStore((s) => s.signatures);
  const loadSignatures = useSignatureStore((s) => s.loadSignatures);
  const selectedSignature = signatures.find((s) => s.id === selectedSignatureId) ?? null;

  const abortRef = useRef<AbortController | null>(null);
  const generationIdRef = useRef(0);

  useEffect(() => {
    getGmailStatus().then((s) => {
      setGmailConnected(s.connected);
      setGmailChecked(true);
    });
    loadSignatures().then(() => {
      const def = useSignatureStore.getState().getDefault();
      if (def) setSelectedSignatureId(def.id);
    });
  }, [loadSignatures]);

  useEffect(() => {
    // Abort any in-flight generation when contact/company changes
    abortRef.current?.abort();

    setToEmail(contact.email ?? '');
    const cached = useResearchStore.getState().getEmailSequence(company.company_name, contactKey);
    if (cached) {
      setSteps(cached.emails);
      setSubject(cached.emails[0].subject);
      setBody(cached.emails[0].body);
      setActiveStep(0);
      setGenerating(false);
    } else {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company.company_name, contact.email, contactKey]);

  const loadStep = (i: number, emails: EmailTriple) => {
    setSubject(emails[i].subject);
    setBody(emails[i].body);
    setActiveStep(i);
  };

  const handleGenerate = async () => {
    // Abort any previous in-flight generation
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const currentGenId = ++generationIdRef.current;

    setGenerating(true);
    setSubject('');
    setBody('');

    try {
      let accumulated = '';
      const seq = await streamEmailSequence(
        company,
        contact,
        params.icp,
        (delta) => {
          if (currentGenId !== generationIdRef.current) return;
          accumulated += delta;
          const firstEmailStart = accumulated.indexOf('{', accumulated.indexOf('['));
          if (firstEmailStart !== -1) {
            const parsed = parseStreamingEmailFields(accumulated.slice(firstEmailStart));
            if (parsed.subject !== null) setSubject(parsed.subject);
            if (parsed.body !== null) setBody(parsed.body);
          }
        },
        controller.signal
      );

      // Only apply results if this generation is still current
      if (currentGenId !== generationIdRef.current) return;

      setSteps(seq.emails);
      loadStep(activeStep, seq.emails);
      useResearchStore.getState().saveEmailSequence(company.company_name, contactKey, seq);
    } catch (err) {
      if (currentGenId !== generationIdRef.current) return;
      if (err instanceof DOMException && err.name === 'AbortError') return;

      const title = company.signals[0]?.title ?? 'Introduction';
      const fallback: EmailTriple = [
        { subject: `${title} — ${company.company_name}`, body: '' },
        { subject: `Re: ${title} — ${company.company_name}`, body: '' },
        { subject: `Re: ${title} — ${company.company_name}`, body: '' }
      ];
      setSteps(fallback);
      loadStep(0, fallback);
    } finally {
      if (currentGenId === generationIdRef.current) {
        setGenerating(false);
      }
    }
  };

  const handleStepChange = (newStep: number) => {
    setSteps((prev) => {
      if (!prev) return prev;
      const updated = [...prev] as EmailTriple;
      updated[activeStep] = { subject, body };
      setSubject(updated[newStep].subject);
      setBody(updated[newStep].body);
      setActiveStep(newStep);
      return updated;
    });
  };

  const handleSend = async () => {
    if (!toEmail) return;
    setSending(true);
    const sessionId = useResearchStore.getState().sessionId;
    const finalBody = selectedSignature ? `${body}\n\n${selectedSignature.body}` : body;
    try {
      const result = await sendEmailApi({
        to: toEmail,
        subject,
        body: finalBody,
        companyName: company.company_name,
        contactName: contact.name,
        ...(sessionId ? { sessionId } : {})
      });
      if (result.success) {
        toast.success('Email sent successfully');
        onSent?.();
      } else {
        toast.error(result.error ?? 'Send failed');
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Send failed'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border shrink-0 space-y-2 border-b px-4 py-3 pr-12">
        <div>
          <p className="text-sm font-medium">{company.company_name}</p>
          <p className="text-muted-foreground text-xs">
            {contact.name} &middot; {contact.title}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {STEP_LABELS.map((label, i) => (
            <Button
              key={label}
              type="button"
              variant={activeStep === i ? 'default' : 'ghost'}
              size="xs"
              onClick={() => handleStepChange(i)}
              disabled={generating}
              className={activeStep === i ? '' : 'text-muted-foreground'}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Editor */}
        <div
          className={`border-border flex w-full flex-col md:w-1/2 md:border-r ${showPreview ? 'hidden md:flex' : 'flex'}`}
        >
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            <div className="space-y-1.5">
              <Label className="text-xs" muted>
                To
              </Label>
              <Input
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="No email found"
                type="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs" muted>
                Subject
              </Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={generating}
                placeholder={generating ? 'Generating email...' : ''}
              />
            </div>

            <div className="flex flex-1 flex-col space-y-1.5">
              <Label className="text-xs" muted>
                Body
              </Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-40 flex-1 resize-none"
                disabled={generating}
                placeholder={generating ? 'Generating email...' : ''}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs" muted>
                Signature
              </Label>
              <Select value={selectedSignatureId} onValueChange={setSelectedSignatureId}>
                <SelectTrigger className="bg-card w-full text-xs">
                  <SelectValue placeholder="No signature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No signature</SelectItem>
                  {signatures.map((sig) => (
                    <SelectItem key={sig.id} value={sig.id}>
                      {sig.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer */}
          <div className="border-border flex items-center gap-2 border-t px-4 py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="md:hidden"
            >
              Preview
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={handleGenerate}
              disabled={generating}
              label={generating ? 'Generating...' : steps ? 'Regenerate' : 'Generate'}
            >
              {generating ? <Spinner /> : <RefreshCw className="size-3.5" />}
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleStepChange(activeStep - 1)}
                  disabled={activeStep === 0 || generating}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {activeStep + 1}/3
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleStepChange(activeStep + 1)}
                  disabled={activeStep === 2 || generating}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              {gmailChecked && !gmailConnected && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => useProfileStore.getState().openProfile('connections')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Link2 className="size-3" />
                  Connect Gmail
                </Button>
              )}
              <Button
                size="icon-sm"
                onClick={() => setConfirmOpen(true)}
                disabled={!gmailConnected || !toEmail || generating || sending}
                label={!gmailConnected ? 'Connect Gmail to send' : 'Send email'}
              >
                {sending ? <Spinner /> : <Send className="size-3.5" />}
              </Button>

              <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Send this email?</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="space-y-2">
                        <div>
                          <span className="text-muted-foreground text-xs font-medium">To</span>
                          <p className="text-foreground text-sm">{toEmail}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs font-medium">Subject</span>
                          <p className="text-foreground text-sm">{subject}</p>
                        </div>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      size="sm"
                      onClick={() => {
                        setConfirmOpen(false);
                        handleSend();
                      }}
                    >
                      <Send className="size-3.5" />
                      Send
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div
          className={`flex min-h-0 w-full flex-col p-4 md:w-1/2 ${showPreview ? 'flex' : 'hidden md:flex'}`}
        >
          <div className="mb-2 flex shrink-0 items-center justify-between">
            <p className="text-muted-foreground text-xs font-medium">Preview</p>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setShowPreview(false)}
              className="text-muted-foreground hover:text-foreground md:hidden"
            >
              Back to editor
            </Button>
          </div>
          <div className="min-h-0 flex-1">
            <EmailPreview
              toEmail={toEmail}
              subject={subject}
              body={body}
              signatureBody={selectedSignature?.body ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
