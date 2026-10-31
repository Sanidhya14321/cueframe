import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { PublicSite } from '@/components/sites/public-site';
import { findSiteBySlug } from '@/local/sites';
import { findSiteTemplate } from '@/sites/templates';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

const openSite = cache(async (slug: string) => {
  const site = await findSiteBySlug(slug);
  const template = site === null ? undefined : findSiteTemplate(site.templateId);
  return site === null || template === undefined ? null : { site, template };
});

const openPage = async ({ params }: Props) => openSite((await params).slug);

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const page = await openPage(props);
  if (page === null) {
    return { title: 'Website not found' };
  }
  const title = page.template.headline(page.site.content);
  return { title, openGraph: { title, description: page.template.meta.description } };
};

const PublishedSitePage = async (props: Props) => {
  const page = await openPage(props);
  if (page === null) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="font-semibold text-xl">This website does not exist</h1>
        <p className="max-w-sm text-muted-foreground text-sm">
          Check the address, or ask the person who sent it for the link.
        </p>
        <Link href="/" className="text-sm underline underline-offset-4">
          Go to neuclip
        </Link>
      </div>
    );
  }
  return <PublicSite templateId={page.site.templateId} content={page.site.content} />;
};

export default PublishedSitePage;
