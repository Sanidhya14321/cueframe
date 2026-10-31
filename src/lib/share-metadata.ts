import type { Metadata } from 'next';

const SITE_NAME = 'neuclip';

export const shareMetadata = (title: string, description: string): Metadata => ({
  title,
  description,
  openGraph: { title, description, siteName: SITE_NAME, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
});
