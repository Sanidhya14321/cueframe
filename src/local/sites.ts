import { serialDisk } from './file-lock';
import 'server-only';
import { join } from 'node:path';
import { customAlphabet } from 'nanoid';
import { z } from 'zod';
import { readJson, writeJson } from './files';
import { readSettings } from './settings';

// biome-ignore lint/security/noSecrets: lowercase alphanumeric ID alphabet
const newId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);
const siteSchema = z.object({
  id: z.string(),
  slug: z.string(),
  templateId: z.string(),
  content: z.record(z.string(), z.unknown()),
  draft: z.record(z.string(), z.unknown()).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type SiteRow = z.infer<typeof siteSchema>;
type SiteFields = Pick<SiteRow, 'slug' | 'templateId' | 'content'>;
export type SiteWrite = { ok: true; site: SiteRow } | { ok: false; reason: 'missing' | 'taken' };
export const SLUG_TAKEN = 'That address is already taken. Pick another one.';

const storePath = async () => join((await readSettings()).dataFolder, 'websites.json');
const load = async (path: string) => z.array(siteSchema).parse((await readJson(path)) ?? []);
const changeSites = async <T>(run: (sites: SiteRow[]) => T): Promise<T> => {
  const path = await storePath();
  return serialDisk(path, async () => {
    const sites = await load(path);
    const result = run(sites);
    await writeJson(path, sites);
    return result;
  });
};

export const createSite = (site: SiteFields): Promise<SiteWrite> =>
  changeSites((sites) => {
    if (sites.some((candidate) => candidate.slug === site.slug)) {
      return { ok: false, reason: 'taken' };
    }
    const row: SiteRow = {
      ...site,
      id: newId(),
      draft: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    sites.push(row);
    return { ok: true, site: row };
  });
export const updateSite = (
  id: string,
  change: Pick<SiteFields, 'slug' | 'content'>,
): Promise<SiteWrite> =>
  changeSites((sites) => {
    const row = sites.find((site) => site.id === id);
    if (row === undefined) {
      return { ok: false, reason: 'missing' };
    }
    if (sites.some((site) => site.id !== id && site.slug === change.slug)) {
      return { ok: false, reason: 'taken' };
    }
    Object.assign(row, { ...change, draft: null, updatedAt: new Date() });
    return { ok: true, site: row };
  });
export const saveSiteDraft = (id: string, draft: Record<string, unknown>): Promise<boolean> =>
  changeSites((sites) => {
    const row = sites.find((site) => site.id === id);
    if (row === undefined) {
      return false;
    }
    Object.assign(row, { draft, updatedAt: new Date() });
    return true;
  });
export const editingContent = (site: SiteRow): Record<string, unknown> =>
  site.draft ?? site.content;
export const listSites = async (): Promise<SiteRow[]> =>
  (await load(await storePath())).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
export const findSite = async (id: string): Promise<SiteRow | null> =>
  (await listSites()).find((site) => site.id === id) ?? null;
export const findSiteBySlug = async (slug: string): Promise<SiteRow | null> =>
  (await listSites()).find((site) => site.slug === slug) ?? null;
export const findLatestSite = async (templateId: string): Promise<SiteRow | null> =>
  (await listSites()).find((site) => site.templateId === templateId) ?? null;
export const deleteSite = (id: string): Promise<boolean> =>
  changeSites((sites) => {
    const index = sites.findIndex((site) => site.id === id);
    if (index < 0) {
      return false;
    }
    sites.splice(index, 1);
    return true;
  });
