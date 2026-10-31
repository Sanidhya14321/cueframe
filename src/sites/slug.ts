import { z } from 'zod';

const RESERVED = new Set(['new', 'edit', 'api', 'admin', 'demo', 'preview', 'sites', 'templates']);

const SLUG_MIN = 3;
const SLUG_MAX = 48;

const slugSchema = z
  .string()
  .min(SLUG_MIN, `Use at least ${SLUG_MIN} characters.`)
  .max(SLUG_MAX, `Use at most ${SLUG_MAX} characters.`)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single hyphens.')
  .refine((slug) => !RESERVED.has(slug), 'That address is reserved.');

export const slugify = (text: string): string =>
  text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX)
    .replace(/-+$/, '');

export const slugProblem = (slug: string): string | null => {
  const result = slugSchema.safeParse(slug);
  return result.success ? null : (result.error.issues[0]?.message ?? 'Invalid address.');
};
