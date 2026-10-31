'use client';

import { SiteCanvas } from './site-canvas';
import { bindSite } from './site-registry';

export const PublicSite = ({ templateId, content }: { templateId: string; content: unknown }) => {
  const site = bindSite(templateId, content);
  return site === null ? (
    <p className="p-10 text-center text-muted-foreground">This website could not be shown.</p>
  ) : (
    <SiteCanvas site={site} layout="page" introRun={1} />
  );
};
