import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const sizes = {
  xs: 'size-3',
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5'
} as const;

function Spinner({ size = 'sm', className }: { size?: keyof typeof sizes; className?: string }) {
  return <Loader2 className={cn('animate-spin', sizes[size], className)} />;
}

export { Spinner };
