import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteEditor } from '@/components/sites/editor/site-editor';
import { findSite } from '@/local/sites';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ siteId: string }> };

export const metadata: Metadata = { title: 'Website · cueframe' };

const WebsiteEditorPage = async ({ params }: Props) => {
  const { siteId } = await params;
  const site = await findSite(siteId);
  if (site === null) {
    notFound();
  }
  return (
    <SiteEditor
      templateId={site.templateId}
      opened={{
        id: site.id,
        slug: site.slug,
        content: site.content,
        draft: site.draft,
        updatedAt: site.updatedAt.toISOString(),
      }}
    />
  );
};

export default WebsiteEditorPage;
