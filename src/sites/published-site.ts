import { z } from 'zod';
import { checkSiteDocument } from '@/agent/site';
import { slugProblem } from './slug';

export interface PublishedSite {
  slug: string;
  templateId: string;
  content: Record<string, unknown>;
}

export type SiteCheck = { ok: true; site: PublishedSite } | { ok: false; error: string };

const publishedSiteSchema = z.object({
  slug: z.string(),
  templateId: z.string(),
  content: z.unknown(),
});

const holdsLocalFile = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.startsWith('blob:') || value.startsWith('data:');
  }
  if (Array.isArray(value)) {
    return value.some(holdsLocalFile);
  }
  return typeof value === 'object' && value !== null && Object.values(value).some(holdsLocalFile);
};

export const LOCAL_PHOTO_PROBLEM =
  'Photos picked from this device cannot be published. Paste an image link instead.';

export const checkPublishedSite = (value: unknown): SiteCheck => {
  const shape = publishedSiteSchema.safeParse(value);
  if (!shape.success) {
    return { ok: false, error: 'A website is { slug, templateId, content }.' };
  }
  const slugIssue = slugProblem(shape.data.slug);
  if (slugIssue !== null) {
    return { ok: false, error: `Address: ${slugIssue}` };
  }
  const document = checkSiteDocument(shape.data);
  if (!document.ok) {
    return document;
  }
  if (holdsLocalFile(document.document.content)) {
    return { ok: false, error: LOCAL_PHOTO_PROBLEM };
  }
  return { ok: true, site: { slug: shape.data.slug, ...document.document } };
};

export const publicSitePath = (slug: string): string => `/s/${slug}`;

export const siteEditorPath = (id: string): string => `/websites/${id}`;
