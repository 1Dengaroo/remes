'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  ChevronRight,
  Mail,
  RotateCcw,
  Check,
  FileText,
  Lightbulb,
  Building2,
  Users,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useResearchStore } from '@/lib/store/research-store';
import { useSidebar } from '@/components/ui/sidebar';

type StepStatus = 'pending' | 'in-progress' | 'completed';

function NavButton({
  label,
  icon: Icon,
  active,
  enabled,
  status,
  onClick
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  enabled: boolean;
  status: StepStatus;
  onClick: () => void;
}) {
  const mobileContent =
    status === 'in-progress' ? (
      <Loader2 className="size-3.5 animate-spin" />
    ) : status === 'completed' ? (
      <Check className="size-3.5" />
    ) : (
      <Icon className="size-3.5" />
    );

  return (
    <>
      {/* Mobile: circular step indicator */}
      <button
        onClick={() => enabled && onClick()}
        disabled={!enabled}
        className={`flex size-8 items-center justify-center rounded-full text-xs font-medium transition-colors md:hidden ${
          active
            ? 'bg-primary text-primary-foreground'
            : status === 'completed'
              ? 'bg-primary/15 text-primary'
              : enabled
                ? 'bg-muted text-muted-foreground hover:text-foreground'
                : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
        }`}
      >
        {mobileContent}
      </button>
      {/* Desktop: full label */}
      <button
        onClick={() => enabled && onClick()}
        disabled={!enabled}
        className={`hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors md:flex ${
          active
            ? 'bg-muted text-foreground font-medium'
            : status === 'completed'
              ? 'text-primary hover:bg-muted/50'
              : enabled
                ? 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                : 'text-muted-foreground/50 cursor-not-allowed'
        }`}
      >
        {status === 'in-progress' ? (
          <Loader2 className="size-3 animate-spin" />
        ) : status === 'completed' ? (
          <Check className="size-3" />
        ) : (
          <Icon className="size-3" />
        )}
        {label}
      </button>
    </>
  );
}

