import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { SiteEditor } from '@/components/sites/editor/site-editor';
import { shareMetadata } from '@/lib/share-metadata';
import { findLatestSite } from '@/local/sites';
import { siteEditorPath } from '@/sites/published-site';
import { findSiteTemplate } from '@/sites/templates';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ templateId: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const template = findSiteTemplate((await params).templateId);
  return template === undefined
    ? { title: 'Website' }
    : shareMetadata(`${template.meta.title} · cueframe`, template.meta.description);
};

const SiteTemplatePage = async ({ params }: Props) => {
  const { templateId } = await params;
  if (findSiteTemplate(templateId) === undefined) {
    notFound();
  }
  const existing = await findLatestSite(templateId);
  if (existing !== null) {
    redirect(siteEditorPath(existing.id));
  }
  return <SiteEditor templateId={templateId} opened={null} />;
};

export default SiteTemplatePage;
