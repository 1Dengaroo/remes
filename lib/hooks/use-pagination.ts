import { useMemo, useState, useCallback } from 'react';

export interface UsePaginationResult<T> {
  /** Items for the current page */
  page: T[];
  /** Current page index (0-based) */
  pageIndex: number;
  /** Total number of pages */
  pageCount: number;
  /** Whether a previous page exists */
  hasPrev: boolean;
  /** Whether a next page exists */
  hasNext: boolean;
  /** Go to the previous page */
  prev: () => void;
  /** Go to the next page */
  next: () => void;
  /** Jump to a specific page (0-based) */
  goTo: (page: number) => void;
}

export function usePagination<T>(items: T[], pageSize: number): UsePaginationResult<T> {
  const [rawIndex, setRawIndex] = useState(0);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const pageIndex = Math.min(rawIndex, pageCount - 1);

  const page = useMemo(
    () => items.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    [items, pageIndex, pageSize]
  );

  const prev = useCallback(() => setRawIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setRawIndex((i) => Math.min(pageCount - 1, i + 1)), [pageCount]);
  const goTo = useCallback(
    (p: number) => setRawIndex(Math.max(0, Math.min(p, pageCount - 1))),
    [pageCount]
  );

  return {
    page,
    pageIndex,
    pageCount,
    hasPrev: pageIndex > 0,
    hasNext: pageIndex < pageCount - 1,
    prev,
    next,
    goTo
  };
}