export function BottomNav() {
  const router = useRouter();
  const { state, isMobile } = useSidebar();
  const step = useResearchStore((s) => s.step);
  const setStep = useResearchStore((s) => s.setStep);
  const isExtracting = useResearchStore((s) => s.isExtracting);
  const isDiscovering = useResearchStore((s) => s.isDiscovering);
  const isResearching = useResearchStore((s) => s.isResearching);
  const icp = useResearchStore((s) => s.icp);
  const candidates = useResearchStore((s) => s.candidates);
  const results = useResearchStore((s) => s.results);
  const transcript = useResearchStore((s) => s.transcript);
  const selectedCompanies = useResearchStore((s) => s.selectedCompanies);

  const strategyMessages = useResearchStore((s) => s.strategyMessages);
  const isStrategizing = useResearchStore((s) => s.isStrategizing);

  const extractICP = useResearchStore((s) => s.extractICP);
  const approveStrategy = useResearchStore((s) => s.approveStrategy);
  const research = useResearchStore((s) => s.research);
  const startOver = useResearchStore((s) => s.startOver);
  const skipToReview = useResearchStore((s) => s.skipToReview);

  const hasIcp = !!icp;
  const hasCandidates = candidates.length > 0;
  const hasResults = results.length > 0;
  const selectedCount = selectedCompanies.length;

  return (
    <div
      className="fixed right-0 bottom-0 z-10 border-t transition-[left] duration-200 ease-linear"
      style={{
        left: isMobile
          ? 0
          : state === 'expanded'
            ? 'var(--sidebar-width, 0px)'
            : 'var(--sidebar-width-icon, 3rem)',
        backgroundColor: 'var(--chrome)',
        borderColor: 'var(--bottom-nav-border, hsl(var(--border)))',
        backdropFilter: 'var(--bottom-nav-backdrop, none)'
      }}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6">
        {/* Left: step navigation */}
        <div className="flex items-center gap-1 text-xs">
          <NavButton
            label="Describe"
            icon={FileText}
            active={step === 'input'}
            enabled
            status={isExtracting ? 'in-progress' : hasIcp ? 'completed' : 'pending'}
            onClick={() => setStep('input')}
          />
          <span className="text-border hidden md:inline">&mdash;</span>
          <NavButton
            label="Strategy"
            icon={Lightbulb}
            active={step === 'review'}
            enabled={hasIcp}
            status={isStrategizing ? 'in-progress' : hasCandidates ? 'completed' : 'pending'}
            onClick={() => setStep('review')}
          />
          <span className="text-border hidden md:inline">&mdash;</span>
          <NavButton
            label="Companies"
            icon={Building2}
            active={step === 'confirm'}
            enabled={hasCandidates || isDiscovering}
            status={isDiscovering ? 'in-progress' : hasResults ? 'completed' : 'pending'}
            onClick={() => setStep('confirm')}
          />
          <span className="text-border hidden md:inline">&mdash;</span>
          <NavButton
            label="Contacts"
            icon={Users}
            active={step === 'results'}
            enabled={hasResults || isResearching}
            status={isResearching ? 'in-progress' : hasResults ? 'completed' : 'pending'}
            onClick={() => setStep('results')}
          />
          <span className="text-border hidden md:inline">&mdash;</span>
          <NavButton
            label="Outreach"
            icon={Send}
            active={step === 'outreach'}
            enabled={hasResults}
            status="pending"
            onClick={() => setStep('outreach')}
          />
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2">
          {(isDiscovering || isResearching) && step !== 'confirm' && step !== 'results' && (
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Loader2 className="size-3 animate-spin" />
              {isDiscovering ? 'Discovering...' : 'Researching...'}
            </span>
          )}

          {step === 'input' && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={skipToReview}
                title="Start with a blank profile"
              >
                Skip to Strategy
                <ChevronRight className="size-4" />
              </Button>
              <Button size="sm" onClick={extractICP} disabled={isExtracting || !transcript.trim()}>
                {isExtracting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze
                    <ChevronRight className="size-4" />
                  </>
                )}
              </Button>
            </>
          )}

          {step === 'review' && (
            <>
              {isStrategizing && (
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Loader2 className="size-3 animate-spin" />
                  Thinking...
                </span>
              )}
              {hasCandidates && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    useResearchStore.setState({
                      candidates: [],
                      selectedCompanies: [],
                      icpChangedSinceDiscovery: false
                    });
                    approveStrategy();
                  }}
                >
                  <RotateCcw className="size-3.5" />
                  Start New Search
                </Button>
              )}
              <Button
                size="sm"
                onClick={approveStrategy}
                disabled={
                  isStrategizing ||
                  !(
                    strategyMessages.length > 0 ||
                    (icp && (icp.description || icp.industry_keywords.length > 0))
                  )
                }
              >
                Find Companies
                <ChevronRight className="size-4" />
              </Button>
            </>
          )}

          {step === 'confirm' && (
            <>
              {isDiscovering && (
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Loader2 className="size-3 animate-spin" />
                  Discovering...
                </span>
              )}
              <Button
                size="sm"
                onClick={research}
                disabled={isDiscovering || isResearching || selectedCount === 0}
              >
                {isResearching ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    Research {selectedCount} {selectedCount === 1 ? 'Company' : 'Companies'}
                    <ChevronRight className="size-4" />
                  </>
                )}
              </Button>
            </>
          )}

          {step === 'results' && (
            <>
              {isResearching && (
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Loader2 className="size-3.5 animate-spin" />
                  Researching...
                </span>
              )}
              {hasResults && !isResearching && (
                <Button size="sm" onClick={() => setStep('outreach')}>
                  Review Outreach
                  <ChevronRight className="size-4" />
                </Button>
              )}
            </>
          )}

          {step === 'outreach' && (
            <>
              {hasResults ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <RotateCcw className="size-3.5" />
                      <span className="hidden md:inline">New Research</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Start new research?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Your current session is saved, but you&apos;ll leave this view.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          startOver();
                          router.push('/research');
                        }}
                      >
                        Start New
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    startOver();
                    router.push('/research');
                  }}
                >
                  <RotateCcw className="size-3.5" />
                  <span className="hidden md:inline">New Research</span>
                </Button>
              )}
              <Button asChild variant="ghost" size="sm">
                <Link href="/emails">
                  <Mail className="size-3.5" />
                  <span className="hidden md:inline">Emails</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
