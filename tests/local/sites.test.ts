import { beforeEach, describe, expect, it } from 'bun:test';
import {
  createSite,
  deleteSite,
  editingContent,
  findLatestSite,
  findSite,
  findSiteBySlug,
  listSites,
  saveSiteDraft,
  updateSite,
} from '@/local/sites';
import { resetTestHome } from './test-home';

const site = { slug: 'maya-and-daniel', templateId: 'emerald-rose', content: { title: 'M & D' } };

beforeEach(resetTestHome);

describe('site store', () => {
  it('keeps every address unique', async () => {
    const created = await createSite(site);
    expect(created.ok).toBe(true);
    expect(await createSite(site)).toEqual({ ok: false, reason: 'taken' });
    expect((await findSiteBySlug('maya-and-daniel'))?.slug).toBe(site.slug);
  });

  it('changes a local website and releases its old address', async () => {
    const created = await createSite(site);
    if (!created.ok) {
      throw new Error('not created');
    }
    const { id } = created.site;
    const change = { slug: 'maya-daniel-2027', content: { title: 'Maya & Daniel' } };
    const updated = await updateSite(id, change);
    expect(updated.ok && updated.site).toMatchObject({ id, ...change });
    expect(await findSiteBySlug('maya-and-daniel')).toBeNull();
    expect(await deleteSite(id)).toBe(true);
    expect(await listSites()).toEqual([]);
  });

  it('refuses to move a website onto a taken address', async () => {
    await createSite({ ...site, slug: 'taken-address' });
    const created = await createSite(site);
    if (!created.ok) {
      throw new Error('not created');
    }
    expect(await updateSite(created.site.id, { slug: 'taken-address', content: {} })).toEqual({
      ok: false,
      reason: 'taken',
    });
  });

  it('keeps unpublished edits in a draft until they are published', async () => {
    const created = await createSite(site);
    if (!created.ok) {
      throw new Error('not created');
    }
    const { id } = created.site;
    expect(await saveSiteDraft(id, { title: 'Draft' })).toBe(true);
    const drafted = await findSite(id);
    expect(drafted?.content).toEqual({ title: 'M & D' });
    expect(drafted === null ? null : editingContent(drafted)).toEqual({ title: 'Draft' });
    expect((await findLatestSite('emerald-rose'))?.id).toBe(id);
    expect(await findLatestSite('other-template')).toBeNull();
    const published = await updateSite(id, {
      slug: site.slug,
      content: { title: 'Draft' },
    });
    expect(published.ok && published.site).toMatchObject({
      content: { title: 'Draft' },
      draft: null,
    });
  });
});
