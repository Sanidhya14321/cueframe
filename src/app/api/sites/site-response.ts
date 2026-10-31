import { type SiteRow, type SiteWrite, SLUG_TAKEN } from '@/local/sites';

const siteSummary = (site: SiteRow) => ({
  id: site.id,
  slug: site.slug,
  updatedAt: site.updatedAt.toISOString(),
});

export const siteWriteResponse = (write: SiteWrite): Response => {
  if (write.ok) {
    return Response.json({ site: siteSummary(write.site) });
  }
  return write.reason === 'taken'
    ? Response.json({ problem: SLUG_TAKEN }, { status: 409 })
    : Response.json({ problem: 'That website does not exist.' }, { status: 404 });
};
