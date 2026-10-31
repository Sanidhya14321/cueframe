import { ExternalLink, Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeleteSiteButton } from '@/components/sites/delete-site-button';
import { Button } from '@/components/ui/button';
import { sitePreviewPath } from '@/lib/sites';
import { listSites } from '@/local/sites';
import { publicSitePath, siteEditorPath } from '@/sites/published-site';
import { findSiteTemplate } from '@/sites/templates';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'My websites · Neuclip' };

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);

const WebsitesPage = async () => {
  const sites = await listSites();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl">My websites</h1>
          <p className="text-muted-foreground text-sm">
            Websites saved on this computer. Edit one and save changes to its local preview.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/library?type=site">
            <Plus />
            New website
          </Link>
        </Button>
      </div>

      {sites.length === 0 ? (
        <p className="rounded-2xl bg-muted/50 p-8 text-center text-muted-foreground text-sm">
          You have not saved a website yet. Pick a template to start one.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sites.map((site) => {
            const template = findSiteTemplate(site.templateId);
            const address = publicSitePath(site.slug);
            return (
              <li key={site.id} className="flex items-center gap-4 rounded-2xl bg-muted/50 p-3">
                {/* biome-ignore lint/performance/noImgElement: template previews are small static jpgs */}
                <img
                  src={sitePreviewPath(site.templateId)}
                  alt=""
                  className="h-20 w-12 shrink-0 rounded-md object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Link
                    href={siteEditorPath(site.id)}
                    className="truncate font-medium hover:underline"
                  >
                    {template?.headline(site.content) ?? site.slug}
                  </Link>
                  <span className="truncate text-muted-foreground text-sm">{address}</span>
                  <span className="text-muted-foreground text-xs">
                    {template?.meta.title ?? site.templateId} · Updated {formatDate(site.updatedAt)}
                    {site.draft === null ? null : ' · Unsaved preview changes'}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button asChild size="icon-sm" variant="ghost">
                    <a
                      href={address}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${address}`}
                    >
                      <ExternalLink />
                    </a>
                  </Button>
                  <Button asChild size="icon-sm" variant="ghost">
                    <Link href={siteEditorPath(site.id)} aria-label={`Edit ${address}`}>
                      <Pencil />
                    </Link>
                  </Button>
                  <DeleteSiteButton id={site.id} address={address} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default WebsitesPage;
