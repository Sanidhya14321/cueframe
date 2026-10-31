import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicSite } from '@/components/sites/public-site';
import { shareMetadata } from '@/lib/share-metadata';
import { findSiteTemplate, SITE_TEMPLATES } from '@/sites/templates';

export const generateStaticParams = () =>
  SITE_TEMPLATES.map((template) => ({ templateId: template.id }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ templateId: string }>;
}): Promise<Metadata> => {
  const { templateId } = await params;
  const template = findSiteTemplate(templateId);
  return template === undefined
    ? { title: 'Website' }
    : shareMetadata(`${template.meta.title} · Neuclip`, template.meta.description);
};

const TemplatePreviewPage = async ({ params }: { params: Promise<{ templateId: string }> }) => {
  const { templateId } = await params;
  const template = findSiteTemplate(templateId);
  if (template === undefined) {
    notFound();
  }
  return <PublicSite templateId={template.id} content={template.defaults} />;
};

export default TemplatePreviewPage;
