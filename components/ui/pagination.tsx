import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (page: number) => void;
  className?: string;
}

/**
 * Reusable pagination bar. Accepts the control props returned by usePagination.
 * Renders prev/next arrows with page number buttons.
 */
export function Pagination({
  pageIndex,
  pageCount,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onGoTo,
  className
}: PaginationProps) {
  if (pageCount <= 1) return null;

  // Build page numbers to show: always show first, last, and neighbors of current
  const pages = buildPageNumbers(pageIndex, pageCount);

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-3.5" />
      </Button>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${i}`}
            className="text-muted-foreground flex size-6 items-center justify-center text-xs"
          >
            ...
          </span>
        ) : (
          <Button
            key={p}
            variant={p === pageIndex ? 'secondary' : 'ghost'}
            size="icon-xs"
            onClick={() => onGoTo(p)}
            aria-label={`Page ${p + 1}`}
            aria-current={p === pageIndex ? 'page' : undefined}
          >
            <span className="text-xs">{p + 1}</span>
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next page"
      >
        <ChevronRight className="size-3.5" />
      </Button>
    </nav>
  );
}

/** Build an array of page indices and 'ellipsis' markers to display. */
function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i);
  }

  const pages: (number | 'ellipsis')[] = [];

  // Always show first page
  pages.push(0);

  if (current > 2) {
    pages.push('ellipsis');
  }

  // Neighbors of current
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) {
    pages.push(i);
  }

  if (current < total - 3) {
    pages.push('ellipsis');
  }

  // Always show last page
  pages.push(total - 1);

  return pages;
}
