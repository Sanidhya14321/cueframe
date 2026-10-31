import { requireLocalSession } from '@/local/security';
import { createSite } from '@/local/sites';
import { checkPublishedSite } from '@/sites/published-site';
import { siteWriteResponse } from './site-response';

export const POST = async (request: Request) => {
  const denied = requireLocalSession(request);
  if (denied !== null) {
    return denied;
  }
  const checked = checkPublishedSite(await request.json().catch(() => null));
  if (!checked.ok) {
    return Response.json({ problem: checked.error }, { status: 400 });
  }
  return siteWriteResponse(await createSite(checked.site));
};
