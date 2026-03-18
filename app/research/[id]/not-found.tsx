import Link from 'next/link';

export default function SessionNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">Session not found</h1>
      <p className="text-muted-foreground text-sm">
        This session doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Link
        href="/research"
        className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
      >
        Back to sessions
      </Link>
    </div>
  );
}
