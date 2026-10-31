import { z } from 'zod';
import { checkSiteDocument } from '@/agent/site';
import { requireLocalSession } from '@/local/security';
import { deleteSite, findSite, saveSiteDraft, updateSite } from '@/local/sites';
import { checkPublishedSite } from '@/sites/published-site';
import { siteWriteResponse } from '../site-response';

type Context = { params: Promise<{ siteId: string }> };

const changeSchema = z.object({ slug: z.string(), content: z.unknown() });

const draftSchema = z.object({ content: z.unknown() });

const missing = () => Response.json({ problem: 'That website does not exist.' }, { status: 404 });

export const PUT = async (request: Request, { params }: Context) => {
  const denied = requireLocalSession(request);
  if (denied !== null) {
    return denied;
  }
  const { siteId } = await params;
  const site = await findSite(siteId);
  if (site === null) {
    return missing();
  }
  const change = changeSchema.safeParse(await request.json().catch(() => null));
  const checked = checkPublishedSite(
    change.success ? { ...change.data, templateId: site.templateId } : null,
  );
  if (!checked.ok) {
    return Response.json({ problem: checked.error }, { status: 400 });
  }
  return siteWriteResponse(await updateSite(siteId, checked.site));
};

export const PATCH = async (request: Request, { params }: Context) => {
  const denied = requireLocalSession(request);
  if (denied !== null) {
    return denied;
  }
  const { siteId } = await params;
  const site = await findSite(siteId);
  if (site === null) {
    return missing();
  }
  const draft = draftSchema.safeParse(await request.json().catch(() => null));
  const checked = checkSiteDocument({
    templateId: site.templateId,
    content: draft.success ? draft.data.content : null,
  });
  if (!checked.ok) {
    return Response.json({ problem: checked.error }, { status: 400 });
  }
  await saveSiteDraft(siteId, checked.document.content);
  return new Response(null, { status: 204 });
};

export const DELETE = async (request: Request, { params }: Context) => {
  const denied = requireLocalSession(request);
  if (denied !== null) {
    return denied;
  }
  return (await deleteSite((await params).siteId))
    ? new Response(null, { status: 204 })
    : missing();
};
