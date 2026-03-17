'use client';

import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const CLEARBIT_LOGO_API = 'https://logo.clearbit.com/';

function domainFromUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}

function guessDomain(companyName: string): string {
  return `${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
}

export function CompanyLogo({
  name,
  website,
  logoUrl,
  size = 'md',
  className
}: {
  name: string;
  website?: string | null;
  /** Pre-built logo URL (e.g. from Apollo) — takes priority over domain lookup */
  logoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const src =
    logoUrl || `${CLEARBIT_LOGO_API}${website ? domainFromUrl(website) : guessDomain(name)}`;

  const sizeClass = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8'
  }[size];

  return (
    <img
      src={src}
      alt=""
      className={cn(sizeClass, 'shrink-0 rounded', className)}
      onError={(e) => {
        const el = e.target as HTMLImageElement;
        el.style.display = 'none';
        const fallback = el.nextElementSibling;
        if (fallback) (fallback as HTMLElement).style.display = '';
      }}
    />
  );
}

/** Wrap CompanyLogo with a Building2 fallback */
export function CompanyLogoWithFallback({
  name,
  website,
  logoUrl,
  size = 'md',
  className
}: {
  name: string;
  website?: string | null;
  logoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClass = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8'
  }[size];

  const iconSize = {
    sm: 'size-2.5',
    md: 'size-3.5',
    lg: 'size-4'
  }[size];

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <CompanyLogo name={name} website={website} logoUrl={logoUrl} size={size} />
      <span
        className={cn(
          sizeClass,
          'bg-muted text-muted-foreground hidden items-center justify-center rounded'
        )}
      >
        <Building2 className={iconSize} />
      </span>
    </span>
  );
}
