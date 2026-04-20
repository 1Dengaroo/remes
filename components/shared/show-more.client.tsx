'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';

export function ShowMore({
  children,
  lines = 2,
  className,
  contentClassName
}: {
  children: React.ReactNode;
  lines?: number;
  className?: string;
  contentClassName?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (expanded) return;
    const el = ref.current;
    if (!el) return;
    const check = () => setCanExpand(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, lines, expanded]);

  return (
    <div className={className}>
      <div
        ref={ref}
        className={cn('wrap-break-word whitespace-normal', contentClassName)}
        style={
          expanded
            ? undefined
            : {
                display: '-webkit-box',
                WebkitLineClamp: lines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }
        }
      >
        {children}
      </div>
      {canExpand && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="text-link hover:text-link/80 mt-0.5 text-xs font-medium underline underline-offset-2 transition-colors"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
