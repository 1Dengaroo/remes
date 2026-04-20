import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Props =
  | ({ as?: 'a' } & ComponentProps<'a'>)
  | ({ as: 'next' } & ComponentProps<typeof NextLink>);

const linkStyles =
  'text-link hover:text-link/80 font-medium underline underline-offset-2 transition-colors';

export function Link(props: Props) {
  const className = cn(linkStyles, props.className);
  if (props.as === 'next') {
    const { as: _as, className: _className, ...rest } = props;
    return <NextLink {...rest} className={className} />;
  }
  const { as: _as, className: _className, ...rest } = props;
  return <a {...rest} className={className} />;
}
