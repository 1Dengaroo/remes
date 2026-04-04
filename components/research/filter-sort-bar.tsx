'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export type SortOption = 'signals' | 'funding' | 'name' | 'contacted';

const SIGNAL_TYPES = ['job_posting', 'funding', 'news', 'product_launch'] as const;
const SIGNAL_LABELS: Record<string, string> = {
  job_posting: 'Job Posting',
  funding: 'Funding',
  news: 'News',
  product_launch: 'Product Launch'
};

export function FilterSortBar({
  activeFilters,
  onToggleFilter,
  sort,
  onSortChange
}: {
  activeFilters: Set<string>;
  onToggleFilter: (type: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1.5">
        {SIGNAL_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onToggleFilter(type)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilters.has(type)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {SIGNAL_LABELS[type]}
          </button>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <Label className="text-muted-foreground text-xs">Sort</Label>
        <Select value={sort} onValueChange={(v: SortOption) => onSortChange(v)}>
          <SelectTrigger className="h-7 w-auto gap-1.5 border-none px-2.5 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="signals">Signal Count</SelectItem>
            <SelectItem value="funding">Funding Stage</SelectItem>
            <SelectItem value="name">Company Name (A-Z)</SelectItem>
            <SelectItem value="contacted">Contacted First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
