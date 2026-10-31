import { notFound } from 'next/navigation';
import { siteImage } from '@/og/site-card';
import { findSiteTemplate, SITE_TEMPLATES } from '@/sites/templates';

export const alt = 'A neuclip website template';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const generateStaticParams = () =>
  SITE_TEMPLATES.map((template) => ({ templateId: template.id }));

const Image = async ({ params }: { params: Promise<{ templateId: string }> }) => {
  const template = findSiteTemplate((await params).templateId);
  if (template === undefined) {
    notFound();
  }
  return siteImage(template);
};

export default Image;
