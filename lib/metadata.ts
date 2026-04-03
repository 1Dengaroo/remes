import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://remes.so';

/** Build page-level metadata that merges with the root layout template. */
export function createMetadata({
  title,
  description,
  path
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url
    },
    twitter: {
      title,
      description
    },
    alternates: { canonical: url }
  };
}
